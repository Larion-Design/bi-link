export function formatBytes(bytes: number) {
  if (bytes < 1) {
    return `0 B`
  }

  const thresh = 1000

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`
  }

  let u = -1
  const units: string[] = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  do {
    bytes /= thresh
    ++u
  } while (
    Math.round(Math.abs(bytes) * 10) / 10 >= thresh &&
    u < units.length - 1
  )
  return `${bytes.toFixed(1)} ${units[u] ?? ''}`
}

export function formatMimeType(mimeType: string) {
  const mimeTypes: Record<string, string> = {
    'image/gif': 'Imagine',
    'image/jpeg': 'Imagine',
    'image/png': 'Imagine',
    'image/webp': 'Imagine',
    'text/plain': 'Text',
    'application/pdf': 'Document',
    'application/rtf': 'Document',
    'application/msword': 'Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'Document',
    'application/vnd.ms-excel': 'Document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      'Document',
  }
  return mimeTypes[mimeType] ?? 'Generic'
}
