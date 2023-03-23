export const validateCompanyName = async (name: string, companyId?: string) => {
  if (name.length && name.length < 2) {
    return Promise.resolve('Numele trebuie sa contina minim doua caractere.')
  }
}
