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
  data: Record<string, string>
}

export const EntityInfoTable: React.FunctionComponent<Props> = ({ label, data }) => {
  const [open, setOpen] = useState(true)
  const toggle = useCallback(() => setOpen((open) => !open), [setOpen])

  return (
    <Accordion expanded={open} onChange={toggle}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{label}</AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table>
            <TableBody>
              {Object.entries(data).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>
                    <FormattedMessage id={key} />
                  </TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  )
}
