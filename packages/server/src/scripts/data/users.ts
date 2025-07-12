// Sample users - passwords from environment variables or secure defaults
export const sampleUsers = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    password: process.env.SEED_ADMIN_PASSWORD || 'admin123',
  },
  {
    email: 'chef@example.com',
    name: 'Chef Maria Rodriguez',
    password: process.env.SEED_CHEF_PASSWORD || 'chef123',
  },
  {
    email: 'home@example.com',
    name: 'Home Cook Sarah',
    password: process.env.SEED_HOME_PASSWORD || 'home123',
  },
  {
    email: 'baker@example.com',
    name: 'Baker John Smith',
    password: process.env.SEED_BAKER_PASSWORD || 'baker123',
  },
  {
    email: 'healthy@example.com',
    name: 'Healthy Lifestyle Emma',
    password: process.env.SEED_HEALTHY_PASSWORD || 'healthy123',
  },
  {
    email: 'gourmet@example.com',
    name: 'Gourmet Chef Alex',
    password: process.env.SEED_GOURMET_PASSWORD || 'gourmet123',
  },
]; 