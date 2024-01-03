import React, { useCallback } from 'react'
import { Trustworthiness as TrustworthinessType } from 'defs'
import { FormattedMessage } from 'react-intl'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { DropdownList } from '@frontend/components/form/dropdownList'
import { InputField } from '@frontend/components/form/inputField'
import { useTrustLevelLocale } from '@frontend/components/form/metadata/hooks'

type Props<T = TrustworthinessType> = {
  trustworthiness: T
  updateTrustworthiness: (trustworthiness: T) => void
}

export const Trustworthiness: React.FunctionComponent<Props> = ({
  trustworthiness: { level, source },
  updateTrustworthiness,
}) => {
  const trustLevelLocale = useTrustLevelLocale()

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
      <Stack spacing={1}>
        <Typography variant={'body1'}>
          <FormattedMessage id={'Information trust level'} />
        </Typography>

        <DropdownList
          size={'small'}
          value={level.toString()}
          options={trustLevelLocale}
          onChange={updateTrustLevel}
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant={'body1'}>
          <FormattedMessage id={'Information source'} />
        </Typography>
        <InputField size={'small'} value={source} onChange={updateSource} />
      </Stack>
    </Stack>
  )
}
