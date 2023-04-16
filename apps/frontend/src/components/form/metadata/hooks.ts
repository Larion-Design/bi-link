import { useMemo } from 'react'
import { useIntl } from 'react-intl'

export const useTrustLevelLocale = () => {
  const { formatMessage } = useIntl()
  return useMemo(
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
}
