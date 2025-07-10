import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    // Use Vite dev server port; allow override via CYPRESS_BASE_URL env var
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    
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
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test execution settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Test isolation
    testIsolation: true,
    
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Environment variables
    env: {
      apiUrl: 'http://localhost:3001',
      coverage: true,
      codeCoverage: {
        url: 'http://localhost:3001/__coverage__'
      }
    },
    
    // Setup and teardown
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // Code coverage plugin
      codeCoverageTask(on, config as Cypress.PluginConfigOptions);

      // Custom & database tasks combined to avoid overwriting
      on('task', {
        log(message: unknown) {
          // eslint-disable-next-line no-console
          console.log(message);
          return null;
        },
        table(message: unknown) {
          // eslint-disable-next-line no-console
          console.table(message as unknown);
          return null;
        },
        'db:seed': async () => {
          // Execute the actual seed script
          const { exec } = require('child_process');
          const { promisify } = require('util');
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
          const { exec } = require('child_process');
          const { promisify } = require('util');
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
          const { exec } = require('child_process');
          const { promisify } = require('util');
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