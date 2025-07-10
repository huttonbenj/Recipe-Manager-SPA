import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Sample users
const sampleUsers = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'admin123',
  },
  {
    email: 'chef@example.com',
    name: 'Chef Maria',
    password: 'chef123',
  },
  {
    email: 'home@example.com',
    name: 'Home Cook',
    password: 'home123',
  },
];

// Sample recipes with detailed data
const sampleRecipes = [
  {
    title: 'Classic Margherita Pizza',
    ingredients: JSON.stringify([
      '2 cups all-purpose flour',
      '1 cup warm water',
      '1 packet active dry yeast',
      '1 tsp salt',
      '2 tbsp olive oil',
      '1 cup marinara sauce',
      '8 oz fresh mozzarella cheese',
      'Fresh basil leaves',
      'Salt and pepper to taste'
    ]),
    instructions: `1. In a large bowl, combine warm water and yeast. Let stand for 5 minutes until foamy.\n2. Add flour, salt, and olive oil. Mix until a dough forms.\n3. Knead on a floured surface for 8-10 minutes until smooth and elastic.\n4. Place in an oiled bowl, cover, and let rise for 1 hour.\n5. Preheat oven to 475°F (245°C).\n6. Roll out dough on a floured surface to fit your pizza pan.\n7. Spread marinara sauce evenly over dough.\n8. Tear mozzarella into chunks and distribute over sauce.\n9. Bake for 12-15 minutes until crust is golden and cheese is bubbly.\n10. Remove from oven, add fresh basil leaves, and serve immediately.`,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    cook_time: 45,
    servings: 4,
    difficulty: 'Medium',
    category: 'Main Course',
    tags: JSON.stringify(['Italian', 'Pizza', 'Vegetarian', 'Comfort Food']),
  },
  {
    title: 'Chicken Tikka Masala',
    ingredients: JSON.stringify([
      '2 lbs boneless chicken thighs, cut into chunks',
      '1 cup plain yogurt',
      '2 tbsp lemon juice',
      '2 tsp garam masala',
      '1 tsp cumin',
      '1 tsp coriander',
      '1 tsp paprika',
      '1 large onion, diced',
      '4 garlic cloves, minced',
      '1 inch fresh ginger, grated',
      '1 can (14 oz) diced tomatoes',
      '1 cup heavy cream',
      '2 tbsp tomato paste',
      'Fresh cilantro for garnish'
    ]),
    instructions: `1. Marinate chicken in yogurt, lemon juice, and half the spices for at least 30 minutes.\n2. Heat oil in a large pan and cook chicken until browned. Remove and set aside.\n3. In the same pan, sauté onions until golden brown.\n4. Add garlic and ginger, cook for 1 minute.\n5. Add tomato paste and remaining spices, cook for 2 minutes.\n6. Add diced tomatoes and simmer for 10 minutes.\n7. Stir in cream and return chicken to the pan.\n8. Simmer for 15-20 minutes until chicken is cooked through.\n9. Garnish with fresh cilantro and serve with rice or naan.`,
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    cook_time: 60,
    servings: 6,
    difficulty: 'Medium',
    category: 'Main Course',
    tags: JSON.stringify(['Indian', 'Chicken', 'Curry', 'Spicy']),
  },
  {
    title: 'Chocolate Chip Cookies',
    ingredients: JSON.stringify([
      '2¼ cups all-purpose flour',
      '1 tsp baking soda',
      '1 tsp salt',
      '1 cup butter, softened',
      '¾ cup granulated sugar',
      '¾ cup packed brown sugar',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 cups chocolate chips'
    ]),
    instructions: `1. Preheat oven to 375°F (190°C).\n2. In a medium bowl, whisk together flour, baking soda, and salt.\n3. In a large bowl, cream together butter and both sugars until fluffy.\n4. Beat in eggs one at a time, then vanilla.\n5. Gradually mix in the flour mixture until just combined.\n6. Stir in chocolate chips.\n7. Drop rounded tablespoons of dough onto ungreased baking sheets.\n8. Bake for 9-11 minutes until golden brown.\n9. Cool on baking sheet for 5 minutes before transferring to wire rack.`,
    image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop',
    cook_time: 30,
    servings: 24,
    difficulty: 'Easy',
    category: 'Dessert',
    tags: JSON.stringify(['Cookies', 'Chocolate', 'Dessert', 'Baking']),
  },
  {
    title: 'Caesar Salad',
    ingredients: JSON.stringify([
      '2 large heads romaine lettuce, chopped',
      '1 cup croutons',
      '½ cup freshly grated Parmesan cheese',
      '2 garlic cloves, minced',
      '2 anchovy fillets, minced',
      '1 egg yolk',
      '2 tbsp lemon juice',
      '1 tsp Dijon mustard',
      '1 tsp Worcestershire sauce',
      '⅓ cup olive oil',
      'Salt and pepper to taste'
    ]),
    instructions: `1. Wash and dry romaine lettuce thoroughly. Chop into bite-sized pieces.\n2. In a large bowl, whisk together garlic, anchovies, egg yolk, lemon juice, mustard, and Worcestershire sauce.\n3. Slowly drizzle in olive oil while whisking continuously to create an emulsion.\n4. Season with salt and pepper to taste.\n5. Add chopped romaine and toss until well coated.\n6. Add croutons and Parmesan cheese.\n7. Toss gently and serve immediately.`,
    image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&h=600&fit=crop',
    cook_time: 15,
    servings: 4,
    difficulty: 'Easy',
    category: 'Salad',
    tags: JSON.stringify(['Salad', 'Vegetarian', 'Quick', 'Healthy']),
  },
  {
    title: 'Beef Stir Fry',
    ingredients: JSON.stringify([
      '1 lb beef sirloin, sliced thin',
      '2 tbsp vegetable oil',
      '1 bell pepper, sliced',
      '1 onion, sliced',
      '2 carrots, julienned',
      '1 cup broccoli florets',
      '3 garlic cloves, minced',
      '1 inch fresh ginger, grated',
      '3 tbsp soy sauce',
      '2 tbsp oyster sauce',
      '1 tbsp cornstarch',
      '1 tsp sesame oil',
      '2 green onions, chopped'
    ]),
    instructions: `1. Mix beef with 1 tbsp soy sauce and cornstarch. Let marinate for 15 minutes.\n2. Heat oil in a large wok or skillet over high heat.\n3. Add beef and stir-fry for 2-3 minutes until browned. Remove and set aside.\n4. Add more oil if needed. Stir-fry vegetables starting with harder ones (carrots, broccoli) for 2-3 minutes.\n5. Add bell pepper and onion, stir-fry for 2 minutes.\n6. Add garlic and ginger, stir-fry for 30 seconds.\n7. Return beef to the pan.\n8. Add remaining soy sauce, oyster sauce, and sesame oil.\n9. Stir-fry for 1-2 minutes until everything is heated through.\n10. Garnish with green onions and serve over rice.`,
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
    cook_time: 25,
    servings: 4,
    difficulty: 'Medium',
    category: 'Main Course',
    tags: JSON.stringify(['Asian', 'Beef', 'Stir Fry', 'Quick']),
  },
  {
    title: 'Banana Bread',
    ingredients: JSON.stringify([
      '3 ripe bananas, mashed',
      '⅓ cup melted butter',
      '¾ cup sugar',
      '1 egg, beaten',
      '1 tsp vanilla extract',
      '1 tsp baking soda',
      'Pinch of salt',
      '1½ cups all-purpose flour',
      '½ cup chopped walnuts (optional)'
    ]),
    instructions: `1. Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.\n2. In a large bowl, mash bananas with a fork.\n3. Stir in melted butter, sugar, egg, and vanilla.\n4. Mix in baking soda and salt.\n5. Add flour and mix until just combined. Don't overmix.\n6. Fold in walnuts if using.\n7. Pour into prepared loaf pan.\n8. Bake for 60-65 minutes until a toothpick inserted in center comes out clean.\n9. Cool in pan for 10 minutes before turning out onto wire rack.`,
    image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&h=600&fit=crop',
    cook_time: 75,
    servings: 8,
    difficulty: 'Easy',
    category: 'Dessert',
    tags: JSON.stringify(['Bread', 'Banana', 'Dessert', 'Baking']),
  },
  {
    title: 'Greek Salad',
    ingredients: JSON.stringify([
      '2 large tomatoes, cut into wedges',
      '1 cucumber, sliced',
      '1 red onion, thinly sliced',
      '1 green bell pepper, sliced',
      '½ cup Kalamata olives',
      '4 oz feta cheese, crumbled',
      '¼ cup extra virgin olive oil',
      '2 tbsp red wine vinegar',
      '1 tsp dried oregano',
      'Salt and pepper to taste'
    ]),
    instructions: `1. In a large bowl, combine tomatoes, cucumber, onion, and bell pepper.\n2. Add olives and feta cheese.\n3. In a small bowl, whisk together olive oil, vinegar, oregano, salt, and pepper.\n4. Pour dressing over salad and toss gently.\n5. Let stand for 10 minutes to allow flavors to meld.\n6. Serve immediately or chill until ready to serve.`,
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop',
    cook_time: 15,
    servings: 4,
    difficulty: 'Easy',
    category: 'Salad',
    tags: JSON.stringify(['Greek', 'Salad', 'Vegetarian', 'Mediterranean']),
  },
  {
    title: 'Spaghetti Carbonara',
    ingredients: JSON.stringify([
      '1 lb spaghetti',
      '4 large eggs',
      '1 cup freshly grated Parmesan cheese',
      '4 oz pancetta or bacon, diced',
      '4 garlic cloves, minced',
      '½ cup dry white wine',
      'Freshly ground black pepper',
      'Salt to taste',
      'Fresh parsley for garnish'
    ]),
    instructions: `1. Cook spaghetti according to package directions until al dente. Reserve 1 cup pasta water before draining.\n2. In a bowl, whisk together eggs, Parmesan, and lots of black pepper.\n3. Cook pancetta in a large skillet until crispy. Add garlic and cook for 1 minute.\n4. Add wine and let it reduce by half.\n5. Add drained hot pasta to the skillet and toss.\n6. Remove from heat and quickly stir in egg mixture, tossing continuously.\n7. Add pasta water a little at a time until creamy consistency is reached.\n8. Season with salt and more pepper if needed.\n9. Serve immediately garnished with parsley and extra Parmesan.`,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop',
    cook_time: 30,
    servings: 4,
    difficulty: 'Medium',
    category: 'Main Course',
    tags: JSON.stringify(['Italian', 'Pasta', 'Creamy', 'Comfort Food']),
  },
  {
    title: 'Chicken Noodle Soup',
    ingredients: JSON.stringify([
      '2 lbs whole chicken',
      '12 cups water',
      '2 carrots, diced',
      '2 celery stalks, diced',
      '1 onion, diced',
      '3 garlic cloves, minced',
      '8 oz egg noodles',
      '2 bay leaves',
      '1 tsp dried thyme',
      '1 tsp dried parsley',
      'Salt and pepper to taste',
      'Fresh dill for garnish'
    ]),
    instructions: `1. Place chicken in a large pot with water, bay leaves, and 1 tsp salt.\n2. Bring to a boil, then reduce heat and simmer for 1 hour.\n3. Remove chicken and let cool. Strain broth and return to pot.\n4. Remove skin and bones from chicken, shred meat into bite-sized pieces.\n5. Bring broth to a boil and add carrots, celery, and onion.\n6. Simmer for 15 minutes until vegetables are tender.\n7. Add noodles and cook according to package directions.\n8. Return shredded chicken to pot.\n9. Season with thyme, parsley, salt, and pepper.\n10. Serve hot garnished with fresh dill.`,
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    cook_time: 90,
    servings: 6,
    difficulty: 'Medium',
    category: 'Soup',
    tags: JSON.stringify(['Comfort Food', 'Chicken', 'Soup', 'Hearty']),
  },
  {
    title: 'Chocolate Brownies',
    ingredients: JSON.stringify([
      '½ cup butter',
      '2 oz unsweetened chocolate, chopped',
      '1 cup granulated sugar',
      '2 large eggs',
      '1 tsp vanilla extract',
      '⅓ cup all-purpose flour',
      '¼ cup cocoa powder',
      '¼ tsp salt',
      '½ cup chocolate chips'
    ]),
    instructions: `1. Preheat oven to 350°F (175°C). Grease an 8x8 inch baking pan.\n2. In a microwave-safe bowl, melt butter and chocolate together in 30-second intervals until smooth.\n3. Stir in sugar until combined.\n4. Beat in eggs one at a time, then vanilla.\n5. In a separate bowl, whisk together flour, cocoa powder, and salt.\n6. Gradually stir dry ingredients into chocolate mixture until just combined.\n7. Fold in chocolate chips.\n8. Spread batter evenly in prepared pan.\n9. Bake for 25-30 minutes until a toothpick inserted in center comes out with a few moist crumbs.\n10. Cool completely before cutting into squares.`,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop',
    cook_time: 45,
    servings: 16,
    difficulty: 'Easy',
    category: 'Dessert',
    tags: JSON.stringify(['Brownies', 'Chocolate', 'Dessert', 'Baking']),
  },
];

async function seedUsers() {
  logger.info('Seeding users...');
  
  for (const userData of sampleUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password_hash: hashedPassword,
        }
      });
      logger.info(`Created user: ${userData.email}`);
    } else {
      logger.info(`User already exists: ${userData.email}`);
    }
  }
}

async function seedRecipes() {
  logger.info('Seeding recipes...');
  
  const users = await prisma.user.findMany();
  
  for (let i = 0; i < sampleRecipes.length; i++) {
    const recipeData = sampleRecipes[i];
    const user = users[i % users.length]; // Distribute recipes among users
    
    const existingRecipe = await prisma.recipe.findFirst({
      where: { 
        title: recipeData.title,
        user_id: user.id
      }
    });

    if (!existingRecipe) {
      await prisma.recipe.create({
        data: {
          ...recipeData,
          user_id: user.id,
        }
      });
      logger.info(`Created recipe: ${recipeData.title} for user: ${user.email}`);
    } else {
      logger.info(`Recipe already exists: ${recipeData.title} for user: ${user.email}`);
    }
  }
}

async function main() {
  try {
    logger.info('Starting database seeding...');
    
    await seedUsers();
    await seedRecipes();
    
    logger.info('Database seeding completed successfully!');
    
    // Display summary
    const userCount = await prisma.user.count();
    const recipeCount = await prisma.recipe.count();
    
    logger.info(`Total users: ${userCount}`);
    logger.info(`Total recipes: ${recipeCount}`);
    
  } catch (error) {
    logger.error('Error during database seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
main().catch((error) => {
  logger.error('Unhandled error in seed script:', error);
  process.exit(1);
}); 