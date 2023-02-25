import { proximityLevels, relationshipsTypes } from '@frontend/components/form/person/constants'
import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getPersonFullName } from '@frontend/utils/person'
import { PersonCardActions } from '../../../card/personCardActions'
import { DropdownList } from '../../dropdownList'
import { PersonListRecordWithImage, RelationshipAPIInput } from 'defs'

type Props = {
  personInfo: PersonListRecordWithImage
  relationshipInfo: RelationshipAPIInput
  updateRelationship: (personId: string, relationshipInfo: RelationshipAPIInput) => void
  removeRelationship: (personId: string) => void
}

export const PersonCard: React.FunctionComponent<Props> = ({
  relationshipInfo,
  personInfo,
  updateRelationship,
  removeRelationship,
}) => {
  const { _id: personId, images } = personInfo
  const fullName = getPersonFullName(personInfo)

  return (
    <Card sx={{ height: 400 }} variant={'outlined'}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={images[0]?.url?.url ?? ''}
          alt={fullName}
          sx={{ width: 75, height: 75, mt: 2 }}
        />
        <Typography variant={'body1'} sx={{ mb: 3, mt: 2 }} gutterBottom>
          {fullName}
        </Typography>

        <Box width={1} mb={4}>
          <DropdownList
            label={'Tipul de relatie'}
            value={relationshipInfo.type}
            onChange={(type) => updateRelationship(personId, { ...relationshipInfo, type })}
            options={relationshipsTypes}
          />
        </Box>

        <Box width={1} mb={2}>
          <DropdownList
            label={'Nivelul de apropiere'}
            value={relationshipInfo.proximity.toString()}
            onChange={(proximity) =>
              updateRelationship(personId, {
                ...relationshipInfo,
                proximity: parseInt(proximity),
              })
            }
            options={proximityLevels}
          />
        </Box>
      </CardContent>
      <PersonCardActions
        name={fullName}
        personId={personId}
        onRemove={() => removeRelationship(personId)}
      />
    </Card>
  )
}
