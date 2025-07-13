/**
 * Database Seed Script
 * Populates the database with sample data for development and testing
 */

import { PrismaClient, Difficulty } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@recipemanager.com' },
    update: {},
    create: {
      email: 'demo@recipemanager.com',
      password: hashedPassword,
      name: 'Demo Chef',
      avatar: null,
    },
  })

  const chefMaria = await prisma.user.upsert({
    where: { email: 'maria@chef.com' },
    update: {},
    create: {
      email: 'maria@chef.com',
      password: hashedPassword,
      name: 'Chef Maria Rodriguez',
      avatar: null,
    },
  })

  const chefKenji = await prisma.user.upsert({
    where: { email: 'kenji@culinary.com' },
    update: {},
    create: {
      email: 'kenji@culinary.com',
      password: hashedPassword,
      name: 'Chef Kenji Tanaka',
      avatar: null,
    },
  })

  console.log('👥 Demo users created')

  // Sample recipes data
  const recipes = [
    {
      title: 'Classic Margherita Pizza',
      description: 'A traditional Italian pizza with fresh mozzarella, tomatoes, and basil. Simple ingredients that create the perfect harmony of flavors.',
      ingredients: [
        '300g pizza dough',
        '200g fresh mozzarella cheese',
        '400g canned San Marzano tomatoes',
        '2 cloves garlic, minced',
        'Fresh basil leaves',
        '2 tbsp extra virgin olive oil',
        'Salt and pepper to taste',
        'Pinch of oregano'
      ],
      instructions: `1. Preheat your oven to 475°F (245°C). If you have a pizza stone, place it in the oven while preheating.

2. Prepare the sauce: Crush the San Marzano tomatoes by hand and mix with minced garlic, a pinch of salt, pepper, and oregano.

3. Roll out the pizza dough on a floured surface to about 12 inches in diameter.

4. Spread a thin layer of tomato sauce over the dough, leaving a 1-inch border for the crust.

5. Tear the fresh mozzarella into small pieces and distribute evenly over the sauce.

6. Drizzle with olive oil and season with a light sprinkle of salt and pepper.

7. Transfer to the preheated oven (or pizza stone) and bake for 10-12 minutes until the crust is golden and cheese is bubbly.

8. Remove from oven and immediately top with fresh basil leaves.

9. Let cool for 2-3 minutes before slicing and serving.`,
      cookTime: 15,
      prepTime: 20,
      servings: 4,
      difficulty: Difficulty.EASY,
      tags: ['italian', 'vegetarian', 'pizza', 'comfort-food'],
      cuisine: 'italian',
      authorId: demoUser.id,
    },
    {
      title: 'Authentic Chicken Pad Thai',
      description: 'Street-style Thai stir-fried rice noodles with chicken, featuring the perfect balance of sweet, sour, and savory flavors.',
      ingredients: [
        '200g dried rice noodles (pad thai style)',
        '300g chicken breast, sliced thin',
        '2 eggs, beaten',
        '100g bean sprouts',
        '3 green onions, chopped',
        '2 cloves garlic, minced',
        '30g tamarind paste',
        '2 tbsp fish sauce',
        '2 tbsp palm sugar',
        '1 tbsp vegetable oil',
        'Crushed peanuts for garnish',
        'Lime wedges',
        'Cilantro leaves'
      ],
      instructions: `1. Soak rice noodles in warm water until softened, about 30 minutes.

2. Mix tamarind paste, fish sauce, and palm sugar in a small bowl to create the pad thai sauce.

3. Heat oil in a large wok or skillet over high heat.

4. Add chicken and cook until just done, about 3-4 minutes.

5. Push chicken to one side, add beaten eggs to the empty space and scramble.

6. Add minced garlic and cook for 30 seconds until fragrant.

7. Add drained noodles and pour the sauce over them. Toss everything together.

8. Add bean sprouts and green onions, stir-fry for 2-3 minutes until noodles are tender.

9. Serve immediately with crushed peanuts, lime wedges, and cilantro.`,
      cookTime: 15,
      prepTime: 35,
      servings: 3,
      difficulty: Difficulty.MEDIUM,
      tags: ['thai', 'asian', 'stir-fry', 'noodles', 'chicken'],
      cuisine: 'thai',
      authorId: chefKenji.id,
    },
    {
      title: 'Creamy Mushroom Risotto',
      description: 'Rich and creamy Arborio rice dish with mixed mushrooms, finished with Parmesan cheese and fresh herbs.',
      ingredients: [
        '300g Arborio rice',
        '500g mixed mushrooms (shiitake, cremini, oyster)',
        '1.5L warm chicken or vegetable stock',
        '150ml dry white wine',
        '1 large onion, finely diced',
        '3 cloves garlic, minced',
        '100g Parmesan cheese, grated',
        '3 tbsp butter',
        '2 tbsp olive oil',
        'Fresh thyme and parsley',
        'Salt and white pepper'
      ],
      instructions: `1. Clean and slice mushrooms. Sauté in 1 tbsp butter until golden. Set aside.

2. Heat stock in a separate pot and keep warm.

3. In a large, heavy-bottomed pan, heat olive oil and 1 tbsp butter over medium heat.

4. Add diced onion and cook until translucent, about 5 minutes.

5. Add garlic and cook for another minute.

6. Add Arborio rice and stir for 2-3 minutes until grains are coated and slightly toasted.

7. Pour in white wine and stir until absorbed.

8. Add warm stock one ladle at a time, stirring constantly until each addition is absorbed (about 18-20 minutes total).

9. In the last 5 minutes, fold in the sautéed mushrooms.

10. Remove from heat, stir in remaining butter, Parmesan, and fresh herbs.

11. Season with salt and pepper. Serve immediately.`,
      cookTime: 30,
      prepTime: 15,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      tags: ['italian', 'vegetarian', 'rice', 'mushrooms', 'creamy'],
      cuisine: 'italian',
      authorId: chefMaria.id,
    },
    {
      title: 'BBQ Pulled Pork Sandwiches',
      description: 'Slow-cooked pork shoulder in tangy BBQ sauce, perfect for sandwiches with coleslaw.',
      ingredients: [
        '1.5kg pork shoulder',
        '2 tbsp brown sugar',
        '1 tbsp paprika',
        '1 tsp garlic powder',
        '1 tsp onion powder',
        '1 tsp ground cumin',
        '1 tsp chili powder',
        '200ml BBQ sauce',
        '6 brioche buns',
        'Coleslaw for serving',
        'Pickle slices'
      ],
      instructions: `1. Mix brown sugar, paprika, garlic powder, onion powder, cumin, and chili powder to create dry rub.

2. Coat pork shoulder generously with the spice rub and let sit for at least 2 hours or overnight.

3. Preheat oven to 275°F (135°C).

4. Place pork in a roasting pan and cook for 6-8 hours until internal temperature reaches 195°F (90°C).

5. Remove from oven and let rest for 30 minutes.

6. Shred the pork using two forks, discarding excess fat.

7. Mix shredded pork with BBQ sauce to taste.

8. Toast brioche buns lightly.

9. Pile pulled pork high on bottom buns, top with coleslaw and pickles.

10. Serve with extra BBQ sauce on the side.`,
      cookTime: 480,
      prepTime: 20,
      servings: 6,
      difficulty: Difficulty.EASY,
      tags: ['american', 'bbq', 'pork', 'sandwich', 'slow-cooked'],
      cuisine: 'american',
      authorId: demoUser.id,
    },
    {
      title: 'Fresh Caprese Salad',
      description: 'Simple Italian salad featuring ripe tomatoes, fresh mozzarella, and basil with balsamic glaze.',
      ingredients: [
        '4 large ripe tomatoes',
        '300g fresh mozzarella cheese',
        'Fresh basil leaves',
        '3 tbsp extra virgin olive oil',
        '2 tbsp balsamic vinegar',
        '1 tsp honey',
        'Flaky sea salt',
        'Freshly cracked black pepper'
      ],
      instructions: `1. Slice tomatoes and mozzarella into 1/4 inch thick rounds.

2. Arrange alternating slices of tomato and mozzarella on a serving platter.

3. Tuck fresh basil leaves between the slices.

4. In a small saucepan, reduce balsamic vinegar with honey over medium heat until syrupy, about 5 minutes.

5. Drizzle olive oil over the salad.

6. Drizzle the balsamic reduction over the top.

7. Season with flaky sea salt and freshly cracked black pepper.

8. Let sit for 10 minutes before serving to allow flavors to meld.

9. Serve at room temperature.`,
      cookTime: 5,
      prepTime: 15,
      servings: 4,
      difficulty: Difficulty.EASY,
      tags: ['italian', 'vegetarian', 'salad', 'fresh', 'no-cook'],
      cuisine: 'italian',
      authorId: chefMaria.id,
    },
    {
      title: 'Beef and Broccoli Stir Fry',
      description: 'Classic Chinese-American dish with tender beef and crisp broccoli in a savory brown sauce.',
      ingredients: [
        '500g beef sirloin, sliced thin',
        '500g fresh broccoli florets',
        '2 tbsp cornstarch',
        '3 tbsp soy sauce',
        '2 tbsp oyster sauce',
        '1 tbsp rice wine or dry sherry',
        '1 tsp sesame oil',
        '1 tsp sugar',
        '2 cloves garlic, minced',
        '1 inch ginger, minced',
        '3 tbsp vegetable oil',
        'Steamed white rice for serving'
      ],
      instructions: `1. Marinate sliced beef with 1 tbsp cornstarch and 1 tbsp soy sauce for 15 minutes.

2. Mix remaining soy sauce, oyster sauce, rice wine, sesame oil, sugar, and remaining cornstarch with 1/4 cup water to make sauce.

3. Blanch broccoli in boiling water for 2 minutes, then drain and set aside.

4. Heat 2 tbsp oil in a wok over high heat.

5. Stir-fry marinated beef until just cooked through, about 2-3 minutes. Remove and set aside.

6. Add remaining oil to wok. Add garlic and ginger, stir-fry for 30 seconds.

7. Add blanched broccoli and stir-fry for 1-2 minutes.

8. Return beef to wok, add sauce mixture and toss everything together.

9. Cook for 1-2 minutes until sauce thickens.

10. Serve immediately over steamed rice.`,
      cookTime: 10,
      prepTime: 20,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      tags: ['chinese', 'beef', 'broccoli', 'stir-fry', 'quick'],
      cuisine: 'chinese',
      authorId: chefKenji.id,
    },
    {
      title: 'Chocolate Chip Cookies',
      description: 'Classic homemade chocolate chip cookies that are crispy on the edges and chewy in the center.',
      ingredients: [
        '225g all-purpose flour',
        '1 tsp baking soda',
        '1 tsp salt',
        '115g butter, softened',
        '150g brown sugar',
        '100g granulated sugar',
        '2 large eggs',
        '2 tsp vanilla extract',
        '300g chocolate chips'
      ],
      instructions: `1. Preheat oven to 375°F (190°C).

2. In a bowl, whisk together flour, baking soda, and salt.

3. In a large bowl, cream together softened butter and both sugars until light and fluffy.

4. Beat in eggs one at a time, then add vanilla extract.

5. Gradually mix in the flour mixture until just combined.

6. Fold in chocolate chips.

7. Drop rounded tablespoons of dough onto ungreased baking sheets, spacing 2 inches apart.

8. Bake for 9-11 minutes until golden brown around the edges.

9. Cool on baking sheet for 5 minutes, then transfer to wire rack.

10. Store in airtight container for up to one week.`,
      cookTime: 10,
      prepTime: 15,
      servings: 24,
      difficulty: Difficulty.EASY,
      tags: ['dessert', 'cookies', 'chocolate', 'baking', 'sweet'],
      cuisine: 'american',
      authorId: demoUser.id,
    },
    {
      title: 'Greek Lemon Chicken with Potatoes',
      description: 'Traditional Greek one-pan dish with herb-marinated chicken and crispy roasted potatoes.',
      ingredients: [
        '1 whole chicken (1.5kg), cut into pieces',
        '1kg potatoes, cut into wedges',
        '1/4 cup olive oil',
        'Juice of 2 lemons',
        'Zest of 1 lemon',
        '4 cloves garlic, minced',
        '2 tsp dried oregano',
        '1 tsp dried thyme',
        'Salt and pepper',
        '200ml chicken stock',
        'Fresh parsley for garnish'
      ],
      instructions: `1. Preheat oven to 425°F (220°C).

2. In a large bowl, mix olive oil, lemon juice, lemon zest, garlic, oregano, thyme, salt, and pepper.

3. Add chicken pieces and potato wedges, toss to coat well.

4. Arrange in a large roasting pan in a single layer.

5. Pour chicken stock around the pan.

6. Roast for 45-55 minutes until chicken is golden and potatoes are crispy.

7. Baste occasionally with pan juices.

8. Check that chicken reaches internal temperature of 165°F (74°C).

9. Let rest for 5 minutes before serving.

10. Garnish with fresh parsley and serve with extra lemon wedges.`,
      cookTime: 55,
      prepTime: 15,
      servings: 6,
      difficulty: Difficulty.EASY,
      tags: ['greek', 'chicken', 'potatoes', 'one-pan', 'lemon'],
      cuisine: 'greek',
      authorId: chefMaria.id,
    },
    {
      title: 'Vegetable Curry',
      description: 'Aromatic Indian curry with mixed vegetables in a rich coconut and tomato sauce.',
      ingredients: [
        '2 tbsp coconut oil',
        '1 large onion, diced',
        '3 cloves garlic, minced',
        '1 inch ginger, minced',
        '2 tbsp curry powder',
        '1 tsp ground cumin',
        '1 tsp turmeric',
        '400ml coconut milk',
        '400g canned tomatoes',
        '2 cups mixed vegetables (cauliflower, peas, carrots)',
        '1 can chickpeas, drained',
        'Salt to taste',
        'Fresh cilantro',
        'Basmati rice for serving'
      ],
      instructions: `1. Heat coconut oil in a large pot over medium heat.

2. Add diced onion and cook until softened, about 5 minutes.

3. Add garlic and ginger, cook for 1 minute until fragrant.

4. Add curry powder, cumin, and turmeric. Cook for 30 seconds.

5. Add canned tomatoes and cook for 5 minutes, breaking them up.

6. Pour in coconut milk and bring to a simmer.

7. Add mixed vegetables and chickpeas.

8. Simmer for 15-20 minutes until vegetables are tender.

9. Season with salt to taste.

10. Garnish with fresh cilantro and serve over basmati rice.`,
      cookTime: 30,
      prepTime: 15,
      servings: 4,
      difficulty: Difficulty.EASY,
      tags: ['indian', 'vegetarian', 'curry', 'coconut', 'spicy'],
      cuisine: 'indian',
      authorId: chefKenji.id,
    },
    {
      title: 'French Onion Soup',
      description: 'Classic French soup with caramelized onions in rich beef broth, topped with melted Gruyère cheese.',
      ingredients: [
        '6 large yellow onions, thinly sliced',
        '4 tbsp butter',
        '2 tbsp olive oil',
        '1 tsp sugar',
        '1 tsp salt',
        '1/2 cup dry white wine',
        '6 cups beef stock',
        '2 bay leaves',
        '1 tsp fresh thyme',
        '6 slices baguette',
        '200g Gruyère cheese, grated',
        'Black pepper to taste'
      ],
      instructions: `1. In a large, heavy pot, melt butter with olive oil over medium heat.

2. Add sliced onions, sugar, and salt. Cook, stirring frequently, for 45-60 minutes until deeply caramelized.

3. Add wine and scrape up any browned bits from the bottom of the pot.

4. Add beef stock, bay leaves, and thyme. Bring to a boil, then simmer for 30 minutes.

5. Preheat oven broiler.

6. Season soup with salt and pepper. Remove bay leaves.

7. Ladle soup into oven-safe bowls.

8. Top each bowl with a slice of baguette and generous amount of Gruyère cheese.

9. Place under broiler until cheese is bubbly and golden, about 2-3 minutes.

10. Serve immediately while cheese is still melted.`,
      cookTime: 90,
      prepTime: 15,
      servings: 6,
      difficulty: Difficulty.MEDIUM,
      tags: ['french', 'soup', 'onions', 'cheese', 'comfort-food'],
      cuisine: 'french',
      authorId: chefMaria.id,
    },
    {
      title: 'Teriyaki Salmon',
      description: 'Glazed salmon fillets with homemade teriyaki sauce, served with steamed vegetables.',
      ingredients: [
        '4 salmon fillets (150g each)',
        '1/4 cup soy sauce',
        '2 tbsp mirin',
        '2 tbsp brown sugar',
        '1 tbsp rice vinegar',
        '2 cloves garlic, minced',
        '1 tsp ginger, grated',
        '1 tsp cornstarch',
        '2 tbsp vegetable oil',
        'Sesame seeds for garnish',
        'Green onions, sliced',
        'Steamed broccoli and rice'
      ],
      instructions: `1. Pat salmon fillets dry and season with salt and pepper.

2. Mix soy sauce, mirin, brown sugar, rice vinegar, garlic, and ginger in a small bowl.

3. Heat oil in a large skillet over medium-high heat.

4. Add salmon skin-side up and cook for 4-5 minutes until golden.

5. Flip salmon and cook for another 3-4 minutes.

6. Pour teriyaki sauce over salmon and let it bubble and thicken, about 2 minutes.

7. Remove salmon from heat.

8. Mix cornstarch with 1 tbsp water and add to remaining sauce in pan to thicken.

9. Serve salmon with steamed vegetables and rice.

10. Garnish with sesame seeds and sliced green onions.`,
      cookTime: 15,
      prepTime: 10,
      servings: 4,
      difficulty: Difficulty.EASY,
      tags: ['japanese', 'salmon', 'teriyaki', 'healthy', 'quick'],
      cuisine: 'japanese',
      authorId: chefKenji.id,
    },
    {
      title: 'Caesar Salad',
      description: 'Classic Caesar salad with crisp romaine lettuce, homemade croutons, and creamy Caesar dressing.',
      ingredients: [
        '2 large heads romaine lettuce',
        '100g Parmesan cheese, grated',
        '2 cups day-old bread, cubed',
        '3 tbsp olive oil',
        '2 cloves garlic, minced',
        '3 anchovy fillets',
        '1 egg yolk',
        '2 tbsp lemon juice',
        '1 tsp Dijon mustard',
        '1/4 cup olive oil (for dressing)',
        'Salt and pepper'
      ],
      instructions: `1. Preheat oven to 400°F (200°C).

2. For croutons: toss bread cubes with 3 tbsp olive oil and half the minced garlic. Bake for 10-12 minutes until golden.

3. For dressing: mash anchovy fillets with remaining garlic and a pinch of salt.

4. Whisk in egg yolk, lemon juice, and Dijon mustard.

5. Slowly drizzle in olive oil while whisking constantly until emulsified.

6. Season with salt and pepper.

7. Wash and dry romaine lettuce, tear into bite-sized pieces.

8. In a large bowl, toss lettuce with dressing.

9. Add half the Parmesan cheese and toss again.

10. Top with croutons and remaining Parmesan. Serve immediately.`,
      cookTime: 12,
      prepTime: 20,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      tags: ['salad', 'roman', 'anchovy', 'parmesan', 'classic'],
      cuisine: 'italian',
      authorId: demoUser.id,
    }
  ]

  // Create recipes
  console.log('🍳 Creating sample recipes...')
  for (const recipe of recipes) {
    // Check if recipe already exists by title
    const existingRecipe = await prisma.recipe.findFirst({
      where: { title: recipe.title }
    })
    
    if (!existingRecipe) {
      await prisma.recipe.create({
        data: recipe,
      })
      console.log(`   ✓ Created recipe: ${recipe.title}`)
    } else {
      console.log(`   → Recipe already exists: ${recipe.title}`)
    }
  }

  console.log('✅ Database seeding completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - 3 demo users`)
  console.log(`   - ${recipes.length} sample recipes`)
  console.log(``)
  console.log(`🔑 Demo login credentials:`)
  console.log(`   Email: demo@recipemanager.com`)
  console.log(`   Password: password123`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })