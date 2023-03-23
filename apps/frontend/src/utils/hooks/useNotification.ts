import { useCallback } from 'react'
import { useSnackbar, VariantType } from 'notistack'
import { useIntl } from 'react-intl'

export const useNotification = () => {
  const intl = useIntl()
  const { enqueueSnackbar } = useSnackbar()
  return useCallback(
    (message: string, variant: VariantType) =>
      enqueueSnackbar(intl.formatMessage({ id: message, defaultMessage: message }), { variant }),
    [enqueueSnackbar, intl],
  )
}
