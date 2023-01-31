import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import React, { useEffect, useId } from 'react'
import Box from '@mui/material/Box'
import { GraphAPI } from 'defs'
import { ActionButton } from '../../../button/actionButton'
import { Graph } from '../../../entityViews/graph'
import { InputField } from '../../inputField'

type Props = {
  entityId?: string
  graphInfo: GraphAPI
  updateGraph: (graphInfo: GraphAPI) => void
  removeContent: () => void
  graphCreated: (graphId: string) => void
}

export const ReportContentGraph: React.FunctionComponent<Props> = ({
  entityId,
  graphInfo: { label },
  updateGraph,
  removeContent,
  graphCreated,
}) => {
  const graphId = useId()

  useEffect(() => {
    graphCreated(graphId)
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
              <Graph entityId={entityId} disableMap={true} title={label} id={graphId} />
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
