import React from 'react'
import { InputField } from '@frontend/components/form/inputField'
import Stack from '@mui/material/Stack'
import { PersonAPIOutput, RelationshipAPI } from 'defs'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { proximityLevels, relationshipsTypes } from '@frontend/components/form/person/constants'
import { getPersonFullName } from '@frontend/utils/person'
import { PersonCardActions } from '../../../card/personCardActions'
import { DropdownList } from '../../dropdownList'
import { RelatedPersonsList } from '@frontend/components/form/person/relatedPersonsList'

type Props<T = RelationshipAPI> = {
  personInfo: PersonAPIOutput
  relatedPersonsInfo: PersonAPIOutput[]
  relationshipInfo: T
  updateRelationship: (personId: string, relationshipInfo: T) => void
  removeRelationship: (personId: string) => void
}

export const RelationshipCard: React.FunctionComponent<Props> = ({
  relationshipInfo,
  personInfo,
  relatedPersonsInfo,
  updateRelationship,
  removeRelationship,
}) => {
  const { _id: personId, images } = personInfo
  const fullName = getPersonFullName(personInfo)

  return (
    <Card sx={{ width: 1 }} variant={'outlined'}>
      <CardHeader sx={{ display: 'flex' }}>
        <Avatar
          src={images[0]?.url?.url ?? ''}
          alt={fullName}
          sx={{ width: 75, height: 75, mt: 2 }}
        />
        <Typography variant={'body1'} sx={{ mb: 3, mt: 2 }} gutterBottom>
          {fullName}
        </Typography>
      </CardHeader>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Stack spacing={4}>
              <DropdownList
                label={'Tipul de relatie'}
                value={relationshipInfo.type}
                onChange={(type) => updateRelationship(personId, { ...relationshipInfo, type })}
                options={relationshipsTypes}
              />

              <DropdownList
                label={'Nivelul de apropiere'}
                value={relationshipInfo.proximity.toString()}
                options={proximityLevels}
                onChange={(proximity) =>
                  updateRelationship(personId, {
                    ...relationshipInfo,
                    proximity: parseInt(proximity),
                  })
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <RelatedPersonsList
              personId={personId}
              relatedPersons={relationshipInfo.relatedPersons}
              personsInfo={relatedPersonsInfo}
              updateRelatedPersons={(relatedPersons) =>
                updateRelationship(personId, { ...relationshipInfo, relatedPersons })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              label={'Descriere'}
              value={relationshipInfo.description}
              onChange={(description) =>
                updateRelationship(personId, { ...relationshipInfo, description })
              }
              multiline={true}
              rows={5}
            />
          </Grid>
        </Grid>
      </CardContent>
      <PersonCardActions
        name={fullName}
        personId={personId}
        onRemove={() => removeRelationship(personId)}
      />
    </Card>
  )
}
