import React, { PropsWithChildren } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

type Props = {
  open: boolean
  closeDrawer: () => void
}

export const BasicDrawer: React.FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  open,
  closeDrawer,
}) => (
  <Drawer
    sx={{
      width: '40vw',
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: '40vw' },
      zIndex: 1000,
      mt: 150,
    }}
    variant={'temporary'}
    anchor={'right'}
    open={open}
  >
    <Box sx={{ mt: 8 }}>
      <IconButton onClick={closeDrawer} color={'primary'}>
        <ChevronRightIcon color={'primary'} />
      </IconButton>
    </Box>
    <Divider />
    {children}
    <Divider />
  </Drawer>
)
