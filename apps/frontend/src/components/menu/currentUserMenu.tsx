import React, { useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'
import { useUserRoleLocale, useAuth } from '../../utils/auth'
import { routes } from '../../router/routes'

export const CurrentUserMenu: React.FunctionComponent = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setMenuOpen] = React.useState<boolean>(false)
  const buttonRef = useRef<Element | null>(null)
  const role = useUserRoleLocale()

  return (
    <>
      <IconButton color={'inherit'} onClick={() => setMenuOpen(true)}>
        <AccountCircle ref={(ref) => (buttonRef.current = ref)} />
      </IconButton>
      {isMenuOpen && (
        <Menu
          open={true}
          onClose={() => setMenuOpen(false)}
          anchorEl={buttonRef.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <ListItem>
            <Box>
              <Typography variant={'h6'}>{user?.displayName}</Typography>
              {role && (
                <Typography variant={'body2'} gutterBottom>
                  {role}
                </Typography>
              )}
            </Box>
          </ListItem>
          <Divider variant={'fullWidth'} color={'inherit'} sx={{ mb: 2 }} />
          <MenuItem onClick={() => navigate(routes.profile)}>Profil</MenuItem>
          <MenuItem onClick={logout}>Încheie sesiunea</MenuItem>
        </Menu>
      )}
    </>
  )
}
