import React, { useMemo } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import { EntityType, TableAPI } from 'defs'
import { ActionButton } from '../../../button/actionButton'
import { AssociatesTable } from '../../../reports/tables/associatesTable'
import { PropertiesTable } from '../../../reports/tables/propertiesTable'
import { RelationshipsTable } from '../../../reports/tables/relationshipsTable'
import { DropdownList } from '../../dropdownList'

type Props = {
  entityId?: string
  entityType?: EntityType
  tableInfo: TableAPI
  updateTable: (tableInfo: TableAPI) => void
  removeContent: () => void
}

type PredefinedTables = 'properties' | 'associates' | 'relationships'

export const ReportContentTable: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  tableInfo: { id },
  updateTable,
  removeContent,
}) => {
  const options = useMemo(() => {
    switch (entityType) {
      case 'PERSON': {
        return { properties: 'Proprietati si bunuri', relationships: 'Relatii cu alte persoane' }
      }
      case 'COMPANY':
        return { properties: 'Proprietati si bunuri', associates: 'Asociati' }
      default:
        return {}
    }
  }, [entityType])

  const table = useMemo(() => {
    switch (id as PredefinedTables) {
      case 'properties': {
        return <PropertiesTable entityId={entityId} entityType={entityType} />
      }
      case 'relationships': {
        return <RelationshipsTable personId={entityId} />
      }
      case 'associates': {
        return <AssociatesTable companyId={entityId} />
      }
    }
    return null
  }, [id, entityType, entityId])

  return (
    <>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DropdownList value={id} options={options} onChange={(id) => updateTable({ id })} />
          </Grid>

          <Grid item xs={12}>
            {table}
          </Grid>
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
