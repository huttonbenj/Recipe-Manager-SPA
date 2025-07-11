// Sample users - passwords from environment variables or secure defaults
export const sampleUsers = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    password: process.env.SEED_ADMIN_PASSWORD || 'TempAdmin2024!',
  },
  {
    email: 'chef@example.com',
    name: 'Chef Maria',
    password: process.env.SEED_CHEF_PASSWORD || 'TempChef2024!',
  },
  {
    email: 'home@example.com',
    name: 'Home Cook',
    password: process.env.SEED_HOME_PASSWORD || 'TempHome2024!',
  },
]; 