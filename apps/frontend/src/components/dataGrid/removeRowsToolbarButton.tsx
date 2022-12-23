import React from 'react'
import Button from '@mui/material/Button'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useDialog } from '../dialog/dialogProvider'

type Props = {
  skipPrompt?: boolean
  onRemovalConfirmed: () => void
}

export const RemoveRowsToolbarButton: React.FunctionComponent<Props> = ({
  onRemovalConfirmed,
  skipPrompt,
}) => {
  const { openDialog } = useDialog()

  const confirmHandler = skipPrompt
    ? onRemovalConfirmed
    : () =>
        openDialog({
          title: 'Esti sigur(a) ca vrei sa stergi informatiile selectate?',
          description: 'Odata sterse, acestea nu vor mai putea fi recuperate.',
          onConfirm: onRemovalConfirmed,
        })

  return (
    <Button
      size={'small'}
      variant={'contained'}
      color={'error'}
      startIcon={<DeleteOutlinedIcon />}
      onClick={confirmHandler}
      sx={{ ml: 1 }}
    >
      Sterge
    </Button>
  )
}
