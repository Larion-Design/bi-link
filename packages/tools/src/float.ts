export const roundFloat = (value: number, decimals = 2) =>
  Math.round((value + Number.EPSILON) * 10 ** decimals) / 10 ** decimals
