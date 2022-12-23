import React from 'react'
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
import { PersonListRecordWithImage } from '../../../types/person'
import { getPersonFullName } from '../../../utils/person'
import { PersonCardActions } from '../../card/personCardActions'
import { PersonOwnerInformation } from './personOwnerInformation'
import { LinkedEntityCustomFields } from '../linkedEntityCustomFields'
import { PropertyOwnerAPI } from '../../../types/propertyOwner'

type Props = {
  ownerInfo: PropertyOwnerAPI
  personInfo: PersonListRecordWithImage
  updateOwnerInfo: (ownerId: string, ownerInfo: PropertyOwnerAPI) => void
  removeOwner: (ownerId: string) => void
}

export const PersonOwnerCard: React.FunctionComponent<Props> = ({
  ownerInfo,
  personInfo,
  updateOwnerInfo,
  removeOwner,
}) => {
  const fullName = getPersonFullName(personInfo)
  const { _id } = personInfo
  const { customFields } = ownerInfo
  return (
    <TimelineItem>
      <TimelineOppositeContent color={'textSecondary'}>
        <Tooltip title={`Data la care ${fullName} a achiziționat vehiculul`}>
          <Typography variant={'subtitle1'}>
            {ownerInfo?.startDate
              ? new Date(ownerInfo.startDate).toLocaleDateString()
              : 'Data nedefinita'}
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
                <PersonOwnerInformation
                  personInfo={personInfo}
                  ownerInfo={ownerInfo}
                  updateOwner={updateOwnerInfo}
                />
              </Grid>
              <Grid item xs={7} container>
                <LinkedEntityCustomFields
                  customFields={customFields}
                  updateCustomFields={(customFields) =>
                    updateOwnerInfo(_id, {
                      ...ownerInfo,
                      customFields,
                    })
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
          <PersonCardActions
            name={fullName}
            personId={_id}
            onRemove={() => removeOwner(_id)}
          />
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}
