export function differenceMinutes(startDate: Date | string, endDate = new Date()) {
  const startAt = typeof startDate == 'string' ? new Date(startDate) : startDate
  const differenceInMilliseconds = endDate.getTime() - startAt.getTime()
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60)
  return differenceInMinutes
}
