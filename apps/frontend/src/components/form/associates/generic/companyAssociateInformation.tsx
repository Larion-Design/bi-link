import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { AutocompleteField } from '../../autocompleteField'
import { DatePicker } from '../../datePicker'
import { AssociateAPIInput, CompanyListRecord } from 'defs'
import { ASSOCIATE_ROLES } from '../../../../utils/constants'
import TextField from '@mui/material/TextField'

type Props = {
  companyId: string
  companyInfo: CompanyListRecord
  associateInfo: AssociateAPIInput
  allowRoleChange: boolean
  updateAssociate: (personId: string, associateInfo: AssociateAPIInput) => void
}

export const CompanyAssociateInformation: React.FunctionComponent<Props> = ({
  companyId,
  associateInfo,
  companyInfo,
  allowRoleChange,
  updateAssociate,
}) => {
  const { role, startDate, endDate, isActive, equity } = associateInfo

  return (
    <>
      <Box display={'flex'} alignItems={'center'} mt={2} mb={4}>
        <Typography variant={'h6'}>{companyInfo.name}</Typography>
      </Box>

      <Grid container spacing={2}>
        {allowRoleChange && (
          <Grid item xs={12}>
            <AutocompleteField
              label={'Rol'}
              value={role}
              onValueChange={(value) =>
                updateAssociate(companyId, {
                  ...associateInfo,
                  role: value,
                })
              }
              suggestions={ASSOCIATE_ROLES}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <DatePicker
            label={'De la data'}
            value={startDate ?? null}
            onChange={(startDate) =>
              updateAssociate(companyId, {
                ...associateInfo,
                startDate: startDate ? new Date(startDate) : null,
              })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            label={'Pana la data'}
            value={endDate ?? null}
            onChange={(endDate) =>
              updateAssociate(companyId, {
                ...associateInfo,
                endDate: endDate ? new Date(endDate) : null,
                isActive: endDate ? new Date(endDate) > new Date() : isActive,
              })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={'% Actiuni'}
            type={'number'}
            inputProps={{ step: 0.01 }}
            value={equity.toFixed(2)}
            onChange={({ target: { value } }) =>
              updateAssociate(companyId, {
                ...associateInfo,
                equity: parseFloat(value),
              })
            }
          />
        </Grid>
      </Grid>
    </>
  )
}
