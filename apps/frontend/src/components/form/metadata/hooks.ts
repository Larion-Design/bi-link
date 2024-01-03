import { useMemo } from 'react'
import { useIntl } from 'react-intl'

export const useTrustLevelLocale = () => {
  const intl = useIntl()
  return useMemo(
    () => ({
      0: intl.formatMessage({ id: 'Unknown trust level' }),
      1: intl.formatMessage({ id: 'Very weak trust level' }),
      2: intl.formatMessage({ id: 'Weak trust level' }),
      3: intl.formatMessage({ id: 'Average trust level' }),
      4: intl.formatMessage({ id: 'Slightly trustworthy' }),
      5: intl.formatMessage({ id: 'Very trustworthy' }),
    }),
    [intl],
  )
}
