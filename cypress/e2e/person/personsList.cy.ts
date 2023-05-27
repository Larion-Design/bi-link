import { routes } from '../../../apps/frontend/src/router/routes'
import { faker } from '@faker-js/faker'

describe('Persons list page', () => {
  before(() => {
    cy.intercept('/graphql', {
      statusCode: 500,
      body: '',
    })
  })

  beforeEach(() => {
    cy.login(faker.internet.email(), faker.internet.password(12))
  })

  it('displays the app name in the title bar', () => {
    cy.visit(routes.persons)
    cy.findById('pageTitle').should('exist').should('contain.text', 'Persoane')
  })

  it('redirects to new person form', () => {
    cy.visit(routes.persons)
    cy.findById('createPerson').should('exist').click()
    cy.url().should('contain', routes.newPerson)
  })
})
