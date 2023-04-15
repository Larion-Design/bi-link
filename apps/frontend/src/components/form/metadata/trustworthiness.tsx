import Stack from '@mui/material/Stack'
import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { DropdownList } from '@frontend/components/form/dropdownList'
import { InputField } from '@frontend/components/form/inputField'
import { Trustworthiness as TrustworthinessType } from 'defs'

type Props = {
  trustworthiness: TrustworthinessType
  updateTrustworthiness: (trustworthiness: TrustworthinessType) => void
}

export const Trustworthiness: React.FunctionComponent<Props> = ({
  trustworthiness: { level, source },
  updateTrustworthiness,
}) => {
  const [editingTrustLevel, setEditingTrustLevel] = useState(false)
  const [editingSource, setEditingSource] = useState(false)
  const { formatMessage } = useIntl()

  const trustLevelOptions = useMemo(
    () => ({
      0: formatMessage({ id: 'Unknown trust level' }),
      1: formatMessage({ id: 'Very weak trust level' }),
      2: formatMessage({ id: 'Weak trust level' }),
      3: formatMessage({ id: 'Average trust level' }),
      4: formatMessage({ id: 'Slightly trustworthy' }),
      5: formatMessage({ id: 'Very trustworthy' }),
    }),
    [formatMessage],
  )

  const updateTrustLevel = useCallback(
    (option: string) => updateTrustworthiness({ source, level: +option }),
    [updateTrustworthiness],
  )

  const updateSource = useCallback(
    (source: string) => updateTrustworthiness({ source, level }),
    [updateTrustworthiness],
  )

  return (
    <Stack spacing={3}>
      <Grid container spacing={1}>
        <Grid item xs={11}>
          <Typography variant={'h5'}>
            <FormattedMessage
              id={'Information trust level'}
              defaultMessage={'Information trust level'}
            />
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={() => setEditingTrustLevel((editing) => !editing)} size={'small'}>
            {editingTrustLevel ? (
              <CheckOutlinedIcon color={'success'} />
            ) : (
              <EditOutlinedIcon color={'primary'} />
            )}
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          {editingTrustLevel ? (
            <DropdownList
              value={level.toString()}
              options={trustLevelOptions}
              onChange={updateTrustLevel}
            />
          ) : (
            <Typography variant={'body2'}>{trustLevelOptions[level]}</Typography>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={11}>
          <Typography variant={'h5'}>
            <FormattedMessage id={'Information source'} defaultMessage={'Information source'} />
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={() => setEditingSource((editing) => !editing)} size={'small'}>
            {editingSource ? (
              <CheckOutlinedIcon color={'success'} />
            ) : (
              <EditOutlinedIcon color={'primary'} />
            )}
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          {editingSource ? (
            <Typography variant={'body2'}>{source}</Typography>
          ) : (
            <InputField value={source} onChange={updateSource} />
          )}
        </Grid>
      </Grid>
    </Stack>
  )
}
