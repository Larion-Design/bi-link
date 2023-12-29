import React, { useCallback } from 'react'
import Tooltip from '@mui/material/Tooltip'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import IconButton from '@mui/material/IconButton'
import { useDialog } from '../../dialog/dialogProvider'

type Props = {
  name: string
  onRemove: () => void
}

export const RemovePerson: React.FunctionComponent<Props> = ({ name, onRemove }) => {
  const dialog = useDialog()
  const openDialog = useCallback(
    () =>
      dialog.openDialog({
        title: `Esti sigur ca vrei sa anulezi asocierea cu ${name}?`,
        onConfirm: onRemove,
      }),
    [onRemove],
  )

  return (
    <IconButton onClick={openDialog}>
      <Tooltip title={`Sterge asocierea cu ${name}`}>
        <DeleteOutlineOutlinedIcon fontSize={'small'} color={'error'} />
      </Tooltip>
    </IconButton>
  )
}
