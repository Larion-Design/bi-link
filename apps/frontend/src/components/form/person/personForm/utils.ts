export const getBirthdateFromCnp = (cnp: string) => {
  if (cnp.length !== 13) return null

  const matches = new RegExp(
    /^[1-9](\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)(00[1-9]|0[1-9]\d|[1-9]\d\d)\d$/,
  ).exec(cnp)

  if (matches?.length === 6) {
    const year = matches[1]
    const month = matches[2]
    const day = matches[3]
    const s = cnp.charAt(0)

    const intervals: Record<string, number> = {
      1: 1900,
      2: 1900,
      3: 1800,
      4: 1800,
      5: 2000,
      6: 2000,
    }

    const date = new Date()
    date.setFullYear((intervals[s] ?? 1900) + parseInt(year))
    date.setMonth(parseInt(month) - 1)
    date.setDate(parseInt(day))
    return date
  }
  return null
}
