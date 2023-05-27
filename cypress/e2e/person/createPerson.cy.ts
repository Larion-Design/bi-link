import { routes } from '../../../apps/frontend/src/router/routes'
import { faker } from '@faker-js/faker'

describe('Create persons page', () => {
  before(() => {
    cy.intercept('/graphql', {
      statusCode: 500,
      body: '',
    })
  })

  beforeEach(() => {
    cy.login(faker.internet.email(), faker.internet.password(12))
    cy.visit(routes.newPerson)
  })

  it('displays the page title', () => {
    cy.findById('pageTitle').should('contain.text', 'Creaza o persoana')
  })

  it('cancels the form and redirects to persons list', () => {
    cy.findById('cancelForm').should('exist').click()
    cy.findById('confirmationDialog').should('be.visible')
    cy.findById('confirmationDialogProceed').should('exist').click()
    cy.url().should('contain', routes.persons)
  })
})
