import React from 'react'
import Box from '@mui/material/Box'
import { FileAPIInput } from 'defs'
import { ImagesTargetEntitySelector } from './imagesTargetEntitySelector'
import { ReportImagesList } from './reportImagesList'

type Props = {
  entityId?: string
  selectedImages: FileAPIInput[]
  updateImages: (images: FileAPIInput[]) => void
}

export const ReportContentImages: React.FunctionComponent<Props> = ({
  selectedImages,
  updateImages,
  entityId,
}) => (
  <>
    {!!selectedImages.length && (
      <Box sx={{ width: 1 }}>
        <ReportImagesList images={selectedImages} setImages={updateImages} />
      </Box>
    )}
    {!!entityId && (
      <ImagesTargetEntitySelector
        entityId={entityId}
        selectedImages={selectedImages}
        updateImages={updateImages}
      />
    )}
  </>
)
