import React, { useMemo } from 'react'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { CustomFieldAPI, PersonAPIOutput } from 'defs'
import { getPersonFullName } from '@frontend/utils/person'
import { formatDate } from 'tools'
import { usePropertyState } from '../../../../state/property/propertyState'
import { PersonCardActions } from '../../../card/personCardActions'
import { PersonOwnerInformation } from './personOwnerInformation'
import { LinkedEntityCustomFields } from '../../linkedEntityCustomFields'

type Props = {
  ownerId: string
  personInfo: PersonAPIOutput
}

export const PersonOwnerCard: React.FunctionComponent<Props> = ({ ownerId, personInfo }) => {
  const {
    owners,
    ownersCustomFields,
    removeOwner,
    addOwnerCustomField,
    updateOwnerCustomField,
    removeOwnerCustomFields,
  } = usePropertyState()

  const ownerInfo = owners.get(ownerId)
  const fullName = getPersonFullName(personInfo)
  const { _id } = personInfo

  const customFields = useMemo(() => {
    if (ownerInfo.customFields.size) {
      const map = new Map<string, CustomFieldAPI>()
      ownerInfo.customFields.forEach((uid) => map.set(uid, ownersCustomFields.get(uid)))
      return map
    }
  }, [ownerInfo.customFields, ownersCustomFields])

  return (
    <TimelineItem>
      <TimelineOppositeContent color={'textSecondary'}>
        <Tooltip title={`Data la care ${fullName} a achiziționat vehiculul`}>
          <Typography variant={'subtitle1'}>
            {ownerInfo.startDate.value ? formatDate(ownerInfo.startDate.value) : 'Data nedefinita'}
          </Typography>
        </Tooltip>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Card sx={{ minHeight: 300, p: 1, mt: 4 }} variant={'outlined'}>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={5}>
                <PersonOwnerInformation ownerId={ownerId} personInfo={personInfo} />
              </Grid>
              <Grid item xs={7} container>
                <LinkedEntityCustomFields
                  customFields={customFields}
                  updateCustomField={updateOwnerCustomField}
                  addCustomField={() => addOwnerCustomField(ownerId)}
                  removeCustomFields={(ids) => removeOwnerCustomFields(ownerId, ids)}
                />
              </Grid>
            </Grid>
          </CardContent>
          <PersonCardActions name={fullName} personId={_id} onRemove={() => removeOwner(ownerId)} />
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}
