import React, { useMemo } from 'react'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import { CompanyAPIOutput, CustomFieldAPI } from 'defs'
import { formatDate } from 'tools'
import { usePropertyState } from '../../../../state/property/propertyState'
import { CompanyOwnerInformation } from './companyOwnerInformation'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { CompanyCardActions } from '../../../card/companyCardActions'
import { LinkedEntityCustomFields } from '../../linkedEntityCustomFields'

type Props = {
  ownerId: string
  companyInfo: CompanyAPIOutput
}

export const CompanyOwnerCard: React.FunctionComponent<Props> = ({ ownerId, companyInfo }) => {
  const {
    owners,
    ownersCustomFields,
    removeOwnerCustomFields,
    updateOwnerCustomField,
    addOwnerCustomField,
    removeOwner,
  } = usePropertyState()
  const {
    _id,
    name: { value: companyName },
  } = companyInfo

  const ownerInfo = owners.get(ownerId)
  const customFields = useMemo(() => {
    if (ownerInfo.customFields.size) {
      const map = new Map<string, CustomFieldAPI>()
      ownerInfo.customFields.forEach((uid) => map.set(uid, ownersCustomFields.get(uid)))
      return map
    }
  }, [ownerInfo.customFields, ownersCustomFields])

  return (
    <TimelineItem>
      <TimelineOppositeContent color="textSecondary">
        <Tooltip title={`Data la care ${companyName} a achiziționat vehiculul`}>
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
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <CompanyOwnerInformation ownerId={ownerId} companyInfo={companyInfo} />
              </Grid>
              <Grid item xs={7} container>
                <LinkedEntityCustomFields
                  customFields={customFields}
                  addCustomField={() => addOwnerCustomField(ownerId)}
                  updateCustomField={updateOwnerCustomField}
                  removeCustomFields={(ids) => removeOwnerCustomFields(ownerId, ids)}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CompanyCardActions
            name={companyName}
            companyId={_id}
            onRemove={() => removeOwner(_id)}
          />
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}
