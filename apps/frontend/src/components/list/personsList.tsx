import { getPersonFullName } from '@frontend/utils/person'
import React, { PropsWithChildren } from 'react'
import { RemovePerson } from '@frontend/components/actionButton/removePerson'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { PersonAPIOutput } from 'defs'
import { FormattedMessage } from 'react-intl'

type Props = {
  label: string
  personsInfo: Map<string, PersonAPIOutput>
  removePerson: (personId: string) => void
}

export const PersonsList: React.FunctionComponent<PropsWithChildren<Props>> = ({
  label,
  children,
  personsInfo,
  removePerson,
}) => (
  <Box sx={{ width: 1 }}>
    <Typography variant={'h6'} gutterBottom>
      <FormattedMessage id={label} />
    </Typography>
    <Divider variant={'fullWidth'} />

    <List>
      {Array.from(personsInfo.values()).map((personInfo) => {
        const { _id } = personInfo
        const fullName = getPersonFullName(personInfo)
        return (
          <ListItem
            key={_id}
            secondaryAction={<RemovePerson onRemove={() => removePerson(_id)} name={fullName} />}
          >
            <ListItemAvatar>
              <Avatar
                src={personInfo.images[0]?.url.url ?? ''}
                variant={'circular'}
                sx={{ height: 50, width: 50, mr: 2 }}
              />
            </ListItemAvatar>
            <ListItemText primary={fullName} secondary={personInfo.cnp.value} />
          </ListItem>
        )
      })}
    </List>
    {children}
  </Box>
)
