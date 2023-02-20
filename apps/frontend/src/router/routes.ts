export const routes = {
  index: '/',
  login: '/login',
  signup: '/signup',
  resetPassword: '/reset-password',
  changePassword: '/change-password',
  profile: '/profile',

  newPerson: '/persons/new',
  personDetails: '/persons/:personId',
  persons: '/persons',

  newCompany: '/companies/new',
  companyDetails: '/companies/:companyId',
  companies: '/companies',
  companyLocalCopy: '/companies/_local',

  newProperty: '/properties/new',
  propertyDetails: '/properties/:propertyId',
  properties: '/properties',

  newIncident: '/events/new',
  incidentDetails: '/events/:incidentId',
  incidents: '/events',

  users: '/users',
  history: '/history',
  search: '/search',
}
