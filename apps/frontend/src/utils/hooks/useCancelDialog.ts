import { useDialog } from '@frontend/components/dialog/dialogProvider'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

export const useCancelDialog = (redirectRoute: string) => {
  const intl = useIntl()
  const dialog = useDialog()
  const navigate = useNavigate()

  return useCallback(
    () =>
      dialog.openDialog({
        title: intl.formatMessage({
          id: "Are you sure you want to cancel the changes you've made?",
        }),
        description: intl.formatMessage({
          id: 'All unsaved changes will be lost',
        }),
        onConfirm: () => navigate(redirectRoute),
      }),
    [redirectRoute],
  )
}
