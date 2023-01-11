export const openResource = (resource: string) => {
  const link = document.createElement('a')
  link.href = resource
  link.target = '_blank'
  link.click()
}
