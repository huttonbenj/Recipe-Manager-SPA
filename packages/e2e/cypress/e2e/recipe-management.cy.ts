describe('Recipe Management E2E Tests', () => {
  beforeEach(() => {
    // Reset database state
    cy.task('db:seed');
    
    // Login as test user
    cy.login('john@example.com', 'StrongPassword123!');
    
    // Visit recipes page
    cy.visit('/recipes');
  });

  describe('Recipe Creation', () => {
    it('should create a new recipe successfully', () => {
      // Navigate to create recipe page
      cy.get('[data-testid="create-recipe-btn"]').click();
      cy.url().should('include', '/recipes/new');

      // Fill out recipe form
      cy.get('[data-testid="recipe-title"]').type('E2E Test Recipe');
      cy.get('[data-testid="recipe-description"]').type('A delicious test recipe created via E2E testing');
      
      // Add ingredients
      cy.get('[data-testid="add-ingredient-btn"]').click();
      cy.get('[data-testid="ingredient-input-0"]').type('2 cups flour');
      cy.get('[data-testid="add-ingredient-btn"]').click();
      cy.get('[data-testid="ingredient-input-1"]').type('3 eggs');
      cy.get('[data-testid="add-ingredient-btn"]').click();
      cy.get('[data-testid="ingredient-input-2"]').type('1 cup milk');

      // Add instructions
      cy.get('[data-testid="recipe-instructions"]').type('1. Mix flour and eggs\n2. Add milk gradually\n3. Cook for 20 minutes');

      // Set recipe details
      cy.get('[data-testid="cook-time"]').type('20');
      cy.get('[data-testid="servings"]').type('4');
      cy.get('[data-testid="difficulty-select"]').select('Medium');
      cy.get('[data-testid="category-select"]').select('Main Course');

      // Add tags
      cy.get('[data-testid="tags-input"]').type('quick{enter}easy{enter}family-friendly{enter}');

      // Submit form
      cy.get('[data-testid="submit-recipe-btn"]').click();

      // Verify success
      cy.get('[data-testid="success-message"]').should('contain', 'Recipe created successfully');
      cy.url().should('match', /\/recipes\/[a-zA-Z0-9-]+$/);
      
      // Verify recipe details are displayed
      cy.get('[data-testid="recipe-title"]').should('contain', 'E2E Test Recipe');
      cy.get('[data-testid="recipe-description"]').should('contain', 'A delicious test recipe');
      cy.get('[data-testid="cook-time"]').should('contain', '20 min');
      cy.get('[data-testid="servings"]').should('contain', '4 servings');
      cy.get('[data-testid="difficulty"]').should('contain', 'Medium');
    });

    it('should validate required fields', () => {
      cy.get('[data-testid="create-recipe-btn"]').click();
      
      // Try to submit empty form
      cy.get('[data-testid="submit-recipe-btn"]').click();
      
      // Check validation errors
      cy.get('[data-testid="title-error"]').should('contain', 'Title is required');
      cy.get('[data-testid="ingredients-error"]').should('contain', 'At least one ingredient is required');
      cy.get('[data-testid="instructions-error"]').should('contain', 'Instructions are required');
    });

    it('should handle image upload', () => {
      cy.get('[data-testid="create-recipe-btn"]').click();
      
      // Upload image
      cy.fixture('test-recipe-image.jpg').then(fileContent => {
        cy.get('[data-testid="image-upload"]').selectFile({
          contents: Cypress.Buffer.from(fileContent),
          fileName: 'test-recipe.jpg',
          mimeType: 'image/jpeg'
        });
      });

      // Verify image preview
      cy.get('[data-testid="image-preview"]').should('be.visible');
      cy.get('[data-testid="image-preview"] img').should('have.attr', 'src').and('include', 'blob:');

      // Fill required fields and submit
      cy.fillRecipeForm({
        title: 'Recipe with Image',
        ingredients: ['1 cup flour'],
        instructions: 'Mix and bake',
        cookTime: 30,
        servings: 2
      });

      cy.get('[data-testid="submit-recipe-btn"]').click();

      // Verify image is displayed in recipe detail
      cy.get('[data-testid="recipe-image"]').should('be.visible');
    });
  });

  describe('Recipe Listing and Search', () => {
    it('should display all recipes', () => {
      cy.get('[data-testid="recipe-card"]').should('have.length.greaterThan', 0);
      
      // Check first recipe card has required elements
      cy.get('[data-testid="recipe-card"]').first().within(() => {
        cy.get('[data-testid="recipe-title"]').should('be.visible');
        cy.get('[data-testid="recipe-description"]').should('be.visible');
        cy.get('[data-testid="cook-time"]').should('be.visible');
        cy.get('[data-testid="difficulty"]').should('be.visible');
      });
    });

    it('should search recipes by title', () => {
      // Search for specific recipe
      cy.get('[data-testid="search-input"]').type('Spaghetti');
      cy.get('[data-testid="search-btn"]').click();

      // Verify search results
      cy.get('[data-testid="recipe-card"]').should('contain', 'Spaghetti');
      cy.get('[data-testid="search-results-count"]').should('be.visible');
    });

    it('should filter recipes by category', () => {
      // Apply category filter
      cy.get('[data-testid="category-filter"]').select('Main Course');
      
      // Verify filtered results
      cy.get('[data-testid="recipe-card"]').each(($card) => {
        cy.wrap($card).find('[data-testid="recipe-category"]').should('contain', 'Main Course');
      });
    });

    it('should filter recipes by difficulty', () => {
      cy.get('[data-testid="difficulty-filter"]').select('Easy');
      
      cy.get('[data-testid="recipe-card"]').each(($card) => {
        cy.wrap($card).find('[data-testid="difficulty"]').should('contain', 'Easy');
      });
    });

    it('should sort recipes by cook time', () => {
      cy.get('[data-testid="sort-select"]').select('Cook Time (Low to High)');
      
      // Verify sorting order
      cy.get('[data-testid="recipe-card"] [data-testid="cook-time"]')
        .then(($elements) => {
          const cookTimes = [...$elements].map(el => parseInt(el.textContent?.match(/\d+/)?.[0] || '0'));
          const sortedTimes = [...cookTimes].sort((a, b) => a - b);
          expect(cookTimes).to.deep.equal(sortedTimes);
        });
    });

    it('should handle empty search results', () => {
      cy.get('[data-testid="search-input"]').type('NonexistentRecipe123');
      cy.get('[data-testid="search-btn"]').click();

      cy.get('[data-testid="no-results-message"]').should('contain', 'No recipes found');
      cy.get('[data-testid="clear-search-btn"]').should('be.visible');
    });
  });

  describe('Recipe Detail View', () => {
    it('should display full recipe details', () => {
      // Click on first recipe
      cy.get('[data-testid="recipe-card"]').first().click();

      // Verify all recipe details are displayed
      cy.get('[data-testid="recipe-title"]').should('be.visible');
      cy.get('[data-testid="recipe-description"]').should('be.visible');
      cy.get('[data-testid="ingredients-list"]').should('be.visible');
      cy.get('[data-testid="instructions"]').should('be.visible');
      cy.get('[data-testid="cook-time"]').should('be.visible');
      cy.get('[data-testid="servings"]').should('be.visible');
      cy.get('[data-testid="difficulty"]').should('be.visible');
      cy.get('[data-testid="category"]').should('be.visible');
      cy.get('[data-testid="tags-list"]').should('be.visible');
    });

    it('should show edit button for recipe owner', () => {
      // Navigate to user's own recipe
      cy.get('[data-testid="my-recipes-filter"]').click();
      cy.get('[data-testid="recipe-card"]').first().click();

      cy.get('[data-testid="edit-recipe-btn"]').should('be.visible');
      cy.get('[data-testid="delete-recipe-btn"]').should('be.visible');
    });

    it('should hide edit button for other users recipes', () => {
      // Navigate to recipe by different user
      cy.get('[data-testid="all-recipes-filter"]').click();
      cy.get('[data-testid="recipe-card"]').contains('Jane').click();

      cy.get('[data-testid="edit-recipe-btn"]').should('not.exist');
      cy.get('[data-testid="delete-recipe-btn"]').should('not.exist');
    });
  });

  describe('Recipe Editing', () => {
    it('should edit recipe successfully', () => {
      // Navigate to user's recipe and edit
      cy.get('[data-testid="my-recipes-filter"]').click();
      cy.get('[data-testid="recipe-card"]').first().click();
      cy.get('[data-testid="edit-recipe-btn"]').click();

      // Modify recipe details
      cy.get('[data-testid="recipe-title"]').clear().type('Updated Recipe Title');
      cy.get('[data-testid="cook-time"]').clear().type('45');
      cy.get('[data-testid="difficulty-select"]').select('Hard');

      // Save changes
      cy.get('[data-testid="save-recipe-btn"]').click();

      // Verify changes
      cy.get('[data-testid="success-message"]').should('contain', 'Recipe updated successfully');
      cy.get('[data-testid="recipe-title"]').should('contain', 'Updated Recipe Title');
      cy.get('[data-testid="cook-time"]').should('contain', '45 min');
      cy.get('[data-testid="difficulty"]').should('contain', 'Hard');
    });

    it('should validate edit form', () => {
      cy.get('[data-testid="my-recipes-filter"]').click();
      cy.get('[data-testid="recipe-card"]').first().click();
      cy.get('[data-testid="edit-recipe-btn"]').click();

      // Clear required field
      cy.get('[data-testid="recipe-title"]').clear();
      cy.get('[data-testid="save-recipe-btn"]').click();

      // Check validation
      cy.get('[data-testid="title-error"]').should('contain', 'Title is required');
    });
  });

  describe('Recipe Deletion', () => {
    it('should delete recipe with confirmation', () => {
      cy.get('[data-testid="my-recipes-filter"]').click();
      cy.get('[data-testid="recipe-card"]').first().click();
      
      const recipeTitle = cy.get('[data-testid="recipe-title"]').invoke('text');
      
      cy.get('[data-testid="delete-recipe-btn"]').click();
      
      // Confirm deletion in modal
      cy.get('[data-testid="confirm-delete-modal"]').should('be.visible');
      cy.get('[data-testid="confirm-delete-btn"]').click();

      // Verify deletion
      cy.get('[data-testid="success-message"]').should('contain', 'Recipe deleted successfully');
      cy.url().should('include', '/recipes');
      
      // Verify recipe no longer exists
      recipeTitle.then((title) => {
        cy.get('[data-testid="recipe-card"]').should('not.contain', title);
      });
    });

    it('should cancel deletion', () => {
      cy.get('[data-testid="my-recipes-filter"]').click();
      cy.get('[data-testid="recipe-card"]').first().click();
      
      cy.get('[data-testid="delete-recipe-btn"]').click();
      cy.get('[data-testid="cancel-delete-btn"]').click();

      // Verify recipe still exists
      cy.get('[data-testid="recipe-title"]').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport('iphone-x');
      
      // Test mobile navigation
      cy.get('[data-testid="mobile-menu-btn"]').click();
      cy.get('[data-testid="mobile-nav"]').should('be.visible');
      
      // Test recipe cards on mobile
      cy.get('[data-testid="recipe-card"]').should('be.visible');
      cy.get('[data-testid="recipe-card"]').first().click();
      
      // Verify recipe detail view on mobile
      cy.get('[data-testid="recipe-title"]').should('be.visible');
    });

    it('should work on tablet devices', () => {
      cy.viewport('ipad-2');
      
      cy.get('[data-testid="recipe-card"]').should('have.length.greaterThan', 0);
      cy.get('[data-testid="search-input"]').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Simulate network failure
      cy.intercept('GET', '/api/recipes', { forceNetworkError: true }).as('networkError');
      
      cy.visit('/recipes');
      cy.wait('@networkError');

      cy.get('[data-testid="error-message"]').should('contain', 'Unable to load recipes');
      cy.get('[data-testid="retry-btn"]').should('be.visible');
    });

    it('should handle server errors', () => {
      cy.intercept('GET', '/api/recipes', { statusCode: 500 }).as('serverError');
      
      cy.visit('/recipes');
      cy.wait('@serverError');

      cy.get('[data-testid="error-message"]').should('contain', 'Server error');
    });
  });

  describe('Performance', () => {
    it('should load recipes within acceptable time', () => {
      const startTime = Date.now();
      
      cy.visit('/recipes');
      cy.get('[data-testid="recipe-card"]').should('be.visible');
      
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds max
      });
    });

    it('should handle large lists efficiently', () => {
      // Test with many recipes
      cy.task('db:seedLargeDataset');
      
      cy.visit('/recipes');
      cy.get('[data-testid="recipe-card"]').should('have.length', 50);
      
      // Test scrolling performance
      cy.scrollTo('bottom');
      cy.get('[data-testid="load-more-btn"]').click();
      cy.get('[data-testid="recipe-card"]').should('have.length', 100);
    });
  });
}); 