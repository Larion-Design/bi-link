import React, { useCallback } from 'react'
import PrintIcon from '@mui/icons-material/Print'
import { ControlButton } from 'reactflow'
import { toJpeg } from 'html-to-image'
import { openResource } from '@frontend/utils/resourceUrl'

type Props = {
  graphId: string
}

export const PrintControl: React.FunctionComponent<Props> = ({ graphId }) => {
  const convertToImage = useCallback(() => {
    void toJpeg(document.querySelector<HTMLElement>(`#${graphId}`), {
      cacheBust: true,
      filter: (node) => !/react-flow__(minimap|controls|filters|title)/.test(node?.className ?? ''),
    }).then(openResource)
  }, [])

  return (
    <ControlButton onClick={convertToImage}>
      <PrintIcon fontSize={'small'} />
    </ControlButton>
  )
}
