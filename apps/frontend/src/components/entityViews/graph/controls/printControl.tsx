import React, { useCallback } from 'react'
import PrintIcon from '@mui/icons-material/Print'
import { ControlButton } from 'reactflow'
import { toPng } from 'html-to-image'

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
      }).then((dataUrl) => {
        const link = document.createElement('a')
        link.href = dataUrl
        link.click()
      }),
    [],
  )

  return (
    <ControlButton disabled onClick={convertToImage}>
      <PrintIcon fontSize={'small'} />
    </ControlButton>
  )
}
