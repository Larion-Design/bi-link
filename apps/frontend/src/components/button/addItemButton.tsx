import React from 'react'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

type Props = {
  label?: string
  onClick: () => void
  disabled?: boolean
}

export const AddItemButton: React.FunctionComponent<Props> = ({ label, onClick, disabled }) => (
  <Button disabled={disabled} variant={'contained'} sx={{ flex: 1 }} onClick={onClick}>
    <Tooltip title={label}>
      <AddOutlinedIcon />
    </Tooltip>
  </Button>
)
