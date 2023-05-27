import { routes } from '../../apps/frontend/src/router/routes'
import { faker } from '@faker-js/faker'

describe('Dashboard page', () => {
  before(() => {
    cy.intercept('/graphql')
  })

  beforeEach(() => {
    cy.login(faker.internet.email(), faker.internet.password(12))
  })

  it('displays the app name in the title bar', () => {
    cy.visit(routes.index)
    cy.findById('appTitle').should('contain.text', 'BI Link')
  })
})
