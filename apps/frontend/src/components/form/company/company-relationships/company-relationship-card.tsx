import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { DropdownList } from 'components/form/dropdownList'
import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CompanyAPIOutput, CompanyRelationshipType } from 'defs'
import { useCompanyState } from 'state/company/companyState'
import { PersonCardActions } from 'components/card/personCardActions'

type Props = {
  entityId: string
  companyInfo: CompanyAPIOutput
  mandatoryFields?: string[]
}

export const CompanyRelationshipCard: React.FunctionComponent<Props> = ({
  entityId,
  companyInfo,
}) => {
  const { _id, name } = companyInfo
  const [relationship, removeRelationship, updateRelationshipType] = useCompanyState(
    ({ relationships, removeRelationship, updateRelationshipType }) => [
      relationships.get(entityId),
      removeRelationship,
      updateRelationshipType,
    ],
  )

  return (
    <Card sx={{ minHeight: 300, p: 1 }} variant={'outlined'}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant={'h6'} mt={2} mb={4} gutterBottom>
            {companyInfo.name.value}
          </Typography>

          <DropdownList
            value={relationship.type}
            options={{
              SUPPLIER: 'Furnizor',
              COMPETITOR: 'Competitor',
              DISPUTING: 'Parte aflata in litigii',
            }}
            onChange={(value) => updateRelationshipType(entityId, value as CompanyRelationshipType)}
          />
        </Stack>
      </CardContent>
      <PersonCardActions
        personId={_id}
        name={name.value}
        onRemove={() => removeRelationship(entityId)}
      />
    </Card>
  )
}
