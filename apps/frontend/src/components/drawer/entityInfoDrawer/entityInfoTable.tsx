import Typography from '@mui/material/Typography'
import React, { useCallback, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { FormattedMessage } from 'react-intl'

type Props = {
  label: string
  data: Record<string, string | number>
  createDataRef: (key: string) => void
  missingDataMessage?: string
}

export const EntityInfoTable: React.FunctionComponent<Props> = ({
  label,
  data,
  createDataRef,
  missingDataMessage,
}) => {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((open) => !open), [setOpen])
  const dataEntries = Object.entries(data)

  return (
    <Accordion expanded={open} onChange={toggle} variant={'outlined'}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{label}</AccordionSummary>
      <AccordionDetails>
        {dataEntries.length > 0 ? (
          <TableContainer>
            <Table>
              <TableBody>
                {dataEntries.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>
                      <FormattedMessage id={key} defaultMessage={key} />
                    </TableCell>
                    <TableCell onClick={() => createDataRef(key)} sx={{ cursor: 'pointer' }}>
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant={'body2'}>{missingDataMessage}</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
