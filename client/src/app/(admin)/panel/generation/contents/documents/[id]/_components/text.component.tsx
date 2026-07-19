"use client"
import { useRef } from "react"
import { Content } from "@/app/_common/models/content/content.model"
import { Card } from "primereact/card"
import { Message } from "primereact/message"
import { Divider } from "primereact/divider"
import { getStatusBadge } from "@/app/_common/models/content/content-status.enum"
import { _routes } from "@/app/(admin)/_configs/_routes"
import { Toast } from "primereact/toast"
import { Button } from "@/app/_common/components/button/button.component"
import Link from "next/link"
import { PATH_UPLOADS } from "@/app/_common/configs/constants"

export const Text = ({ content }: { content: Content }) => {
  const toast = useRef<Toast>(null)

  const copyToClipboard = async () => {
    if (!content?.textContent?.generatedText) return

    try {
      await navigator.clipboard.writeText(content.textContent.generatedText)
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: `Text copied to clipboard!`,
        life: 3000,
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = content.textContent.generatedText
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand("copy")
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: `Text copied to clipboard (fallback)!`,
          life: 3000,
        })
      } catch (fallbackErr) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: `Fallback copy failed : ${fallbackErr}`,
          life: 3000,
        })
      }
      document.body.removeChild(textArea)
    }
  }

  const downloadPDF = () => {
    if (!content?.textContent?.textFile) return
    window.open(
      `${PATH_UPLOADS}/docs/${content.textContent.textFile}`,
      "_blank"
    )
  }

  const formatMarkdownToHTML = (text: string): string => {
    if (!text) return ""

    return (
      text
        // Headers
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Code blocks
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        // Inline code
        .replace(/`(.*?)`/g, "<code>$1</code>")
        // Lists
        .replace(/^\* (.*$)/gim, "<li>$1</li>")
        .replace(/^- (.*$)/gim, "<li>$1</li>")
        .replace(/^(\d+)\. (.*$)/gim, "<li>$2</li>")
        // Line breaks
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>")
        // Wrap in paragraphs
        .replace(/^(.*)$/gim, "<p>$1</p>")
        // Clean up empty paragraphs
        .replace(/<p><\/p>/g, "")
        // Clean up list items
        .replace(/<p><li>/g, "<li>")
        .replace(/<\/li><\/p>/g, "</li>")
        // Wrap consecutive list items in ul
        .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>")
        .replace(/<\/ul><ul>/g, "")
    )
  }

  return (
    <Card className="font-urbanist bg-white dark:bg-darkblack-600 dark:border-darkblack-400 px-6 rounded-lg shadow-none">
      <Toast ref={toast} />
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {content.subject}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              <strong>Language:</strong> {content.language}
            </span>
            <span>
              <strong>Status:</strong> {getStatusBadge(content.status)}
            </span>
            <span>
              <strong>Updated:</strong>{" "}
              {new Date(content.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-x-4">
          <Button
            icon="pi pi-copy"
            onClick={copyToClipboard}
            disabled={!content.textContent?.generatedText}
            addClassName="!text-bgray-600 !bg-bgray-200 whitespace-nowrap rounded-lg dark:bg-darkblack-600 dark:text-white gap-x-2 p-4 inline-flex items-center justify-center text-base border border-transparent hover:border-success-300 transition duration-300 ease-in-out "
          >
            <span>Copy</span>
          </Button>
          <Button
            icon="pi pi-download"
            onClick={downloadPDF}
            disabled={!content.textContent?.generatedText}
            addClassName="!text-bgray-600 !bg-bgray-200 whitespace-nowrap rounded-lg text-gray-600 dark:bg-darkblack-600 dark:text-white gap-x-2 p-4 inline-flex items-center justify-center text-base text-bgray-600 border border-transparent hover:border-success-300 transition duration-300 ease-in-out"
          >
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      <Divider />

      {!content.textContent?.generatedText ? (
        <div className="text-center py-8">
          <Message
            severity="info"
            text="No generated text available yet. The text generation process may still be running."
          />
        </div>
      ) : (
        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: formatMarkdownToHTML(content.textContent.generatedText),
            }}
            className="text-gray-700 leading-relaxed"
          />
        </div>
      )}
    </Card>
  )
}
