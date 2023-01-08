import React, { useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { FormikErrors } from 'formik'
import { getFileInfoRequest } from '../../../graphql/files/getFileInfo'
import { FileUploadBox } from '../fileField/FileUploadBox'
import { FileAPIInput } from 'defs'

type Props = {
  fileInfo: FileAPIInput | null
  updateImage: (fileInfo: FileAPIInput) => void | Promise<void>
  readonly?: boolean
  error?: string | string[] | FormikErrors<FileAPIInput>[]
}

export const ImageField: React.FunctionComponent<Props> = ({
  fileInfo,
  updateImage,
  error: formError,
}) => {
  const [fetchFileInfo, { data }] = getFileInfoRequest()

  useEffect(() => {
    if (fileInfo?.fileId) {
      void fetchFileInfo({
        variables: {
          fileId: fileInfo.fileId,
        },
      })
    }
  }, [fileInfo?.fileId])

  return (
    <Box sx={{ height: 250, width: 250 }}>
      <FileUploadBox
        addUploadedFile={updateImage}
        acceptedFileTypes={['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp']}
      >
        {data?.getFileInfo.url.url ? (
          <Avatar
            variant={'square'}
            src={data?.getFileInfo.url.url}
            sx={{ height: 245, width: 245 }}
          />
        ) : (
          <Placeholder />
        )}
      </FileUploadBox>
    </Box>
  )
}

const Placeholder: React.FunctionComponent = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: 1,
      height: 1,
    }}
  >
    <CloudUploadOutlinedIcon fontSize={'large'} sx={{ mb: 1 }} />
    <Typography variant={'h6'}>Incarca o poza</Typography>
  </Box>
)
