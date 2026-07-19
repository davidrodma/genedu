export class DateTime {
  /** dd/mm/YYYYY - HH:ii || dd/mm/YYYYY às HH:ii || Seg, dd/mm/YYYYY às HH:ii*/
  static formatDateLocalAs = (
    date: string | Date,
    options?: {
      separator?: "-" | "às" | string
      addWeekday?: "start" | "end" | ""
      displayTime?: "HH:ii:ss" | "HH:ii" | ""
    }
  ): string => {
    const {
      separator = "-",
      addWeekday = "",
      displayTime = "HH:ii:ss",
    } = options || {}

    const dateJs = typeof date === "string" ? new Date(date) : date
    let dateStr = dateJs
      .toLocaleString()
      .replace(",", "")
      .replace(" ", ` ${separator} `)
    if (!displayTime) {
      const arrDate = dateStr.split(separator)
      dateStr = arrDate[0]
    } else if (displayTime === "HH:ii") {
      const arrDate = dateStr.split(":")
      arrDate.pop()
      dateStr = arrDate.join(":")
    }
    if (addWeekday) {
      const weekday = DateTime.weekDay(dateJs)
      dateStr =
        addWeekday === "start"
          ? `${weekday}, ${dateStr}`
          : `${dateStr}, ${weekday}`
    }
    return dateStr
  }

  static formatDateDefault = (date: string | Date) => {
    const formatHour = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    })
    const dateJs = typeof date === "string" ? new Date(date) : date
    const year = dateJs.getFullYear()
    const month = String(dateJs.getMonth() + 1).padStart(2, "0")
    const day = String(dateJs.getDate()).padStart(2, "0")
    const hourFormated = formatHour.format(dateJs)
    return `${year}-${month}-${day} ${hourFormated}`
  }

  /** Seg || Segunda */
  static weekDay = (
    date: string | Date,
    options?: {
      language?: "pt-br" | string
      size?: "short" | "long"
    }
  ): string => {
    const { language = "pt-br", size = "short" } = options || {}
    const dateJs = typeof date === "string" ? new Date(date) : date
    let weekday = dateJs.toLocaleString(language, { weekday: size })
    weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)
    weekday = weekday.replace(".", "")
    return weekday
  }

  /** 00:00:00 */
  static formatHHmmss = (seconds: number) => {
    return new Date(seconds * 1000).toISOString().slice(11, 19)
  }

  /** Format duration in seconds to HH:MM:SS format (removes leading zeros) */
  static formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    // If hours is 0, don't show hours part
    if (hours === 0) {
      // If minutes is also 0, only show seconds
      if (minutes === 0) {
        return `${remainingSeconds}`
      }
      // Show minutes and seconds
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    // Show hours, minutes and seconds
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`
  }

  /* 3d:06h:43mm:55s*/
  static secondsToDDHHmmss(secondsTotal: number) {
    let seconds = secondsTotal
    const days = parseInt((seconds / (24 * 3600)).toString())
    seconds = seconds % (24 * 3600)
    const hours = parseInt((seconds / 3600).toString())

    seconds %= 3600
    const minutes = parseInt((seconds / 60).toString())

    seconds %= 60
    let time = `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
    if (days > 0) {
      time = `${days}d ${time}`
    }
    return time
  }

  static dateTemplate = (date?: Date) => {
    return (
      <span className="whitespace-nowrap">
        {date && DateTime.formatDateLocalAs(date)}
      </span>
    )
  }
}
