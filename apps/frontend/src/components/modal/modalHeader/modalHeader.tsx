import React from 'react'
import IconButton from '@mui/material/IconButton'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CardHeader from '@mui/material/CardHeader'

type Props = {
  title: string
  closeModal?: () => void
}

export const ModalHeader: React.FunctionComponent<Props> = ({
  title,
  closeModal,
}) => (
  <CardHeader
    title={title}
    action={
      <IconButton title={'Inchide'} onClick={closeModal}>
        <CloseOutlinedIcon color={'error'} />
      </IconButton>
    }
  />
)
