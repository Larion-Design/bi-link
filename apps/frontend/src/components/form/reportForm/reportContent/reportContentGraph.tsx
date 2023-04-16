import React, { useEffect, useId } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import { GraphAPI } from 'defs'
import { ActionButton } from '../../../button/actionButton'
import { Graph } from '../../../entityViews/graph'
import { InputField } from '../../inputField'

type Props<T = GraphAPI> = {
  graphInfo: T
  updateGraph: (graphInfo: T) => void
  entityId?: string
  removeContent: () => void
  graphCreated: (graphId: string) => void
  graphRemoved: (graphId: string) => void
}

export const ReportContentGraph: React.FunctionComponent<Props> = ({
  entityId,
  graphInfo: { label },
  updateGraph,
  removeContent,
  graphCreated,
  graphRemoved,
}) => {
  const graphId = useId()

  useEffect(() => {
    graphCreated(graphId)
    return () => graphRemoved(graphId)
  }, [graphId])

  return (
    <>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InputField
              label={'Titlu'}
              value={label}
              onChange={(label) => updateGraph({ label })}
            />
          </Grid>
          {!!entityId && (
            <Grid item xs={12} sx={{ height: '50vh' }}>
              <Graph
                entityId={entityId}
                disableMap={true}
                disableControls={true}
                disableTitle={!label.length}
                title={label}
                id={graphId}
              />
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
      <AccordionActions>
        <ActionButton
          icon={<DeleteOutlinedIcon color={'error'} />}
          onClick={removeContent}
          label={'Sterge element'}
        />
      </AccordionActions>
    </>
  )
}
