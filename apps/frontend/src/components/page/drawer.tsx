import React from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import StoreIcon from '@mui/icons-material/Store'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined'
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined'
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import GavelIcon from '@mui/icons-material/Gavel'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SettingsIcon from '@mui/icons-material/Settings'
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from '../../router/routes'
import { useUserRole } from 'utils/auth'

const drawerWidth = 240

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    cursor: 'pointer',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}))

interface AppDrawerProps {
  open?: boolean
  toggleDrawer: () => void
}

export const AppDrawer: React.FunctionComponent<AppDrawerProps> = ({ open, toggleDrawer }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { hasPrivilegedAccess } = useUserRole()

  return (
    <Drawer variant={'permanent'} open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component={'nav'}>
        <ListItemButton onClick={() => navigate(routes.index)}>
          <ListItemIcon>
            {pathname === routes.index ? (
              <DashboardIcon color={'primary'} />
            ) : (
              <DashboardOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Vedere generala" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(routes.persons)}>
          <ListItemIcon>
            {pathname === routes.persons ? (
              <PeopleAltIcon color={'primary'} />
            ) : (
              <PeopleOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Persoane" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate(routes.companies)}>
          <ListItemIcon>
            {pathname === routes.companies ? (
              <StoreIcon color={'primary'} />
            ) : (
              <StoreOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Companii" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(routes.properties)} disabled>
          <ListItemIcon>
            {pathname === routes.properties ? (
              <AddHomeWorkIcon color={'primary'} />
            ) : (
              <AddHomeWorkOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={'Bunuri si proprietati'} />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(routes.events)} disabled>
          <ListItemIcon>
            {pathname === routes.events ? (
              <LocalHospitalIcon color={'primary'} />
            ) : (
              <LocalHospitalOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Evenimente" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(routes.proceedings)} disabled>
          <ListItemIcon>
            {pathname === routes.proceedings ? (
              <GavelIcon color={'primary'} />
            ) : (
              <GavelOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Procese in instanta" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(routes.settings)}>
          <ListItemIcon>
            {pathname === routes.settings ? (
              <SettingsIcon color={'primary'} />
            ) : (
              <SettingsOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={'Setari'} />
        </ListItemButton>
        {hasPrivilegedAccess && (
          <>
            <ListItemButton onClick={() => navigate(routes.users)} disabled>
              <ListItemIcon>
                {pathname === routes.users ? (
                  <ManageAccountsIcon color={'primary'} />
                ) : (
                  <ManageAccountsOutlinedIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={'Utilizatori'} />
            </ListItemButton>
            <ListItemButton onClick={() => navigate(routes.history)} disabled>
              <ListItemIcon>
                {pathname === routes.history ? (
                  <WorkHistoryIcon color={'primary'} />
                ) : (
                  <WorkHistoryOutlinedIcon />
                )}
              </ListItemIcon>
              <ListItemText primary="Istoric activitate" />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  )
}
