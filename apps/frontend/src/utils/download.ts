export const downloadFile = (url: string) => {
  const a = document.createElement('a')
  a.download = a.href = url
  a.target = '_blank'
  a.click()
}
