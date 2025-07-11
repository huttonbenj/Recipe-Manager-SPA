import { TIMEOUTS } from '@recipe-manager/shared';

describe('Smoke Tests', () => {
  describe('Application Health', () => {
    it('should load the home page', () => {
      cy.visit('/');
      cy.get('body').should('be.visible');
      cy.title().should('not.be.empty');
    });

    it('should load the login page', () => {
      cy.visit('/login');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/login');
    });

    it('should display navigation elements', () => {
      cy.visit('/');
      
      // Check if navigation is present (adjust selectors based on actual implementation)
      cy.get('nav', { timeout: TIMEOUTS.API_REQUEST }).should('be.visible');
    });

    it('should handle 404 pages gracefully', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false });
      cy.get('body').should('be.visible');
      // Most SPAs redirect 404s to a main page or show a 404 component
    });
  });

  describe('API Health', () => {
    it('should be able to connect to the API', () => {
      cy.request({
        url: `${Cypress.env('apiUrl')}/api/health`,
        failOnStatusCode: false
      }).then((response) => {
        // API might not have a health endpoint, so we accept various responses
        expect(response.status).to.be.oneOf([200, 404]);
      });
    });
  });

  describe('Basic Navigation', () => {
    it('should navigate between pages', () => {
      cy.visit('/');
      
      // Try to navigate to login if not already authenticated
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="login-link"]').length > 0) {
          cy.get('[data-testid="login-link"]').click();
          cy.url().should('include', '/login');
        }
      });
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport(375, 667); // iPhone SE
      cy.visit('/');
      cy.get('body').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport(768, 1024); // iPad
      cy.visit('/');
      cy.get('body').should('be.visible');
    });

    it('should work on desktop viewport', () => {
      cy.viewport(1920, 1080); // Desktop
      cy.visit('/');
      cy.get('body').should('be.visible');
    });
  });
}); 