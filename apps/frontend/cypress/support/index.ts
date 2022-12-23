// in cypress/support/index.ts
// load type definitions that come with Cypress module
import "@cypress/code-coverage/support";
import "./commands";

/// <reference types="cypress" />
declare global {
  namespace Cypress {
    interface Chainable {
      // declare additional custom commands as methods, like
      login(username: string, password: string): void
      findById(value: string): Chainable<JQuery<HTMLElement>>
    }
  }
}
