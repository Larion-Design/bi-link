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
import { PersonListRecordWithImage } from 'defs'
import { FormattedMessage } from 'react-intl'

type Props = {
  label: string
  personsInfo: PersonListRecordWithImage[]
  removePerson: (personId: string) => void
}

export const PersonsList: React.FunctionComponent<PropsWithChildren<Props>> = ({
  label,
  children,
  personsInfo,
  removePerson,
}) => (
  <Box sx={{ width: 1 }}>
    <Typography variant={'h5'} gutterBottom>
      <FormattedMessage id={label} defaultMessage={label} />
    </Typography>
    <Divider variant={'fullWidth'} />

    <List>
      {personsInfo.map((personInfo) => {
        const { _id, firstName, lastName } = personInfo
        const fullName = `${lastName} ${firstName}`

        return (
          <ListItem
            key={_id}
            secondaryAction={<RemovePerson onRemove={() => removePerson(_id)} name={fullName} />}
          >
            <ListItemAvatar>
              <Avatar
                src={personInfo.images[0]?.url.url ?? ''}
                variant={'circular'}
                sx={{ height: 80, width: 80 }}
              />
            </ListItemAvatar>
            <ListItemText primary={fullName} secondary={personInfo.cnp} />
          </ListItem>
        )
      })}
    </List>

    {children}
  </Box>
)
