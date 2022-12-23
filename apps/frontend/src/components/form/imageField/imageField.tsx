import React, { useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { FormikErrors } from 'formik'
import { getDownloadUrlRequest } from '../../../graphql/shared/queries/getDownloadUrl'
import { FileUploadBox } from '../fileField/FileUploadBox'
import { FileAPIInput } from '../../../types/file'

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
  const [getImageUrl, { data, loading }] = getDownloadUrlRequest()

  useEffect(() => {
    if (fileInfo?.fileId && !loading) {
      void getImageUrl({
        variables: {
          objectId: fileInfo.fileId,
        },
      })
    }
  }, [fileInfo?.fileId])

  return (
    <Box sx={{ height: 250, width: 250 }}>
      <FileUploadBox
        addUploadedFile={updateImage}
        acceptedFileTypes={[
          'image/png',
          'image/jpg',
          'image/jpeg',
          'image/gif',
          'image/webp',
        ]}
      >
        {data?.getDownloadUrl.url ? (
          <Avatar
            variant={'square'}
            src={data.getDownloadUrl.url}
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
