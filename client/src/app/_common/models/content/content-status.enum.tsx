import { Tooltip } from "primereact/tooltip"
import { Content } from "./content.model"
import { Badge } from "primereact/badge"

export enum ContentStatus {
  PENDING = 0,
  DOWNLOADING_MEDIA = 1,
  CONVERTING_AUDIO = 2,
  TRANSCRIBING_AUDIO = 3,
  GENERATING_TEXT = 4,
  REQUEST_PRESENTATION = 5,
  GENERATING_PRESENTATION = 6,
  DOWNLOADING_PRESENTATION = 7,
  COMPLETED = 8,
  ERROR = 9,
  CANCELED = 10,
  PARTIAL = 11,
}

export const contentStatusArray = [
  { key: ContentStatus.PENDING, label: "Pending" },
  { key: ContentStatus.DOWNLOADING_MEDIA, label: "Downloading Media" },
  { key: ContentStatus.CONVERTING_AUDIO, label: "Converting Audio" },
  { key: ContentStatus.TRANSCRIBING_AUDIO, label: "Transcribing Audio" },
  { key: ContentStatus.GENERATING_TEXT, label: "Generating Text" },
  { key: ContentStatus.REQUEST_PRESENTATION, label: "Request Presentation" },
  {
    key: ContentStatus.GENERATING_PRESENTATION,
    label: "Generating Presentation",
  },
  {
    key: ContentStatus.DOWNLOADING_PRESENTATION,
    label: "Downloading Presentation",
  },
  { key: ContentStatus.COMPLETED, label: "Completed" },
  { key: ContentStatus.ERROR, label: "Error" },
  { key: ContentStatus.CANCELED, label: "Canceled" },
  { key: ContentStatus.PARTIAL, label: "Partial" },
]

export const contentStatusTemplate = (
  status: ContentStatus,
  content: Content
) => {
  const label = contentStatusArray?.find((item) => item.key == status)?.label
  const tooltip =
    content && content?.messageError && status == ContentStatus.ERROR
      ? content.messageError
      : ""
  return (
    <>
      <span
        data-pr-tooltip={tooltip}
        data-pr-position="bottom"
        className={`status-badge-${
          content?.id
        } inline-flex  items-center gap-2 ${
          {
            [ContentStatus.PENDING]: "bg-opacity-10 bg-gray-700 text-gray-700",
            [ContentStatus.DOWNLOADING_MEDIA]:
              "bg-opacity-10 bg-warning-200 text-warning-200",
            [ContentStatus.CONVERTING_AUDIO]:
              "bg-opacity-10 bg-warning-200 text-warning-200",
            [ContentStatus.TRANSCRIBING_AUDIO]:
              "bg-opacity-10 bg-warning-300 text-warning-300",
            [ContentStatus.GENERATING_TEXT]:
              "bg-opacity-10 bg-bamber-500 text-bamber-500",
            [ContentStatus.REQUEST_PRESENTATION]:
              "bg-opacity-10 bg-bamber-500 text-bamber-500",
            [ContentStatus.GENERATING_PRESENTATION]:
              "bg-opacity-10 bg-bamber-500 text-bamber-500",
            [ContentStatus.DOWNLOADING_PRESENTATION]:
              "bg-opacity-10 bg-bamber-500 text-bamber-500",
            [ContentStatus.COMPLETED]:
              "bg-opacity-10 bg-success-400 text-success-400",
            [ContentStatus.ERROR]: " bg-error-300 text-white",
            [ContentStatus.CANCELED]:
              "bg-opacity-10 bg-error-300 text-error-300 line-through",
            [ContentStatus.PARTIAL]: "bg-opacity-10 bg-gray-900 text-gray-900",
          }[status]
        } dark:bg-darkblack-500 rounded text-sm font-medium text-am px-3 py-1`}
      >
        {status < ContentStatus.COMPLETED && (
          <i className="pi pi-spin pi-spinner"></i>
        )}
        {label}
      </span>
      {tooltip && <Tooltip target={`.status-badge-${content?.id}`} />}
    </>
  )
}

export const getStatusBadge = (status: ContentStatus) => {
  const statusMap = {
    [ContentStatus.PENDING]: { label: "Pending", severity: "info" as const },
    [ContentStatus.DOWNLOADING_MEDIA]: {
      label: "Downloading Media",
      severity: "info" as const,
    },
    [ContentStatus.CONVERTING_AUDIO]: {
      label: "Converting Audio",
      severity: "warning" as const,
    },
    [ContentStatus.TRANSCRIBING_AUDIO]: {
      label: "Transcribing Audio",
      severity: "warning" as const,
    },
    [ContentStatus.GENERATING_TEXT]: {
      label: "Generating Text",
      severity: "info" as const,
    },
    [ContentStatus.REQUEST_PRESENTATION]: {
      label: "Request Presentation",
      severity: "info" as const,
    },
    [ContentStatus.GENERATING_PRESENTATION]: {
      label: "Generating Presentation",
      severity: "info" as const,
    },
    [ContentStatus.DOWNLOADING_PRESENTATION]: {
      label: "Downloading Presentation",
      severity: "info" as const,
    },
    [ContentStatus.COMPLETED]: {
      label: "Completed",
      severity: "success" as const,
    },
    [ContentStatus.ERROR]: { label: "Error", severity: "danger" as const },
    [ContentStatus.CANCELED]: {
      label: "Canceled",
      severity: "warning" as const,
    },
    [ContentStatus.PARTIAL]: { label: "Partial", severity: "warning" as const },
  }
  const statusInfo = statusMap[status] || {
    label: "Unknown",
    severity: "info" as const,
  }
  return <Badge value={statusInfo.label} severity={statusInfo.severity} />
}
