import Typography from '@mui/material/Typography'
import React, { useEffect, useMemo } from 'react'
import { EntityType } from 'defs'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { getPropertiesByCompanyRequest } from '../../../graphql/properties/queries/getPropertiesByCompany'
import { getPropertiesByPersonRequest } from '../../../graphql/properties/queries/getPropertiesByPerson'

type Props = {
  entityId: string
  entityType: EntityType
}

export const PropertiesTable: React.FunctionComponent<Props> = ({ entityId, entityType }) => {
  const [fetchPersonProperties, { data: personProperties }] = getPropertiesByPersonRequest()
  const [fetchCompanyProperties, { data: companyProperties }] = getPropertiesByCompanyRequest()

  useEffect(() => {
    switch (entityType) {
      case 'PERSON': {
        void fetchPersonProperties({ variables: { personId: entityId } })
        break
      }
      case 'COMPANY': {
        void fetchCompanyProperties({ variables: { companyId: entityId } })
        break
      }
    }
  }, [entityId, entityType])

  const properties = useMemo(() => {
    switch (entityType) {
      case 'PERSON':
        return personProperties?.getPropertiesByPerson ?? []
      case 'COMPANY':
        return companyProperties?.getPropertiesByCompany ?? []
    }
  }, [entityType, personProperties, companyProperties])

  return properties?.length ? (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Nume</TableCell>
            <TableCell>Tip de proprietate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {properties.map(({ _id, name, type }, index) => (
            <TableRow key={_id}>
              <TableCell>{index}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Typography gutterBottom>Nu au fost gasite proprietati.</Typography>
  )
}
