import React from 'react'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import { CompanyListRecord } from '../../../types/company'
import { CompanyOwnerInformation } from './companyOwnerInformation'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { CompanyCardActions } from '../../card/companyCardActions'
import { LinkedEntityCustomFields } from '../linkedEntityCustomFields'
import { PropertyOwnerAPI } from '../../../types/propertyOwner'

type Props = {
  ownerInfo: PropertyOwnerAPI
  companyInfo: CompanyListRecord
  updateOwnerInfo: (ownerId: string, ownerInfo: PropertyOwnerAPI) => void
  removeOwner: (ownerId: string) => void
}

export const CompanyOwnerCard: React.FunctionComponent<Props> = ({
  ownerInfo,
  companyInfo,
  updateOwnerInfo,
  removeOwner,
}) => {
  const { _id, name } = companyInfo
  const { customFields } = ownerInfo
  return (
    <TimelineItem>
      <TimelineOppositeContent color="textSecondary">
        <Tooltip title={`Data la care ${name} a achiziționat vehiculul`}>
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
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <CompanyOwnerInformation
                  companyInfo={companyInfo}
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
          <CompanyCardActions
            name={name}
            companyId={_id}
            onRemove={() => removeOwner(_id)}
          />
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}
