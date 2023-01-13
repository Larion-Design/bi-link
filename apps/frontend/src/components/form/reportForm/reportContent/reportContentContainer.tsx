import { AccordionActions } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import React, { PropsWithChildren, useCallback } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useDialog } from '../../../dialog/dialogProvider'

type ContainerProps = {
  title: string
  removeContent: () => void
}

export const ContentElementContainer: React.FunctionComponent<
  PropsWithChildren<ContainerProps>
> = ({ title, removeContent, children }) => {
  const dialog = useDialog()
  const remove = useCallback(
    () =>
      dialog.openDialog({
        title: 'Esti sigur ca vrei sa stergi acest continut?',
        description: 'Odata sters, continutul nu mai poate fi recuperat',
        onConfirm: removeContent,
      }),
    [dialog],
  )

  return (
    <>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{title}</AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
      <AccordionActions>
        <IconButton onClick={remove} size={'small'}>
          <DeleteOutlinedIcon color={'error'} />
        </IconButton>
      </AccordionActions>
    </>
  )
}
