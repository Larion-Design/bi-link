import { useCallback } from 'react'
import { useSnackbar, VariantType } from 'notistack'

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar()
  return useCallback(
    (message: string, variant: VariantType) => enqueueSnackbar(message, { variant }),
    [enqueueSnackbar],
  )
}
