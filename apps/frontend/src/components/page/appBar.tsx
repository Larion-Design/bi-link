import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MuiAppBar from '@mui/material/AppBar'
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar/AppBar'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { routes } from '../../router/routes'
import { CurrentUserMenu } from '../menu/currentUserMenu'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { getUserRole } from '../../utils/auth'

const drawerWidth = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

interface AppHeaderProps {
  open?: boolean
  toggleDrawer: () => void
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export const AppHeader: React.FunctionComponent<AppHeaderProps> = ({
  open,
  toggleDrawer,
}) => {
  const { hasPrivilegedAccess } = getUserRole()
  const navigate = useNavigate()

  return (
    <AppBar position={'absolute'} open={open}>
      <Toolbar sx={{ pr: 24 }}>
        <IconButton
          edge={'start'}
          onClick={toggleDrawer}
          color={'inherit'}
          sx={{ mr: 4, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant={'h6'} noWrap flexGrow={1} data-cy={'appTitle'}>
          BI Link
        </Typography>
        <IconButton onClick={() => navigate(routes.search)} color={'inherit'}>
          <SearchOutlinedIcon />
        </IconButton>
        {hasPrivilegedAccess && (
          <IconButton
            onClick={() => navigate(routes.history)}
            color={'inherit'}
          >
            <Badge badgeContent={0} color={'secondary'}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
        )}
        <CurrentUserMenu />
      </Toolbar>
    </AppBar>
  )
}
