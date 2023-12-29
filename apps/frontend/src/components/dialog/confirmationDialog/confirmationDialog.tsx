import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { FormattedMessage } from 'react-intl'

type Props = {
  open?: boolean
  title?: string
  description?: string
  closeDialog?: () => void
  confirmAction?: () => void
}

export const ConfirmationDialog: React.FunctionComponent<Props> = ({
  open,
  title,
  description,
  closeDialog,
  confirmAction,
}) => (
  <Dialog
    open={!!open && (!!title?.length || !!description?.length)}
    onClose={closeDialog}
    data-cy={'confirmationDialog'}
    keepMounted
  >
    {title && <DialogTitle data-cy={'confirmationDialogTitle'}>{title}</DialogTitle>}
    {description && (
      <DialogContent>
        <DialogContentText data-cy={'confirmationDialogText'}>{description}</DialogContentText>
      </DialogContent>
    )}
    <DialogActions>
      <Button
        color={'error'}
        onClick={closeDialog}
        sx={{ mr: 2 }}
        data-cy={'confirmationDialogCancel'}
      >
        <FormattedMessage id={'cancel'} />
      </Button>
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={() => {
          closeDialog?.()
          confirmAction?.()
        }}
        data-cy={'confirmationDialogProceed'}
      >
        <FormattedMessage id={'confirm'} />
      </Button>
    </DialogActions>
  </Dialog>
)
