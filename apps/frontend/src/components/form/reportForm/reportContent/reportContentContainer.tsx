import React, { PropsWithChildren } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionSummary from '@mui/material/AccordionSummary'

type ContainerProps = {
  title: string
  open: boolean
}

export const ContentElementContainer: React.FunctionComponent<
  PropsWithChildren<ContainerProps>
> = ({ title, open, children }) => {
  return (
    <>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{title}</AccordionSummary>
      {!open && !!children && <>{children}</>}
    </>
  )
}
