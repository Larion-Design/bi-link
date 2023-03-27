export const routes = {
  index: '/',
  login: '/login',
  signup: '/signup',
  resetPassword: '/reset-password',
  changePassword: '/change-password',
  profile: '/profile',

  persons: '/persons',
  newPerson: '/persons/new',
  personDetails: '/persons/:personId',
  personSnapshotDetails: '/persons/snapshots/:snapshotId',
  personVersionDetails: '/persons/versions/:versionId',

  newCompany: '/companies/new',
  companyDetails: '/companies/:companyId',
  companies: '/companies',
  companySnapshotDetails: '/companies/snapshots/:snapshotId',
  companyVersionDetails: '/companies/versions/:versionId',

  newProperty: '/properties/new',
  propertyDetails: '/properties/:propertyId',
  properties: '/properties',
  propertySnapshotDetails: '/properties/snapshots/:snapshotId',
  propertyVersionDetails: '/properties/versions/:versionId',

  newEvent: '/events/new',
  eventDetails: '/events/:eventId',
  events: '/events',
  eventSnapshotDetails: '/events/snapshots/:snapshotId',
  eventVersionDetails: '/events/versions/:versionId',

  proceedings: '/proceedings',
  newProceeding: '/proceedings/new',
  proceedingDetails: '/proceedings/:proceedingId',
  proceedingSnapshotDetails: '/proceedings/snapshots/:snapshotId',
  proceedingVersionDetails: '/proceedings/versions/:versionId',

  users: '/users',
  history: '/history',
  search: '/search',
}
