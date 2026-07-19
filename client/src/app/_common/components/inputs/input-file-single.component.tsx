// /pages/index.tsx
import React, { useState } from "react"
import { PATH_UPLOADS } from "../../configs/constants"
import { DateTime } from "../../utilities/datetime.utility"

const InputFileSingle = ({
  setFile,
  label = "File",
  previewFile,
  eventDelete = undefined,
  accept = "*",
}: {
  setFile: (file?: File) => void
  label?: string
  previewFile?: { name: string; size: number; duration?: number }
  eventDelete?: (params?: any) => any
  accept?: string
}) => {
  const [preview, setPreview] = useState<
    { name: string; size: number; duration?: number } | undefined
  >(previewFile)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview({
        name: f.name,
        size: f.size,
        duration: preview?.duration || 0,
      })
    }
  }

  const handleRemoveFile = () => {
    setPreview(undefined)
    setFile(undefined)
    if (eventDelete) {
      eventDelete()
    }
  }

  const PreviewFile = () => {
    return (
      <ul className="space-y-2.5 w-full">
        <li className="bg-[#E4FDED] dark:bg-darkblack-500 py-3 px-2 pr-4 flex justify-between items-center rounded-lg">
          <div className="flex items-center gap-x-3 text-ellipsis overflow-hidden whitespace-nowrap">
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
                {preview?.name}
              </h5>
              <span className="text-xs text-bgray-500 text-left">
                {((preview?.size || 0) / 1000000).toFixed(2) + " MB"}{" "}
                {preview?.duration ? (
                  <span className="text-success-300 pl-3">
                    {DateTime.formatDuration(preview.duration)}
                  </span>
                ) : (
                  ""
                )}
              </span>
            </div>
          </div>
          <button aria-label="none" onClick={handleRemoveFile}>
            <i className="pi pi-times p-3 stroke-bgray-900" />
          </button>
        </li>
      </ul>
    )
  }

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexGrow: 1,
      }}
    >
      <div
        className="cursor-pointer flex justify-center items-center border-2 border-dashed border-bgray-500 rounded-lg"
        style={{
          position: "relative",
          display: "flex",
          flexGrow: 1,
          height: "100%",
          cursor: "pointer",
          overflow: "hidden",
        }}
        onClick={() =>
          !preview && document.getElementById("fileInput")?.click()
        }
      >
        {!preview && (
          <>
            {/*        <i
              className="pi pi-file p-3 m-2 text-bgray-600"
              style={{
                fontSize: "1.5em",
                borderRadius: "50%",
                backgroundColor: "var(--surface-b)",
                color: "var(--surface-d)",
              }}
            ></i> */}
            <i
              className="p-3 m-2"
              style={{
                borderRadius: "50%",
                backgroundColor: "var(--surface-b)",
              }}
            >
              <svg
                width="28px"
                height="28px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM12 17C12 14.2386 14.2386 12 17 12C19.7614 12 22 14.2386 22 17C22 19.7614 19.7614 22 17 22C14.2386 22 12 19.7614 12 17ZM17 10C13.134 10 10 13.134 10 17C10 20.866 13.134 24 17 24C20.866 24 24 20.866 24 17C24 13.134 20.866 10 17 10ZM16.5547 14.1679C16.2478 13.9634 15.8533 13.9443 15.5281 14.1183C15.203 14.2923 15 14.6312 15 15V19C15 19.3688 15.203 19.7077 15.5281 19.8817C15.8533 20.0557 16.2478 20.0366 16.5547 19.8321L19.5547 17.8321C19.8329 17.6466 20 17.3344 20 17C20 16.6656 19.8329 16.3534 19.5547 16.1679L16.5547 14.1679Z"
                  fill="var(--surface-d)"
                />
              </svg>
            </i>
            <span className=" text-bgray-600 font-medium">{label}</span>
          </>
        )}
        {preview && <PreviewFile />}
      </div>
      <input
        id="fileInput"
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  )
}

export default InputFileSingle
