import React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

type Props = {
  visible: boolean
  message: string
}

export const Loader: React.FunctionComponent<Props> = ({ visible, message }) => (
  <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={visible}>
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
      <CircularProgress variant={'indeterminate'} color={'inherit'} />
      <Typography variant={'h5'} mt={2}>
        {message}
      </Typography>
    </Box>
  </Backdrop>
)
