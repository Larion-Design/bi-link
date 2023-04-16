import React, { PropsWithChildren, useRef, useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import ListItemText from '@mui/material/ListItemText'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

type Props = {
  entityId: string
  viewEntityDetails: (entityId: string) => void
}

export const PartyEntity: React.FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  entityId,
  viewEntityDetails,
}) => {
  const buttonRef = useRef<Element | null>(null)
  const [isMenuOpen, setMenuOpenState] = useState(false)

  return (
    <Box sx={{ width: 1, height: 75 }}>
      {isMenuOpen && !!buttonRef.current && (
        <Menu
          open={isMenuOpen}
          onClose={() => setMenuOpenState(false)}
          anchorEl={buttonRef.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MenuItem onClick={() => viewEntityDetails(entityId)}>
            <ListItemIcon>
              <OpenInNewOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Vezi mai multe informatii</ListItemText>
          </MenuItem>
        </Menu>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {children}
        <IconButton onClick={() => setMenuOpenState(true)} ref={(ref) => (buttonRef.current = ref)}>
          <MoreVertOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
