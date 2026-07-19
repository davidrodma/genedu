// components/FileUpload.tsx
import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

export const FileUpload = ({
  setFile,
  previewPath = "",
  eventDelete,
}: {
  setFile: (file?: File) => void
  previewPath?: string
  eventDelete?: (params?: any) => any
}) => {
  const [preview, setPreview] = useState<string | null>(previewPath)
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        setPreview(file.name)
        setFile(file)
      })
    },
    [setFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleRemoveFile = () => {
    alert("ok")
    setPreview(null)
    setFile(undefined)
    if (eventDelete) {
      eventDelete()
    }
  }

  const PreviewFile = ({ filename }: { filename: string }) => {
    return (
      <ul className="space-y-2.5">
        <li className="bg-[#E4FDED] dark:bg-darkblack-500 py-3 px-2 pr-4 flex justify-between items-center rounded-lg">
          <div className="flex items-center gap-x-3">
            <span className="bg-white dark:bg-darkblack-600 w-10 h-10 rounded-lg inline-flex justify-center items-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8334 2.74951V6.41618C12.8334 6.65929 12.93 6.89245 13.1019 7.06436C13.2738 7.23627 13.5069 7.33285 13.75 7.33285H17.4167"
                  stroke="#22C55E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5834 19.2495H6.41671C5.93048 19.2495 5.46416 19.0564 5.12034 18.7125C4.77653 18.3687 4.58337 17.9024 4.58337 17.4162V4.58285C4.58337 4.09661 4.77653 3.6303 5.12034 3.28648C5.46416 2.94267 5.93048 2.74951 6.41671 2.74951H12.8334L17.4167 7.33285V17.4162C17.4167 17.9024 17.2236 18.3687 16.8797 18.7125C16.5359 19.0564 16.0696 19.2495 15.5834 19.2495Z"
                  stroke="#22C55E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.25 8.24951H9.16667"
                  stroke="#22C55E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.25 11.916H13.75"
                  stroke="#22C55E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.25 15.583H13.75"
                  stroke="#22C55E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="flex flex-col">
              <h5 className="font-semibold text-bgray-900 dark:text-white text-sm">
                {filename}
              </h5>
              <span className="text-xs text-bgray-500">50 Kb</span>
            </div>
          </div>
          <button aria-label="none" onClick={handleRemoveFile}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="stroke-bgray-900 dark:stroke-bgray-50"
                d="M17.5 12.4995V15.8328C17.5 16.2749 17.3244 16.6988 17.0118 17.0114C16.6993 17.3239 16.2754 17.4995 15.8333 17.4995H4.16667C3.72464 17.4995 3.30072 17.3239 2.98816 17.0114C2.67559 16.6988 2.5 16.2749 2.5 15.8328V12.4995"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.83337 8.33301L10 12.4997L14.1667 8.33301"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 12.4995V2.49951"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>
      </ul>
    )
  }

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-400 p-4 rounded-md cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : preview ? (
        <PreviewFile filename={preview} />
      ) : (
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      )}
    </div>
  )
}
