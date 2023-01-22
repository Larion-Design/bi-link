import React, { useCallback, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableHead from '@mui/material/TableHead'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { format } from 'date-fns'
import { EntityType, IdDocumentAPI } from 'defs'
import { useCopyToClipboard } from 'usehooks-ts'

type Props = {
  personId: string
  documents: IdDocumentAPI[]
}

export const PersonDocumentsTable: React.FunctionComponent<Props> = ({ personId, documents }) => {
  const [open, setOpen] = useState(true)
  const toggle = useCallback(() => setOpen((open) => !open), [setOpen])
  const [_, copyToClipboard] = useCopyToClipboard()

  const copyDocumentInfo = useCallback(
    (documentNumber: IdDocumentAPI['documentNumber'], fieldName: keyof IdDocumentAPI) =>
      copyToClipboard(
        `{{${'PERSON' as EntityType}:${personId}:documents:${documentNumber}:${fieldName}}}`,
      ),
    [personId, copyToClipboard],
  )

  return (
    <Accordion expanded={open} onChange={toggle}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>Documente de identitate</AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Tip de document</TableCell>
                <TableCell>Numar document</TableCell>
                <TableCell>Data emiterii</TableCell>
                <TableCell>Data expirarii</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map(({ documentType, documentNumber, issueDate, expirationDate }) => (
                <TableRow key={documentNumber}>
                  <TableCell onClick={() => void copyDocumentInfo(documentNumber, 'documentType')}>
                    {documentType}
                  </TableCell>
                  <TableCell>{documentNumber}</TableCell>
                  <TableCell>
                    {issueDate ? format(new Date(issueDate), 'YYYY-mm-DD') : ''}
                  </TableCell>
                  <TableCell>
                    {expirationDate ? format(new Date(expirationDate), 'YYYY-mm-DD') : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  )
}
