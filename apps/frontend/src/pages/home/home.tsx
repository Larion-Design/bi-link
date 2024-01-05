import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { useNavigate } from 'react-router-dom'
import { DashboardPage } from 'components/page/DashboardPage'
import { routes } from '../../router/routes'
import companiesImage from '../../../assets/images/companies.jpg'
import personsImage from '../../../assets/images/people.jpg'
import vehiclesImage from '../../../assets/images/vehicles.jpg'
import eventsImage from '../../../assets/images/events.jpg'

export const Home: React.FunctionComponent = () => (
  <DashboardPage title={'Pagina principala'}>
    <Grid container spacing={4} padding={4} mt={3}>
      <EntityCard
        title={'Persoane'}
        image={personsImage}
        newEntityRoute={routes.newPerson}
        searchEntitiesRoute={routes.persons}
      />

      <EntityCard
        title={'Companii'}
        image={companiesImage}
        newEntityRoute={routes.newCompany}
        searchEntitiesRoute={routes.companies}
      />

      <EntityCard
        title={'Bunuri si proprietati'}
        image={vehiclesImage}
        newEntityRoute={routes.newProperty}
        searchEntitiesRoute={routes.properties}
      />

      <EntityCard
        title={'Evenimente'}
        image={eventsImage}
        newEntityRoute={routes.newEvent}
        searchEntitiesRoute={routes.events}
      />
    </Grid>
  </DashboardPage>
)

type EntityCardProps = {
  title: string
  image: string
  newEntityRoute: string
  searchEntitiesRoute: string
}

const EntityCard: React.FunctionComponent<EntityCardProps> = ({
  image,
  title,
  searchEntitiesRoute,
  newEntityRoute,
}) => {
  const navigate = useNavigate()

  return (
    <Grid item xs={12} sm={6} lg={3} justifyContent={'center'}>
      <Card sx={{ maxWidth: 400 }}>
        <CardMedia component={'img'} height={300} image={image} alt={title} />
        <CardContent>
          <Typography gutterBottom variant={'h6'}>
            {title}
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 2 }}>
          <Button variant={'contained'} size={'small'} onClick={() => navigate(newEntityRoute)}>
            Creaza
          </Button>
          <Button
            variant={'contained'}
            size={'small'}
            onClick={() => navigate(searchEntitiesRoute)}
          >
            Cauta
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}
