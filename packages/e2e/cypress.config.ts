import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';
import { TIMEOUTS, API_CONFIG, CLIENT_CONFIG, TEST_CONFIG } from '@recipe-manager/shared';
import { exec } from 'child_process';
import { promisify } from 'util';

export default defineConfig({
  e2e: {
    // Use Vite dev server port; allow override via CYPRESS_BASE_URL env var
    baseUrl: process.env.CYPRESS_BASE_URL || `http://localhost:${CLIENT_CONFIG.VITE_DEV_PORT}`,
    
    // Test files
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    
    // Screenshots and videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    screenshotOnRunFailure: true,
    
    // Viewport settings
    viewportWidth: CLIENT_CONFIG.VIEWPORT.WIDTH,
    viewportHeight: CLIENT_CONFIG.VIEWPORT.HEIGHT,
    
    // Test execution settings
    defaultCommandTimeout: TIMEOUTS.API_REQUEST,
    requestTimeout: TIMEOUTS.API_REQUEST,
    responseTimeout: TIMEOUTS.API_REQUEST,
    pageLoadTimeout: TIMEOUTS.PAGE_LOAD,
    
    // Test isolation
    testIsolation: true,
    
    // Retry configuration
    retries: {
      runMode: TEST_CONFIG.RETRY.RUN_MODE,
      openMode: TEST_CONFIG.RETRY.OPEN_MODE
    },
    
    // Environment variables
    env: {
      apiUrl: API_CONFIG.BASE_URL,
      coverage: true,
      codeCoverage: {
        url: `${API_CONFIG.BASE_URL}/__coverage__`
      }
    },
    
    // Setup and teardown
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // Code coverage plugin
      codeCoverageTask(on, config as Cypress.PluginConfigOptions);

      // Custom & database tasks combined to avoid overwriting
      on('task', {
        log(message: unknown) {
          console.log(message);
          return null;
        },
        table(message: unknown) {
          console.table(message as unknown);
          return null;
        },
        'db:seed': async () => {
          // Execute the actual seed script
          const execAsync = promisify(exec);
          
          try {
            await execAsync('cd ../server && npm run db:seed');
            console.log('Database seeded successfully');
            return null;
          } catch (error) {
            console.error('Failed to seed database:', error);
            throw error;
          }
        },
        'db:seedLargeDataset': async () => {
          // For performance testing, we can run the seed script multiple times
          // or create a dedicated large dataset seeder
          const execAsync = promisify(exec);
          
          try {
            await execAsync('cd ../server && npm run db:seed');
            console.log('Large dataset seeded successfully');
            return null;
          } catch (error) {
            console.error('Failed to seed large dataset:', error);
            throw error;
          }
        },
        'db:clean': async () => {
          // Clean database by running Prisma reset
          const execAsync = promisify(exec);
          
          try {
            await execAsync('cd ../server && npx prisma migrate reset --force');
            console.log('Database cleaned successfully');
            return null;
          } catch (error) {
            console.error('Failed to clean database:', error);
            throw error;
          }
        }
      });

      return config;
    },
    
    // Experimental features
    experimentalStudio: true,
    experimentalMemoryManagement: true
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts'
  },
  
  // Global configuration
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  
  // Reporter configuration - simplified to use built-in spec reporter
  reporter: 'spec'
});