import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { useNavigate } from 'react-router-dom'
import { DashboardPage } from '../../components/page/DashboardPage'
import { routes } from '../../router/routes'
import companiesImage from '../../../assets/images/companies.jpg'
import personsImage from '../../../assets/images/people.jpg'
import vehiclesImage from '../../../assets/images/vehicles.jpg'
import incidentsImage from '../../../assets/images/incidents.jpg'

export const Home: React.FunctionComponent = () => {
  const navigate = useNavigate()

  return (
    <DashboardPage title={'Pagina principala'}>
      <Grid container spacing={4} padding={4} mt={3}>
        <Grid item xs={3}>
          <Card sx={{ maxWidth: 400 }}>
            <CardMedia component={'img'} height={300} image={personsImage} alt={'Persoane'} />
            <CardContent>
              <Typography gutterBottom variant={'h6'}>
                Persoane
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                variant={'contained'}
                size={'small'}
                onClick={() => navigate(routes.newPerson)}
              >
                Creaza
              </Button>
              <Button variant={'contained'} size={'small'} onClick={() => navigate(routes.persons)}>
                Cauta
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ maxWidth: 400 }}>
            <CardMedia component={'img'} height={300} image={companiesImage} alt={'Companii'} />
            <CardContent>
              <Typography gutterBottom variant={'h6'}>
                Companii
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                variant={'contained'}
                size={'small'}
                onClick={() => navigate(routes.newCompany)}
              >
                Creaza
              </Button>
              <Button
                variant={'contained'}
                size={'small'}
                onClick={() => navigate(routes.companies)}
              >
                Cauta
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ maxWidth: 400 }}>
            <CardMedia component={'img'} height={300} image={vehiclesImage} alt={'Vehicule'} />
            <CardContent>
              <Typography gutterBottom variant={'h6'}>
                Bunuri si proprietati
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                variant={'contained'}
                size={'small'}
                onClick={() => navigate(routes.newProperty)}
              >
                Creaza
              </Button>
              <Button
                variant={'contained'}
                size={'small'}
                onClick={() => navigate(routes.properties)}
              >
                Cauta
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ maxWidth: 400 }}>
            <CardMedia component={'img'} height={300} image={incidentsImage} alt={'Incidente'} />
            <CardContent>
              <Typography gutterBottom variant={'h6'}>
                Incidente
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                variant={'contained'}
                size={'small'}
                onClick={() => navigate(routes.newEvent)}
              >
                Creaza
              </Button>
              <Button variant={'contained'} size={'small'} onClick={() => navigate(routes.events)}>
                Cauta
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
