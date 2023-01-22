import Box from '@mui/material/Box'
import React, { useState } from 'react'
import { EntityType, FileAPIInput } from 'defs'
import { ImagesTargetEntitySelector } from './imagesTargetEntitySelector'
import { ReportImagesList } from './reportImagesList'

type Props = {
  entityId?: string
  entityType?: EntityType
  selectedImages: FileAPIInput[]
  updateImages: (images: FileAPIInput[]) => void
}

export const ReportContentImages: React.FunctionComponent<Props> = ({
  selectedImages,
  updateImages,
  entityId,
  entityType,
}) => (
  <>
    {!!selectedImages.length && (
      <Box sx={{ width: 1 }}>
        <ReportImagesList images={selectedImages} setImages={updateImages} />
      </Box>
    )}
    <Box sx={{ width: 1 }}>
      <ImagesTargetEntitySelector
        entityId={entityId}
        entityType={entityType}
        selectedImages={selectedImages}
        updateImages={updateImages}
      />
    </Box>
  </>
)
