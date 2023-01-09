import React, { useCallback, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined'
import IconButton from '@mui/material/IconButton'
import { FormikErrors } from 'formik'
import { imageTypeRegex } from '../../../utils/mimeTypes'
import { FileUploadBox } from '../fileField/FileUploadBox'
import { FileAPIInput } from 'defs'
import { getDownloadUrlRequest } from '../../../graphql/shared/queries/getDownloadUrl'
import { useModal } from '../../modal/modalProvider'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  images: FileAPIInput[]
  updateImages: (fileInfo: FileAPIInput[]) => void | Promise<void>
  readonly?: boolean
  error?: string | string[] | FormikErrors<FileAPIInput>[]
}

export const Images: React.FunctionComponent<Props> = ({ images, updateImages }) => {
  const [fetchImageUrl, { data }] = getDownloadUrlRequest()
  const modal = useModal()

  useEffect(() => {
    const firstImageId = images[0]?.fileId

    if (firstImageId) {
      void fetchImageUrl({
        variables: {
          objectId: firstImageId,
        },
      })
    }
  }, [images[0]?.fileId])

  const openImageGallery = useCallback(
    () => modal?.openImageGallery(images, updateImages),
    [images, updateImages],
  )

  return (
    <Box sx={{ height: 250, width: 250, position: 'relative' }}>
      {!!images.length && (
        <Tooltip title={`Vezi toate cele ${images.length} imagini`}>
          <IconButton
            onClick={openImageGallery}
            sx={{ position: 'absolute', bottom: 2, right: 2, zIndex: 1000 }}
          >
            <CollectionsOutlinedIcon
              fontSize={'medium'}
              sx={({ palette: { grey } }) => ({ color: grey[200] })}
            />
          </IconButton>
        </Tooltip>
      )}
      <FileUploadBox
        addUploadedFile={(image) => updateImages([...images, image])}
        acceptedFileTypes={imageTypeRegex}
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
