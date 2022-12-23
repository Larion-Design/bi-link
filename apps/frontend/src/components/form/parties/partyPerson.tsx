import React, { useRef, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import ListItemIcon from '@mui/material/ListItemIcon'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { getPersonFullName } from '../../../utils/person'
import { PersonListRecordWithImage } from '../../../types/person'
import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '../../../router/routes'

type Props = {
  personInfo: PersonListRecordWithImage
  removePerson: (personId: string) => void
}

export const PartyPerson: React.FunctionComponent<Props> = ({
  personInfo,
  removePerson,
}) => {
  const navigate = useNavigate()
  const { _id, image, cnp } = personInfo
  const fullName = getPersonFullName(personInfo)
  const buttonRef = useRef<Element | null>(null)
  const [isMenuOpen, setMenuOpenState] = useState(false)

  return (
    <Card sx={{ height: 75 }}>
      {isMenuOpen && !!buttonRef.current && (
        <Menu
          open={isMenuOpen}
          onClose={() => setMenuOpenState(false)}
          anchorEl={buttonRef.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MenuItem
            onClick={() =>
              navigate(generatePath(routes.personDetails, { personId: _id }))
            }
          >
            <ListItemIcon>
              <OpenInNewOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Vezi mai multe informatii</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => removePerson(_id)}>
            <ListItemIcon>
              <DeleteOutlinedIcon color={'error'} />
            </ListItemIcon>
            <ListItemText color={'error'}>Sterge</ListItemText>
          </MenuItem>
        </Menu>
      )}
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={fullName}
            src={image?.url?.url ?? ''}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant={'body2'}>{fullName}</Typography>
            <Typography variant={'caption'}>{cnp}</Typography>
          </Box>
        </Box>
        <IconButton>
          <MoreVertOutlinedIcon
            onClick={() => setMenuOpenState(true)}
            ref={(ref) => (buttonRef.current = ref)}
          />
        </IconButton>
      </CardContent>
    </Card>
  )
}
