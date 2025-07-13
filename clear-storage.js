// Clear localStorage script for Recipe Manager
// Run this in your browser console to fix authentication issues

console.log('🧹 Clearing Recipe Manager localStorage...');

// Clear all recipe manager related data
localStorage.removeItem('recipe_manager_token');
localStorage.removeItem('recipe_manager_user');

// Also clear any other potential keys
const keys = Object.keys(localStorage);
keys.forEach(key => {
    if (key.includes('recipe') || key.includes('token') || key.includes('auth')) {
        console.log(`Removing: ${key}`);
        localStorage.removeItem(key);
    }
});

console.log('✅ localStorage cleared!');
console.log('🔄 Reloading page...');

// Reload the page to reset the app state
location.reload();

