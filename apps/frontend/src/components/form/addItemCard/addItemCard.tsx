import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Card from '@mui/material/Card'
import React from 'react'

type Props = {
  onClick: () => void
}

export const AddItemCard: React.FunctionComponent<Props> = ({ onClick }) => (
  <Card
    sx={{
      minHeight: 400,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    }}
    onClick={onClick}
    color={'primary'}
  >
    <AddOutlinedIcon color={'primary'} sx={{ fontSize: 50 }} />
  </Card>
)
