/// <reference types="cypress" />

import { STORAGE_KEYS, TIMEOUTS } from '@recipe-manager/shared';

// Custom commands for authentication
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    
    // Wait for login form to be visible
    cy.get('[data-testid="login-form"]').should('be.visible');
    
    // Fill in login form
    cy.get('[data-testid="email-input"]', { timeout: TIMEOUTS.API_REQUEST })
      .should('be.visible')
      .clear()
      .type(email);
    
    cy.get('[data-testid="password-input"]')
      .should('be.visible')
      .clear()
      .type(password);
    
    // Submit form
    cy.get('[data-testid="login-button"]').click();
    
    // Wait for successful login (redirect to dashboard)
    cy.url({ timeout: TIMEOUTS.API_REQUEST }).should('not.include', '/login');
    cy.get('[data-testid="user-menu"]', { timeout: TIMEOUTS.API_REQUEST }).should('be.visible');
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
});

// Custom command for API requests with auth
Cypress.Commands.add('apiRequest', (options) => {
  const authToken = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  
  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${authToken}`
    }
  };
  
  return cy.request(requestOptions);
});

// Custom command for creating test data
Cypress.Commands.add('createTestRecipe', (recipeData) => {
  return cy.apiRequest({
    method: 'POST',
    url: '/api/recipes',
    body: recipeData
  });
});

// Custom command for cleaning up test data
Cypress.Commands.add('cleanupTestData', () => {
  // This would typically clean up any test data created during tests
  // For now, we'll just clear localStorage
  cy.clearLocalStorage();
});

// Declare the custom commands for TypeScript
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      apiRequest(options: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<unknown>>;
      createTestRecipe(recipeData: Record<string, unknown>): Chainable<Cypress.Response<unknown>>;
      cleanupTestData(): Chainable<void>;
    }
  }
} 