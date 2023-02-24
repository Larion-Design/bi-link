import React, { ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import { InvalidPage } from '../pages/invalidPage'
import { Page } from '../components/page/Page'
import { LoginPage } from '../pages/signIn'
import { Home } from '../pages/home/home'
import { PrivateRoute } from './PrivateRoute'
import { PersonsList } from '../pages/persons/personsList'
import { CreatePerson } from '../pages/persons/createPerson'
import { EditPerson } from '../pages/persons/editPerson'
import { CreateCompany } from '../pages/companies/createCompany'
import { CompaniesList } from '../pages/companies/companiesList'
import { SignupPage } from '../pages/signup'
import { EditCompany } from '../pages/companies/editCompany'
import { EventsList } from '../pages/events/eventsList'
import { CreateEvent } from '../pages/events/createEvent'
import { EditEvent } from '../pages/events/editEvent'
import { UsersList } from '../pages/users'
import { PropertiesList } from '../pages/properties/propertiesList'
import { CreateProperty } from '../pages/properties/createProperty'
import { EditProperty } from '../pages/properties/editProperty'

const privateRoutes: Record<string, ReactNode> = {
  [routes.index]: <Home />,
  [routes.persons]: <PersonsList />,
  [routes.newPerson]: <CreatePerson />,
  [routes.personDetails]: <EditPerson />,
  [routes.companies]: <CompaniesList />,
  [routes.newCompany]: <CreateCompany />,
  [routes.companyDetails]: <EditCompany />,
  [routes.events]: <EventsList />,
  [routes.newEvent]: <CreateEvent />,
  [routes.eventDetails]: <EditEvent />,
  [routes.users]: <UsersList />,
  [routes.properties]: <PropertiesList />,
  [routes.newProperty]: <CreateProperty />,
  [routes.propertyDetails]: <EditProperty />,
}

const publicRoutes: Record<string, ReactNode> = {
  [routes.login]: <LoginPage />,
  [routes.signup]: <SignupPage />,
  [routes.resetPassword]: <Page>Pagina nu este disponibila momentan.</Page>,
}

export const Router: React.FunctionComponent = () => (
  <BrowserRouter>
    <Routes>
      {Object.entries(privateRoutes).map(([route, component]) => (
        <Route key={route} path={route} element={<PrivateRoute>{component}</PrivateRoute>} />
      ))}

      {Object.entries(publicRoutes).map(([route, component]) => (
        <Route key={route} path={route} element={component} />
      ))}

      <Route path={'*'} element={<InvalidPage />} />
    </Routes>
  </BrowserRouter>
)
