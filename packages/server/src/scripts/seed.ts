import { db } from '../config/database';
import { AuthUtils } from '../utils/auth';

const sampleRecipes = [
    {
        title: 'Classic Spaghetti Carbonara',
        description: 'A traditional Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
        difficulty: 'medium',
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        cuisineType: 'Italian',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500',
        ingredients: [
            { name: 'Spaghetti', amount: '400g', unit: 'grams' },
            { name: 'Pancetta', amount: '150g', unit: 'grams' },
            { name: 'Large eggs', amount: '3', unit: 'pieces' },
            { name: 'Parmesan cheese', amount: '100g', unit: 'grams' },
            { name: 'Black pepper', amount: '1', unit: 'tsp' },
            { name: 'Salt', amount: 'to taste', unit: '' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Bring a large pot of salted water to boil and cook spaghetti according to package directions.' },
            { stepNumber: 2, instruction: 'While pasta cooks, heat pancetta in a large skillet over medium heat until crispy.' },
            { stepNumber: 3, instruction: 'In a bowl, whisk together eggs, grated Parmesan, and black pepper.' },
            { stepNumber: 4, instruction: 'Drain pasta, reserving 1 cup pasta water. Add hot pasta to pancetta.' },
            { stepNumber: 5, instruction: 'Remove from heat and quickly toss with egg mixture, adding pasta water as needed.' },
            { stepNumber: 6, instruction: 'Serve immediately with extra Parmesan and black pepper.' }
        ]
    },
    {
        title: 'Chicken Tikka Masala',
        description: 'Tender chicken in a creamy, spiced tomato sauce served with rice.',
        difficulty: 'hard',
        prepTime: 30,
        cookTime: 40,
        servings: 6,
        cuisineType: 'Indian',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500',
        ingredients: [
            { name: 'Chicken breast', amount: '1kg', unit: 'grams' },
            { name: 'Greek yogurt', amount: '200ml', unit: 'ml' },
            { name: 'Onion', amount: '1', unit: 'large' },
            { name: 'Garlic', amount: '4', unit: 'cloves' },
            { name: 'Ginger', amount: '2', unit: 'tsp' },
            { name: 'Tomato sauce', amount: '400ml', unit: 'ml' },
            { name: 'Heavy cream', amount: '200ml', unit: 'ml' },
            { name: 'Garam masala', amount: '2', unit: 'tsp' },
            { name: 'Cumin', amount: '1', unit: 'tsp' },
            { name: 'Paprika', amount: '1', unit: 'tsp' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Cut chicken into bite-sized pieces and marinate in yogurt and spices for 30 minutes.' },
            { stepNumber: 2, instruction: 'Heat oil in a large pan and cook chicken until golden. Remove and set aside.' },
            { stepNumber: 3, instruction: 'In the same pan, cook onions until soft, then add garlic and ginger.' },
            { stepNumber: 4, instruction: 'Add tomato sauce and spices, simmer for 10 minutes.' },
            { stepNumber: 5, instruction: 'Return chicken to pan, add cream and simmer for 15 minutes.' },
            { stepNumber: 6, instruction: 'Serve hot with basmati rice and naan bread.' }
        ]
    },
    {
        title: 'Beef Tacos',
        description: 'Seasoned ground beef in soft tortillas with fresh toppings.',
        difficulty: 'easy',
        prepTime: 15,
        cookTime: 15,
        servings: 4,
        cuisineType: 'Mexican',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
        ingredients: [
            { name: 'Ground beef', amount: '500g', unit: 'grams' },
            { name: 'Taco seasoning', amount: '1', unit: 'packet' },
            { name: 'Soft tortillas', amount: '8', unit: 'pieces' },
            { name: 'Lettuce', amount: '1', unit: 'head' },
            { name: 'Tomatoes', amount: '2', unit: 'medium' },
            { name: 'Cheese', amount: '200g', unit: 'grams' },
            { name: 'Sour cream', amount: '200ml', unit: 'ml' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Brown ground beef in a large skillet over medium-high heat.' },
            { stepNumber: 2, instruction: 'Add taco seasoning and water according to package directions.' },
            { stepNumber: 3, instruction: 'Simmer for 5 minutes until sauce thickens.' },
            { stepNumber: 4, instruction: 'Warm tortillas in microwave or dry skillet.' },
            { stepNumber: 5, instruction: 'Fill tortillas with beef and desired toppings.' },
            { stepNumber: 6, instruction: 'Serve immediately with lime wedges.' }
        ]
    },
    {
        title: 'Caesar Salad',
        description: 'Classic romaine lettuce salad with Caesar dressing and croutons.',
        difficulty: 'easy',
        prepTime: 20,
        cookTime: 0,
        servings: 4,
        cuisineType: 'American',
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500',
        ingredients: [
            { name: 'Romaine lettuce', amount: '2', unit: 'heads' },
            { name: 'Parmesan cheese', amount: '100g', unit: 'grams' },
            { name: 'Croutons', amount: '1', unit: 'cup' },
            { name: 'Caesar dressing', amount: '100ml', unit: 'ml' },
            { name: 'Anchovies', amount: '4', unit: 'fillets' },
            { name: 'Lemon juice', amount: '2', unit: 'tbsp' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Wash and chop romaine lettuce into bite-sized pieces.' },
            { stepNumber: 2, instruction: 'In a large bowl, toss lettuce with Caesar dressing.' },
            { stepNumber: 3, instruction: 'Add croutons and grated Parmesan cheese.' },
            { stepNumber: 4, instruction: 'Top with anchovies if desired.' },
            { stepNumber: 5, instruction: 'Serve immediately with extra Parmesan and lemon wedges.' }
        ]
    },
    {
        title: 'Chocolate Chip Cookies',
        description: 'Classic soft and chewy chocolate chip cookies.',
        difficulty: 'easy',
        prepTime: 15,
        cookTime: 12,
        servings: 24,
        cuisineType: 'American',
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
        ingredients: [
            { name: 'All-purpose flour', amount: '2.25', unit: 'cups' },
            { name: 'Butter', amount: '1', unit: 'cup' },
            { name: 'Brown sugar', amount: '0.75', unit: 'cup' },
            { name: 'White sugar', amount: '0.75', unit: 'cup' },
            { name: 'Eggs', amount: '2', unit: 'large' },
            { name: 'Vanilla extract', amount: '2', unit: 'tsp' },
            { name: 'Baking soda', amount: '1', unit: 'tsp' },
            { name: 'Salt', amount: '1', unit: 'tsp' },
            { name: 'Chocolate chips', amount: '2', unit: 'cups' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Preheat oven to 375°F (190°C).' },
            { stepNumber: 2, instruction: 'Cream together butter and both sugars until light and fluffy.' },
            { stepNumber: 3, instruction: 'Beat in eggs one at a time, then vanilla.' },
            { stepNumber: 4, instruction: 'In separate bowl, whisk together flour, baking soda, and salt.' },
            { stepNumber: 5, instruction: 'Gradually mix dry ingredients into wet ingredients.' },
            { stepNumber: 6, instruction: 'Fold in chocolate chips.' },
            { stepNumber: 7, instruction: 'Drop rounded tablespoons onto ungreased baking sheets.' },
            { stepNumber: 8, instruction: 'Bake for 9-11 minutes until golden brown.' }
        ]
    },
    {
        title: 'Thai Green Curry',
        description: 'Aromatic Thai curry with vegetables and coconut milk.',
        difficulty: 'medium',
        prepTime: 20,
        cookTime: 25,
        servings: 4,
        cuisineType: 'Thai',
        imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500',
        ingredients: [
            { name: 'Green curry paste', amount: '3', unit: 'tbsp' },
            { name: 'Coconut milk', amount: '400ml', unit: 'ml' },
            { name: 'Chicken thigh', amount: '500g', unit: 'grams' },
            { name: 'Thai eggplant', amount: '200g', unit: 'grams' },
            { name: 'Bell peppers', amount: '2', unit: 'medium' },
            { name: 'Thai basil', amount: '1', unit: 'cup' },
            { name: 'Fish sauce', amount: '2', unit: 'tbsp' },
            { name: 'Palm sugar', amount: '1', unit: 'tbsp' },
            { name: 'Lime leaves', amount: '4', unit: 'leaves' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Heat 2 tbsp of thick coconut milk in a wok over medium heat.' },
            { stepNumber: 2, instruction: 'Add curry paste and fry until fragrant.' },
            { stepNumber: 3, instruction: 'Add chicken and cook until nearly done.' },
            { stepNumber: 4, instruction: 'Pour in remaining coconut milk and bring to a simmer.' },
            { stepNumber: 5, instruction: 'Add vegetables and seasonings, cook for 10 minutes.' },
            { stepNumber: 6, instruction: 'Stir in Thai basil and serve with jasmine rice.' }
        ]
    },
    {
        title: 'Margherita Pizza',
        description: 'Classic Italian pizza with tomato, mozzarella, and fresh basil.',
        difficulty: 'medium',
        prepTime: 90,
        cookTime: 15,
        servings: 4,
        cuisineType: 'Italian',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500',
        ingredients: [
            { name: 'Pizza dough', amount: '500g', unit: 'grams' },
            { name: 'Tomato sauce', amount: '200ml', unit: 'ml' },
            { name: 'Fresh mozzarella', amount: '250g', unit: 'grams' },
            { name: 'Fresh basil', amount: '20', unit: 'leaves' },
            { name: 'Olive oil', amount: '2', unit: 'tbsp' },
            { name: 'Salt', amount: 'to taste', unit: '' },
            { name: 'Black pepper', amount: 'to taste', unit: '' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Preheat oven to 475°F (245°C) with pizza stone if available.' },
            { stepNumber: 2, instruction: 'Roll out pizza dough on floured surface.' },
            { stepNumber: 3, instruction: 'Spread tomato sauce evenly, leaving border for crust.' },
            { stepNumber: 4, instruction: 'Tear mozzarella into pieces and distribute over sauce.' },
            { stepNumber: 5, instruction: 'Drizzle with olive oil and season with salt and pepper.' },
            { stepNumber: 6, instruction: 'Bake for 12-15 minutes until crust is golden.' },
            { stepNumber: 7, instruction: 'Top with fresh basil leaves and serve immediately.' }
        ]
    },
    {
        title: 'Beef Stir Fry',
        description: 'Quick and healthy stir fry with tender beef and crisp vegetables.',
        difficulty: 'easy',
        prepTime: 15,
        cookTime: 10,
        servings: 4,
        cuisineType: 'Asian',
        imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500',
        ingredients: [
            { name: 'Beef sirloin', amount: '500g', unit: 'grams' },
            { name: 'Broccoli', amount: '300g', unit: 'grams' },
            { name: 'Bell peppers', amount: '2', unit: 'medium' },
            { name: 'Soy sauce', amount: '3', unit: 'tbsp' },
            { name: 'Oyster sauce', amount: '2', unit: 'tbsp' },
            { name: 'Garlic', amount: '3', unit: 'cloves' },
            { name: 'Ginger', amount: '1', unit: 'tbsp' },
            { name: 'Vegetable oil', amount: '2', unit: 'tbsp' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Slice beef thinly against the grain.' },
            { stepNumber: 2, instruction: 'Cut vegetables into bite-sized pieces.' },
            { stepNumber: 3, instruction: 'Heat oil in wok or large skillet over high heat.' },
            { stepNumber: 4, instruction: 'Stir-fry beef for 2-3 minutes until browned.' },
            { stepNumber: 5, instruction: 'Add vegetables and stir-fry for 3-4 minutes.' },
            { stepNumber: 6, instruction: 'Add sauces and stir-fry for 1 minute more.' },
            { stepNumber: 7, instruction: 'Serve immediately over steamed rice.' }
        ]
    },
    {
        title: 'Greek Salad',
        description: 'Fresh Mediterranean salad with olives, feta, and vegetables.',
        difficulty: 'easy',
        prepTime: 15,
        cookTime: 0,
        servings: 4,
        cuisineType: 'Greek',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
        ingredients: [
            { name: 'Tomatoes', amount: '4', unit: 'large' },
            { name: 'Cucumber', amount: '1', unit: 'large' },
            { name: 'Red onion', amount: '0.5', unit: 'medium' },
            { name: 'Feta cheese', amount: '200g', unit: 'grams' },
            { name: 'Kalamata olives', amount: '100g', unit: 'grams' },
            { name: 'Olive oil', amount: '60ml', unit: 'ml' },
            { name: 'Red wine vinegar', amount: '2', unit: 'tbsp' },
            { name: 'Oregano', amount: '1', unit: 'tsp' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Cut tomatoes into wedges and cucumber into thick slices.' },
            { stepNumber: 2, instruction: 'Slice red onion thinly.' },
            { stepNumber: 3, instruction: 'Combine vegetables in a large bowl.' },
            { stepNumber: 4, instruction: 'Add olives and crumbled feta cheese.' },
            { stepNumber: 5, instruction: 'Whisk together olive oil, vinegar, and oregano.' },
            { stepNumber: 6, instruction: 'Pour dressing over salad and toss gently.' },
            { stepNumber: 7, instruction: 'Let stand for 10 minutes before serving.' }
        ]
    },
    {
        title: 'Pancakes',
        description: 'Fluffy American-style pancakes perfect for breakfast.',
        difficulty: 'easy',
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        cuisineType: 'American',
        imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500',
        ingredients: [
            { name: 'All-purpose flour', amount: '2', unit: 'cups' },
            { name: 'Sugar', amount: '2', unit: 'tbsp' },
            { name: 'Baking powder', amount: '2', unit: 'tsp' },
            { name: 'Salt', amount: '1', unit: 'tsp' },
            { name: 'Milk', amount: '1.75', unit: 'cups' },
            { name: 'Eggs', amount: '2', unit: 'large' },
            { name: 'Butter', amount: '4', unit: 'tbsp' },
            { name: 'Vanilla extract', amount: '1', unit: 'tsp' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Mix flour, sugar, baking powder, and salt in a large bowl.' },
            { stepNumber: 2, instruction: 'In another bowl, whisk together milk, eggs, melted butter, and vanilla.' },
            { stepNumber: 3, instruction: 'Pour wet ingredients into dry ingredients and mix until just combined.' },
            { stepNumber: 4, instruction: 'Heat griddle or non-stick pan over medium heat.' },
            { stepNumber: 5, instruction: 'Pour 1/4 cup batter for each pancake.' },
            { stepNumber: 6, instruction: 'Cook until bubbles form on surface, then flip.' },
            { stepNumber: 7, instruction: 'Cook until golden brown and serve with syrup.' }
        ]
    },
    {
        title: 'Salmon Teriyaki',
        description: 'Glazed salmon with sweet and savory teriyaki sauce.',
        difficulty: 'medium',
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        cuisineType: 'Japanese',
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500',
        ingredients: [
            { name: 'Salmon fillets', amount: '4', unit: 'pieces' },
            { name: 'Soy sauce', amount: '60ml', unit: 'ml' },
            { name: 'Mirin', amount: '60ml', unit: 'ml' },
            { name: 'Sugar', amount: '2', unit: 'tbsp' },
            { name: 'Sake', amount: '2', unit: 'tbsp' },
            { name: 'Ginger', amount: '1', unit: 'tbsp' },
            { name: 'Garlic', amount: '2', unit: 'cloves' },
            { name: 'Sesame seeds', amount: '1', unit: 'tbsp' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Combine soy sauce, mirin, sugar, and sake in a small saucepan.' },
            { stepNumber: 2, instruction: 'Add minced ginger and garlic to the sauce.' },
            { stepNumber: 3, instruction: 'Simmer sauce for 5 minutes until slightly thickened.' },
            { stepNumber: 4, instruction: 'Season salmon fillets with salt and pepper.' },
            { stepNumber: 5, instruction: 'Pan-fry salmon skin-side down for 4-5 minutes.' },
            { stepNumber: 6, instruction: 'Flip salmon and brush with teriyaki sauce.' },
            { stepNumber: 7, instruction: 'Cook for 3-4 minutes more and garnish with sesame seeds.' }
        ]
    },
    {
        title: 'Vegetable Curry',
        description: 'Hearty vegetarian curry with mixed vegetables and spices.',
        difficulty: 'medium',
        prepTime: 20,
        cookTime: 30,
        servings: 6,
        cuisineType: 'Indian',
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
        ingredients: [
            { name: 'Potatoes', amount: '3', unit: 'medium' },
            { name: 'Cauliflower', amount: '1', unit: 'head' },
            { name: 'Carrots', amount: '2', unit: 'large' },
            { name: 'Green peas', amount: '1', unit: 'cup' },
            { name: 'Onion', amount: '1', unit: 'large' },
            { name: 'Coconut milk', amount: '400ml', unit: 'ml' },
            { name: 'Curry powder', amount: '2', unit: 'tbsp' },
            { name: 'Turmeric', amount: '1', unit: 'tsp' },
            { name: 'Cumin', amount: '1', unit: 'tsp' },
            { name: 'Ginger', amount: '1', unit: 'tbsp' }
        ],
        steps: [
            { stepNumber: 1, instruction: 'Cut all vegetables into bite-sized pieces.' },
            { stepNumber: 2, instruction: 'Heat oil in a large pot and sauté onions until soft.' },
            { stepNumber: 3, instruction: 'Add spices and cook for 1 minute until fragrant.' },
            { stepNumber: 4, instruction: 'Add potatoes and carrots, cook for 5 minutes.' },
            { stepNumber: 5, instruction: 'Pour in coconut milk and bring to a simmer.' },
            { stepNumber: 6, instruction: 'Add cauliflower and peas, cook for 15 minutes.' },
            { stepNumber: 7, instruction: 'Simmer until vegetables are tender and serve with rice.' }
        ]
    }
];

async function seedDatabase() {
    const client = await db.getClient();
    
    try {
        await client.query('BEGIN');
        
        // Create a test user
        const hashedPassword = await AuthUtils.hashPassword('password123');
        const userResult = await client.query(
            'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id',
            ['test@example.com', hashedPassword, 'Test User']
        );
        const userId = userResult.rows[0].id;
        
        // eslint-disable-next-line no-console
        console.log('Created test user with ID:', userId);
        
        // Insert recipes
        for (const recipe of sampleRecipes) {
            // Insert recipe
            const recipeResult = await client.query(`
                INSERT INTO recipes (
                    title, description, difficulty, prep_time, cook_time, 
                    servings, cuisine_type, image_url, user_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
            `, [
                recipe.title,
                recipe.description,
                recipe.difficulty,
                recipe.prepTime,
                recipe.cookTime,
                recipe.servings,
                recipe.cuisineType,
                recipe.imageUrl,
                userId
            ]);
            
            const recipeId = recipeResult.rows[0].id;
            // eslint-disable-next-line no-console
            console.log(`Created recipe: ${recipe.title} with ID: ${recipeId}`);
            
            // Insert ingredients
            for (const ingredient of recipe.ingredients) {
                await client.query(`
                    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
                    VALUES ($1, $2, $3, $4)
                `, [recipeId, ingredient.name, ingredient.amount, ingredient.unit]);
            }
            
            // Insert steps
            for (const step of recipe.steps) {
                await client.query(`
                    INSERT INTO recipe_steps (recipe_id, step_number, instruction)
                    VALUES ($1, $2, $3)
                `, [recipeId, step.stepNumber, step.instruction]);
            }
        }
        
        await client.query('COMMIT');
        // eslint-disable-next-line no-console
        console.log('Database seeded successfully!');
        // eslint-disable-next-line no-console
        console.log(`Created ${sampleRecipes.length} recipes with ingredients and steps`);
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        client.release();
        await db.close();
    }
}

// Run the seed function
if (require.main === module) {
    seedDatabase().catch(console.error);
}

export { seedDatabase }; 