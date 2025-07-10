// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global test configuration
beforeEach(() => {
  // Clear localStorage and sessionStorage before each test
  cy.clearLocalStorage();
  cy.clearCookies();
  
  // Set viewport size
  cy.viewport(1280, 720);
  
  // Intercept API calls for better test control
  cy.intercept('GET', '/api/auth/me', { fixture: 'user.json' }).as('getCurrentUser');
  cy.intercept('GET', '/api/recipes', { fixture: 'recipes.json' }).as('getRecipes');
  cy.intercept('GET', '/api/recipes/categories', { fixture: 'categories.json' }).as('getCategories');
});

// Global error handling
Cypress.on('uncaught:exception', (err, _runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // that are expected in some scenarios
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  
  // Let other errors fail the test
  return true;
});

// RecipeFormData interface is defined in commands.ts to avoid duplication
// But we need to redeclare it here for TypeScript global declarations
interface RecipeFormData {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  cookTime: number;
  servings: number;
  difficulty?: string;
  category?: string;
  tags?: string[];
}

// Add custom assertions
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with email and password
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to create a test recipe
       */
      createRecipe(recipeData: RecipeFormData): Chainable<void>;
      
      /**
       * Custom command to check if user is authenticated
       */
      checkAuthenticated(): Chainable<void>;
      
      /**
       * Custom command to wait for page to load
       */
      waitForPageLoad(): Chainable<void>;
      
      /**
       * Custom command to fill recipe form
       */
      fillRecipeForm(recipeData: RecipeFormData): Chainable<void>;
      
      /**
       * Custom command to seed database with test data
       */
      seedDatabase(): Chainable<void>;

      /**
       * Custom command to clean database
       */
      cleanDatabase(): Chainable<void>;
    }
  }
}