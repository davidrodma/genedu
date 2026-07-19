import { useDataTableCustomContext } from "@/app/_common/components/datatable"
import { PATH_UPLOADS } from "@/app/_common/configs/constants"
import { contentStatusTemplate } from "@/app/_common/models"
import { Content } from "@/app/_common/models/content/content.model"
import { DateTime } from "@/app/_common/utilities/datetime.utility"
import { ColumnProps } from "primereact/column"
import { Tooltip } from "primereact/tooltip"
import { useEffect } from "react"

type Model = Content

export const Columns = () => {
  const { hiddenColumns, setHiddenColumns } = useDataTableCustomContext<Model>()

  useEffect(() => {
    setHiddenColumns({
      id: true,
      noteError: true,
      language: true,
      mediaDescription: true,
      lastStatus: true,
      createdAt: true,
      updatedAt: true,
    })
  }, [setHiddenColumns])

  const columns: ColumnProps[] = [
    {
      field: "id",
      header: "ID",
      sortable: true,
      hidden: hiddenColumns?.id,
    },
    {
      field: "subject",
      header: "Subject",
      sortable: true,
      align: "left",
    },
    {
      field: "language",
      header: "Language",
      sortable: true,
      align: "center",
      hidden: hiddenColumns?.language,
    },
    {
      field: "resources",
      header: "Resources",
      sortable: false,
      align: "right",
      body: (rowData: Model) => {
        const youtubeLink = rowData.media?.youtubeLink ? (
          <a href={rowData.media.youtubeLink} target="_blank">
            <div
              className="flex items-center justify-center"
              id={`youtube-link-${rowData.id}`}
              data-pr-tooltip={"YouTube Video (Link)"}
              data-pr-position="bottom"
            >
              <div
                className={`bg-opacity-10 bg-[#ff0033] text-[#ff0033] dark:bg-darkblack-500 rounded-full text-sm font-medium text-am w-8 h-8 flex items-center justify-center `}
              >
                <i className="pi pi-youtube text-lg"></i>
              </div>
            </div>
            <Tooltip target={`#youtube-link-${rowData.id}`} />
          </a>
        ) : null
        const mediaFile = rowData.media?.mediaFile ? (
          <a
            href={`${PATH_UPLOADS}/medias/${rowData.media.mediaFile}`}
            target="_blank"
          >
            <div
              className="flex items-center justify-center"
              data-pr-tooltip={"Media File (Video/Audio)"}
              data-pr-position="bottom"
              id={`media-file-${rowData.id}`}
            >
              <div
                className={`bg-opacity-10 bg-blue-400 text-blue-400 dark:bg-darkblack-500 rounded-full text-sm font-medium text-am w-8 h-8 flex items-center justify-center `}
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG Path */}
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM12 17C12 14.2386 14.2386 12 17 12C19.7614 12 22 14.2386 22 17C22 19.7614 19.7614 22 17 22C14.2386 22 12 19.7614 12 17ZM17 10C13.134 10 10 13.134 10 17C10 20.866 13.134 24 17 24C20.866 24 24 20.866 24 17C24 13.134 20.866 10 17 10ZM16.5547 14.1679C16.2478 13.9634 15.8533 13.9443 15.5281 14.1183C15.203 14.2923 15 14.6312 15 15V19C15 19.3688 15.203 19.7077 15.5281 19.8817C15.8533 20.0557 16.2478 20.0366 16.5547 19.8321L19.5547 17.8321C19.8329 17.6466 20 17.3344 20 17C20 16.6656 19.8329 16.3534 19.5547 16.1679L16.5547 14.1679Z"
                    fill="#60a5fa"
                  />
                </svg>
              </div>
            </div>
            <Tooltip target={`#media-file-${rowData.id}`} />
          </a>
        ) : null

        const transcriptFile = rowData.transcription?.transcriptFile ? (
          <a
            href={`${PATH_UPLOADS}/medias/${rowData.transcription.transcriptFile}`}
            target="_blank"
          >
            <div
              className="flex items-center justify-center"
              data-pr-tooltip={"Transcript File (SRT)"}
              data-pr-position="bottom"
              id={`transcript-file-${rowData.id}`}
            >
              <div
                className={`bg-opacity-10 bg-purple text-purple dark:bg-darkblack-500 rounded-full text-sm font-medium text-am w-8 h-8 flex items-center justify-center `}
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG Path */}
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73812 18.875L2.72681 21.1705C2.44361 21.4937 2.67314 22 3.10288 22H12Z"
                    stroke="#936dff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 9H17"
                    stroke="#936dff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 13H11"
                    stroke="#936dff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <Tooltip target={`#transcript-file-${rowData.id}`} />
          </a>
        ) : null
        const textFile = rowData.textContent?.textFile ? (
          <a
            href={`${PATH_UPLOADS}/docs/${rowData.textContent.textFile}`}
            target="_blank"
          >
            <div
              className="flex items-center justify-center"
              data-pr-tooltip={"Text File (PDF)"}
              data-pr-position="bottom"
              id={`text-file-${rowData.id}`}
            >
              <div
                className={`bg-opacity-10 bg-gray-500 text-[#ff484a] dark:bg-darkblack-500 rounded-full text-sm font-medium text-am w-8 h-8 flex items-center justify-center `}
              >
                <i className="pi pi-file-pdf text-lg"></i>
              </div>
            </div>
            <Tooltip target={`#text-file-${rowData.id}`} />
          </a>
        ) : null
        const presentationFile = rowData.presentation?.presentationFile ? (
          <a
            href={`${PATH_UPLOADS}/docs/${rowData.presentation.presentationFile}`}
            target="_blank"
          >
            <div
              className="flex items-center justify-center"
              data-pr-tooltip={"Presentation File (PPTX)"}
              data-pr-position="bottom"
              id={`presentation-file-${rowData.id}`}
            >
              <div
                className={`bg-opacity-10 bg-[#c94425] text-[#c94425] dark:bg-darkblack-500 rounded-full text-sm font-medium text-am w-8 h-8 flex items-center justify-center `}
              >
                <svg
                  fill="#c94425"
                  width="20px"
                  height="20px"
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.267 12.998c0.031-0.002 0.067-0.003 0.103-0.003 0.384 0 0.743 0.107 1.049 0.293l-0.009-0.005c0.265 0.217 0.433 0.544 0.433 0.91 0 0.048-0.003 0.096-0.009 0.143l0.001-0.006c0.001 0.012 0.001 0.026 0.001 0.040 0 0.19-0.058 0.367-0.158 0.513l0.002-0.003c-0.103 0.141-0.232 0.256-0.381 0.341l-0.006 0.003c-0.152 0.085-0.33 0.149-0.518 0.181l-0.010 0.001c-0.167 0.032-0.359 0.050-0.555 0.051h-1.349v-2.459zM17.874 27.247c0.010 0 0.022 0 0.033 0 0.993 0 1.955-0.131 2.871-0.376l-0.077 0.018c0.977-0.259 1.831-0.609 2.626-1.054l-0.057 0.029c1.628-0.907 2.968-2.147 3.965-3.635l0.026-0.041c0.998-1.489 1.654-3.287 1.813-5.225l0.003-0.040h-12.125v-12.125c-1.509 0.12-2.898 0.526-4.149 1.164l0.063-0.029c-1.314 0.665-2.43 1.527-3.359 2.56l-0.009 0.010h5.257c0.686 0.003 1.242 0.559 1.245 1.244v12.507c-0.003 0.686-0.559 1.242-1.244 1.245h-5.258c0.528 0.586 1.106 1.108 1.733 1.566l0.032 0.022c0.587 0.431 1.252 0.825 1.956 1.15l0.072 0.030c0.635 0.296 1.379 0.548 2.153 0.719l0.073 0.013c0.706 0.158 1.516 0.249 2.347 0.249 0.004 0 0.008 0 0.011 0h-0.001zM12.236 14.257c0.001-0.027 0.001-0.059 0.001-0.090 0-0.494-0.105-0.964-0.295-1.388l0.009 0.022c-0.184-0.397-0.45-0.728-0.778-0.983l-0.006-0.004c-0.332-0.251-0.724-0.444-1.15-0.552l-0.023-0.005c-0.425-0.111-0.913-0.175-1.416-0.175-0.017 0-0.034 0-0.051 0l0.003-0h-3.968v9.826h2.299v-3.427h1.552c0.002 0 0.004 0 0.006 0 0.497 0 0.976-0.078 1.425-0.222l-0.033 0.009c0.467-0.145 0.873-0.355 1.233-0.624l-0.011 0.008c0.358-0.267 0.651-0.602 0.864-0.986l0.008-0.016c0.207-0.386 0.329-0.844 0.329-1.33 0-0.022-0-0.044-0.001-0.065l0 0.003zM18.812 4.797v10.266h10.266c-0.117-1.417-0.486-2.723-1.061-3.909l0.029 0.066c-1.141-2.378-3.017-4.252-5.329-5.36l-0.068-0.029c-1.119-0.544-2.421-0.912-3.795-1.029l-0.041-0.003zM17.874 2.879c0.013-0 0.029-0 0.045-0 1.227 0 2.414 0.171 3.539 0.491l-0.091-0.022c4.457 1.264 7.896 4.703 9.137 9.067l0.023 0.093c0.298 1.047 0.469 2.25 0.469 3.493s-0.171 2.445-0.491 3.586l0.022-0.093c-1.264 4.457-4.703 7.896-9.067 9.137l-0.093 0.023c-1.046 0.299-2.247 0.472-3.488 0.472-2.22 0-4.312-0.551-6.145-1.523l0.071 0.034c-1.902-1.012-3.476-2.409-4.666-4.096l-0.028-0.042h-4.861c-0.005 0-0.011 0-0.017 0-0.339 0-0.644-0.14-0.863-0.366l-0-0c-0.226-0.218-0.366-0.524-0.366-0.862 0-0.006 0-0.011 0-0.017v0.001-12.506c-0-0.005-0-0.011-0-0.016 0-0.338 0.14-0.644 0.366-0.862l0-0c0.218-0.226 0.524-0.366 0.862-0.366 0.006 0 0.011 0 0.017 0h4.86c1.218-1.729 2.792-3.125 4.624-4.103l0.071-0.035c1.757-0.936 3.842-1.486 6.055-1.486 0.005 0 0.010 0 0.015 0h-0.001z"></path>
                </svg>
              </div>
            </div>
            <Tooltip target={`#presentation-file-${rowData.id}`} />
          </a>
        ) : null
        return (
          <div className="flex items-center justify-end gap-2">
            {youtubeLink}
            {mediaFile}
            {transcriptFile}
            {textFile}
            {presentationFile}
          </div>
        )
      },
    },
    {
      field: "mediaDescription",
      header: "Description Media",
      sortable: true,
      hidden: hiddenColumns?.mediaDescription,
    },
    {
      field: "createdAt",
      sortable: true,
      header: "Created At",
      body: (rowData: Model) => DateTime.dateTemplate(rowData.createdAt),
      hidden: hiddenColumns?.createdAt,
    },
    {
      field: "updatedAt",
      sortable: true,
      header: "Updated At",
      hidden: hiddenColumns?.updatedAt,
      body: (rowData: Model) => DateTime.dateTemplate(rowData.updatedAt),
    },
    {
      field: "lastStatus",
      sortable: true,
      header: "Last Status",
      body: (rowData: Model) =>
        contentStatusTemplate(rowData.lastStatus, rowData),
      align: "center",
      hidden: hiddenColumns?.lastStatus,
    },
    {
      field: "status",
      sortable: true,
      header: "Status",
      body: (rowData: Model) => contentStatusTemplate(rowData.status, rowData),
      align: "center",
    },
  ]
  return columns
}
