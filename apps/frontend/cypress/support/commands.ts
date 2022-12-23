import "./commands";
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('findById', (value: string) => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    /*    cy.visit('/login')
    cy.findById('email').type(username)
    cy.findById('password').type(password)
    cy.findById('loginButton').click()
 */
    window.localStorage.setItem('auth', 'true')
  })
})
