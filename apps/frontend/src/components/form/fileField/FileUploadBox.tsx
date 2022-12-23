import React, { PropsWithChildren, useEffect } from 'react'
import Box from '@mui/material/Box'
import { useDropzone } from 'react-dropzone'
import { FileAPIInput } from '../../../types/file'

type Props = {
  addUploadedFile: (fileInfo: FileAPIInput) => void | Promise<void>
  acceptedFileTypes?: string[]
}

export const FileUploadBox: React.FunctionComponent<
  PropsWithChildren<Props>
> = ({ addUploadedFile, children }) => {
  const { acceptedFiles, getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noDragEventsBubbling: true,
    noClick: true,
    useFsAccessApi: true,
  })

  useEffect(() => {
    if (!acceptedFiles.length) return

    const [file] = acceptedFiles

    if (file) {
      const formData = new FormData()
      formData.set('file', file)

      const abortController = new AbortController()

      fetch(`${import.meta.env.VITE_BACKEND_API}/fileUpload`, {
        method: 'POST',
        body: formData,
        signal: abortController.signal,
      })
        .then((response) => response.json())
        .then((fileInfo: FileAPIInput) => addUploadedFile(fileInfo))
        .catch((error) => console.error(error))

      return () => abortController.abort()
    }
  }, [acceptedFiles])

  return (
    <Box
      component={'div'}
      sx={(theme) => ({
        borderWidth: 2,
        borderColor: theme.palette.grey[900],
        borderStyle: 'dashed',
        backgroundColor: isDragActive
          ? theme.palette.background.paper
          : 'initial',
        opacity: isDragActive ? 0.3 : 1,
        display: 'flex',
        alignItems: 'stretch',
        width: 1,
        height: 1,
      })}
      {...getRootProps()}
    >
      {children}
    </Box>
  )
}
