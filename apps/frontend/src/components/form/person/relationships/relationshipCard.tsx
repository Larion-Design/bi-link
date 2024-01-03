import React, { useMemo } from 'react'
import { PersonAPIOutput, RelationshipAPI } from 'defs'
import { InputField } from '@frontend/components/form/inputField'
import Stack from '@mui/material/Stack'
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
  personsInfo: Map<string, PersonAPIOutput>
  relationshipInfo: T
  updateRelationship: (relationshipInfo: T) => void
  removeRelationship: (personId: string) => void
}

export const RelationshipCard: React.FunctionComponent<Props> = ({
  relationshipInfo,
  personInfo,
  personsInfo,
  updateRelationship,
  removeRelationship,
}) => {
  const { _id: personId, images, cnp } = personInfo
  const fullName = getPersonFullName(personInfo)

  const relatedPersonsIds = useMemo(
    () => new Set(relationshipInfo.relatedPersons.map(({ _id }) => _id)),
    [relationshipInfo.relatedPersons],
  )

  return (
    <Card sx={{ width: 1 }} variant={'outlined'}>
      <CardContent>
        <Stack direction={'row'} alignItems={'center'} mb={2} spacing={2} sx={{ mb: 5, mt: 2 }}>
          <Avatar src={images[0]?.url?.url ?? ''} alt={fullName} sx={{ width: 50, height: 50 }} />
          <Stack justifyContent={'center'}>
            <Typography variant={'body1'}>{fullName}</Typography>

            {cnp?.value?.length ? <Typography variant={'caption'}>{cnp.value}</Typography> : null}
          </Stack>
        </Stack>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Stack spacing={4}>
              <DropdownList
                label={'Tipul de relatie'}
                value={relationshipInfo.type}
                options={relationshipsTypes}
                onChange={(type) => updateRelationship({ ...relationshipInfo, type })}
              />

              <DropdownList
                label={'Nivelul de apropiere'}
                value={relationshipInfo.proximity.toString()}
                options={proximityLevels}
                onChange={(proximity) =>
                  updateRelationship({ ...relationshipInfo, proximity: parseInt(proximity) })
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <RelatedPersonsList
              personId={personId}
              relatedPersons={relatedPersonsIds}
              personsInfo={personsInfo}
              updateRelatedPersons={(relatedPersons) =>
                updateRelationship({ ...relationshipInfo, relatedPersons })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              label={'Descriere'}
              value={relationshipInfo.description}
              onChange={(description) => updateRelationship({ ...relationshipInfo, description })}
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
