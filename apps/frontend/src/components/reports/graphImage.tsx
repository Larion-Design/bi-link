import React, { useId } from 'react'
import { View } from '@react-pdf/renderer'
import { GraphAPI } from 'defs'
import { Graph } from '../entityViews/graph'

type Props = GraphAPI & {
  entityId: string
}

export const GraphImage: React.FunctionComponent<Props> = ({ label, entityId }) => {
  return (
    <View
      render={() => {
        const graphId = useId()
        return <Graph entityId={entityId} id={graphId} />
      }}
    />
  )
}
