import React from 'react'
import { MenuItem } from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ListItemText from '@mui/material/ListItemText'

type Props = {
  disabled?: boolean
  actionHandler: () => void
}

export const RemoveFieldMenuItem: React.FunctionComponent<Props> = ({
  disabled,
  actionHandler,
}) => (
  <MenuItem onClick={actionHandler} disabled={disabled}>
    <ListItemIcon>
      <DeleteOutlineOutlinedIcon fontSize={'small'} color={'error'} />
    </ListItemIcon>
    <ListItemText color={'error'}>Sterge</ListItemText>
  </MenuItem>
)
