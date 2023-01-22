import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import React, { PropsWithChildren, useCallback, useState } from 'react'

export const BasicDrawer: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false)

  const closeDrawer = useCallback(() => setOpen(false), [setOpen])

  return (
    <Drawer
      sx={{
        width: '30vw',
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: '30vw' },
      }}
      variant={'persistent'}
      anchor={'right'}
      open={open}
    >
      <Box>
        <IconButton onClick={closeDrawer}>
          <ChevronRightIcon fontSize={'small'} />
        </IconButton>
      </Box>
      <Divider />
      {children}
      <Divider />
    </Drawer>
  )
}
