import React, { useCallback, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined'
import { FileAPIInput } from 'defs'
import { getFileInfoRequest } from '../../../graphql/files/getFileInfo'
import { imageTypeRegex } from '../../../utils/mimeTypes'
import { FileUploadBox } from '../fileField/FileUploadBox'
import { useModal } from '../../modal/modalProvider'

type Props<T = FileAPIInput> = {
  images: Map<string, T>
  setImages: (filesInfo: T[]) => void
  addImage: (fileInfo: T) => void
  updateImage: (fileInfo: T) => void
  removeImages: (uid: string[]) => void
}

export const Images: React.FunctionComponent<Props> = ({ images, addImage, setImages }) => {
  const [fetchFileInfo, { data }] = getFileInfoRequest()
  const modal = useModal()

  useEffect(() => {
    const fileId = Array.from(images.values())[0]?.fileId

    if (fileId) {
      void fetchFileInfo({ variables: { fileId } })
    }
  }, [images])

  const openImageGallery = useCallback(
    () => modal?.openImageGallery(Array.from(images.values()), setImages),
    [images, setImages],
  )

  return (
    <Box sx={{ height: 250, width: 250, position: 'relative' }}>
      {!!images.size && (
        <Tooltip title={`Vezi toate cele ${images.size} imagini`}>
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
        addUploadedFile={(image) => addImage(image)}
        acceptedFileTypes={imageTypeRegex}
      >
        {data?.getFileInfo.url.url ? (
          <Avatar
            variant={'square'}
            src={data.getFileInfo.url.url}
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
  <Stack sx={{ width: 1, height: 1 }} justifyContent={'center'} alignItems={'center'} spacing={1}>
    <CloudUploadOutlinedIcon fontSize={'large'} sx={{ mb: 1 }} />
    <Typography variant={'h6'}>Incarca o poza</Typography>
  </Stack>
)
