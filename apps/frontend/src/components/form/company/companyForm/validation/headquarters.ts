export const validateHeadquarters = async (headquarters: string) => {
  if (headquarters.length && headquarters.length < 3) {
    return Promise.resolve('Adresa trebuie sa contina minim trei caractere.')
  }
}
