import React, { useCallback } from 'react'
import PrintIcon from '@mui/icons-material/Print'
import { ControlButton } from 'reactflow'
import { toPng } from 'html-to-image'
import { openResource } from '../../../../utils/resourceUrl'

export const PrintControl: React.FunctionComponent = () => {
  const convertToImage = useCallback(
    () =>
      toPng(document.querySelector<HTMLElement>('.react-flow'), {
        cacheBust: true,
        filter: (node) => {
          return !(
            node?.classList?.contains('react-flow__minimap') ||
            node?.classList?.contains('react-flow__controls')
          )
        },
      }).then(openResource),
    [],
  )

  return (
    <ControlButton onClick={convertToImage}>
      <PrintIcon fontSize={'small'} />
    </ControlButton>
  )
}
