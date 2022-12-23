import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined'
import DriveEtaOutlinedIcon from '@mui/icons-material/DriveEtaOutlined'

type Props = {
  addPerson?: () => void
  addCompany?: () => void
  addVehicle?: () => void
}

export const AddEntityCard: React.FunctionComponent<Props> = ({
  addPerson,
  addCompany,
  addVehicle,
}) => (
  <Card
    sx={{
      minHeight: 300,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    }}
    color={'primary'}
  >
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {!!addPerson && (
        <Button
          sx={{ m: 2 }}
          variant={'contained'}
          onClick={addPerson}
          startIcon={<PersonAddAlt1OutlinedIcon />}
        >
          Persoana
        </Button>
      )}

      {!!addCompany && (
        <Button
          sx={{ m: 2 }}
          variant={'contained'}
          onClick={addCompany}
          startIcon={<AddBusinessOutlinedIcon />}
        >
          Companie
        </Button>
      )}

      {!!addVehicle && (
        <Button
          sx={{ m: 2 }}
          variant={'contained'}
          onClick={addVehicle}
          startIcon={<DriveEtaOutlinedIcon />}
        >
          Companie
        </Button>
      )}
    </CardContent>
  </Card>
)
