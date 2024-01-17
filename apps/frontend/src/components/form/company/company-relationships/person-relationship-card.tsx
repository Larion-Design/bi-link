import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AssociateSwitchAction } from 'components/form/company/associates/generic/associateSwitchAction'
import { PersonAssociateInformation } from 'components/form/company/associates/generic/personAssociateInformation'
import { DropdownList } from 'components/form/dropdownList'
import { LinkedEntityCustomFields } from 'components/form/linkedEntityCustomFields'
import React, { useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CompanyAPIOutput, CompanyRelationshipType, CustomFieldAPI, PersonAPIOutput } from 'defs'
import { useCompanyState } from 'state/company/companyState'
import { PersonCardActions } from 'components/card/personCardActions'
import { getPersonFullName } from 'utils/person'

type Props = {
  entityId: string
  personInfo: PersonAPIOutput
}

export const PersonRelationshipCard: React.FunctionComponent<Props> = ({
  entityId,
  personInfo,
}) => {
  const fullName = getPersonFullName(personInfo)
  const { _id } = personInfo

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
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Avatar
              src={personInfo.images[0]?.url?.url ?? ''}
              alt={fullName}
              sx={{ width: 30, height: 30 }}
            />

            <Typography variant={'h6'}>{fullName}</Typography>
          </Stack>

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
      <PersonCardActions personId={_id} name={fullName} onRemove={() => removeRelationship(_id)} />
    </Card>
  )
}
