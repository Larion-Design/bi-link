import { QueryClient, useMutation } from '@tanstack/react-query'
import { FileAPIInput } from 'defs'

export const queryClient = new QueryClient()

export function useFileUpload() {
  return useMutation({
    mutationFn: async (file: File): Promise<FileAPIInput> => {
      const formData = new FormData()
      formData.set('file', file)

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/file-upload`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    },
  })
}
