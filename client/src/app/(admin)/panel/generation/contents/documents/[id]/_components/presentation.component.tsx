"use client"
import { useRef } from "react"
import { Content } from "@/app/_common/models/content/content.model"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { ContentStatus } from "@/app/_common/models/content/content-status.enum"
import { _routes } from "@/app/(admin)/_configs/_routes"
import { Toast } from "primereact/toast"
import { PATH_UPLOADS } from "@/app/_common/configs/constants"
import Files from "@/app/_common/components/settings/Files"
import { defaultThemeOption } from "@/app/(admin)/panel/generation/contents/_data/gamma-themes"

export const Presentation = ({ content }: { content: Content }) => {
  const toast = useRef<Toast>(null)

  const downloadPresentation = () => {
    if (!content?.presentation?.presentationFile) return

    const link = document.createElement("a")
    link.href = `${PATH_UPLOADS}/docs/${content.presentation.presentationFile}`
    link.download = `${content.subject}.pptx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.current?.show({
      severity: "success",
      summary: "Download Started",
      detail: "Presentation download has started",
      life: 3000,
    })
  }

  return (
    <Card className="font-urbanist bg-white dark:bg-darkblack-600 dark:border-darkblack-400 px-6 rounded-lg shadow-none mb-8">
      <Toast ref={toast} />
      {content.presentation?.presentationFile ? (
        <div className="text-center">
          <div className="mb-4">
            <div className="flex items-center justify-center ">
              <svg
                fill="#718096"
                width="100px"
                height="100px"
                viewBox="0 0 256 256"
                id="Flat"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M216,36H140V24a12,12,0,0,0-24,0V36H40A20.02229,20.02229,0,0,0,20,56V176a20.02229,20.02229,0,0,0,20,20H71.0332L54.62988,216.50391a11.9996,11.9996,0,1,0,18.74024,14.99218L101.76709,196h52.46582l28.397,35.49609a11.9996,11.9996,0,1,0,18.74024-14.99218L184.9668,196H216a20.02229,20.02229,0,0,0,20-20V56A20.02229,20.02229,0,0,0,216,36Zm-4,136H44V60H212ZM104,120v24a12,12,0,0,1-24,0V120a12,12,0,0,1,24,0Zm24-28a12.0006,12.0006,0,0,1,12,12v40a12,12,0,0,1-24,0V104A12.0006,12.0006,0,0,1,128,92Zm24,52V88a12,12,0,0,1,24,0v56a12,12,0,0,1-24,0Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Presentation Generated Successfully
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your presentation has been generated and is ready for download.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Presentation Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Theme:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {content.presentation?.themeName || defaultThemeOption.label}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Number of Cards:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {content.presentation?.numCards || 10}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Image Options:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {content.presentation?.imageOptions || "ai"}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">File:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {content.presentation.presentationFile}
                </span>
              </div>
            </div>
          </div>

          <Button
            label="Download Presentation"
            icon="pi pi-download"
            onClick={downloadPresentation}
            className="bg-success-300 hover:bg-success-400 text-white px-6 py-3 rounded-lg"
          />
        </div>
      ) : content.status === ContentStatus.REQUEST_PRESENTATION ||
        content.status === ContentStatus.GENERATING_PRESENTATION ||
        content.status === ContentStatus.DOWNLOADING_PRESENTATION ? (
        <div className="text-center">
          <div className="mb-4">
            <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {content.status === ContentStatus.REQUEST_PRESENTATION &&
                "Requesting Presentation"}
              {content.status === ContentStatus.GENERATING_PRESENTATION &&
                "Generating Presentation"}
              {content.status === ContentStatus.DOWNLOADING_PRESENTATION &&
                "Downloading Presentation"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {content.status === ContentStatus.REQUEST_PRESENTATION &&
                "Your presentation request is being processed."}
              {content.status === ContentStatus.GENERATING_PRESENTATION &&
                "Your presentation is being generated. This may take a few minutes."}
              {content.status === ContentStatus.DOWNLOADING_PRESENTATION &&
                "Your presentation is ready and being downloaded."}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <i className="pi pi-file text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Presentation Generated
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {content.status === ContentStatus.COMPLETED
                ? "The presentation generation process has completed, but no file was generated."
                : "The presentation generation process has not started yet."}
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
