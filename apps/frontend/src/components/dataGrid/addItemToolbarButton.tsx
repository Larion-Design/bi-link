import React from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'
import { FormattedMessage } from 'react-intl'

type Props = {
  onClick: () => void
}

export const AddItemToolbarButton: React.FunctionComponent<Props> = ({ onClick }) => (
  <Button size={'small'} variant={'contained'} startIcon={<AddOutlinedIcon />} onClick={onClick}>
    <FormattedMessage id={'Add'} />
  </Button>
)
