import React from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'

type Props = {
  onClick: () => void
}

export const AddItemToolbarButton: React.FunctionComponent<Props> = ({
  onClick,
}) => (
  <Button
    size={'small'}
    variant={'contained'}
    startIcon={<AddOutlinedIcon />}
    onClick={onClick}
  >
    Adaugă
  </Button>
)
