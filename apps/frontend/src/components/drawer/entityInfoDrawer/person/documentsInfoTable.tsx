import React, { useCallback, useState } from 'react'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { IdDocumentAPI } from 'defs'
import { formatDate } from 'tools'

type Props = {
  documents: IdDocumentAPI[]
  createDataRef: <T = keyof IdDocumentAPI>(key: string, field: T | string) => void
}

export const DocumentsInfoTable: React.FunctionComponent<Props> = ({
  documents,
  createDataRef,
}) => {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((open) => !open), [setOpen])

  return (
    <Accordion expanded={open} onChange={toggle} variant={'outlined'}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>Documente de identitate</AccordionSummary>
      <AccordionDetails>
        {documents.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tip document</TableCell>
                  <TableCell>Numar document</TableCell>
                  <TableCell>Data emiterii</TableCell>
                  <TableCell>Data expirarii</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map(
                  ({ documentType, documentNumber, issueDate, expirationDate, status }) => (
                    <TableRow key={documentNumber}>
                      <TableCell onClick={() => createDataRef(documentNumber, 'documentType')}>
                        {documentType}
                      </TableCell>
                      <TableCell onClick={() => createDataRef(documentNumber, 'documentNumber')}>
                        {documentNumber}
                      </TableCell>
                      <TableCell onClick={() => createDataRef(documentNumber, 'issueDate')}>
                        {issueDate ? formatDate(issueDate) : 'Data nedefinita'}
                      </TableCell>
                      <TableCell onClick={() => createDataRef(documentNumber, 'expirationDate')}>
                        {expirationDate ? formatDate(expirationDate) : 'Data nedefinita'}
                      </TableCell>
                      <TableCell onClick={() => createDataRef(documentNumber, 'status')}>
                        {status}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant={'body2'}>Nu exista documente de identitate</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
