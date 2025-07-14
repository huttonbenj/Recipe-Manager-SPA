/**
 * Enhanced Database Seed Script
 * Populates the database with comprehensive sample data to showcase all features
 */

import { PrismaClient, Difficulty } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting enhanced database seeding...')

  // Create demo users with diverse profiles
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

  const chefAisha = await prisma.user.upsert({
    where: { email: 'aisha@spice.com' },
    update: {},
    create: {
      email: 'aisha@spice.com',
      password: hashedPassword,
      name: 'Chef Aisha Patel',
      avatar: null,
    },
  })

  const chefPierre = await prisma.user.upsert({
    where: { email: 'pierre@bistro.com' },
    update: {},
    create: {
      email: 'pierre@bistro.com',
      password: hashedPassword,
      name: 'Chef Pierre Dubois',
      avatar: null,
    },
  })

  const homeChef = await prisma.user.upsert({
    where: { email: 'sarah@home.com' },
    update: {},
    create: {
      email: 'sarah@home.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      avatar: null,
    },
  })

  console.log('👥 Demo users created')

  // Enhanced sample recipes data with more variety
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
      imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60',
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
      imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=60',
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
      imageUrl: 'https://images.unsplash.com/photo-1633478062482-790e3b5dd810?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Authentic Butter Chicken',
      description: 'Rich and creamy Indian curry with tender chicken in a tomato-based sauce, perfect with naan bread.',
      ingredients: [
        '500g chicken breast, cubed',
        '200ml heavy cream',
        '400g crushed tomatoes',
        '1 large onion, diced',
        '4 cloves garlic, minced',
        '1 inch ginger, minced',
        '2 tbsp butter',
        '1 tbsp garam masala',
        '1 tsp turmeric',
        '1 tsp paprika',
        '1 tsp cumin',
        '1/2 tsp cayenne pepper',
        'Salt to taste',
        'Fresh cilantro',
        'Basmati rice or naan'
      ],
      instructions: `1. Season chicken with salt, turmeric, and half the garam masala. Let marinate for 30 minutes.

2. Heat butter in a large pan over medium-high heat.

3. Cook chicken until golden brown on all sides, about 5-6 minutes. Remove and set aside.

4. In the same pan, add diced onion and cook until softened, about 5 minutes.

5. Add garlic and ginger, cook for 1 minute until fragrant.

6. Add remaining spices (garam masala, paprika, cumin, cayenne) and cook for 30 seconds.

7. Add crushed tomatoes and simmer for 10 minutes until sauce thickens.

8. Return chicken to the pan and simmer for 5 minutes.

9. Stir in heavy cream and simmer for another 5 minutes until heated through.

10. Garnish with fresh cilantro and serve with basmati rice or naan bread.`,
      cookTime: 25,
      prepTime: 40,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      tags: ['indian', 'chicken', 'curry', 'creamy', 'spicy'],
      cuisine: 'indian',
      authorId: chefAisha.id,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Coq au Vin',
      description: 'Classic French braised chicken in red wine with mushrooms and pearl onions.',
      ingredients: [
        '1 whole chicken (1.5kg), cut into pieces',
        '750ml red wine (Burgundy preferred)',
        '200g pearl onions',
        '200g mushrooms, halved',
        '150g bacon, diced',
        '2 carrots, sliced',
        '2 celery stalks, diced',
        '3 cloves garlic, minced',
        '2 tbsp tomato paste',
        '2 bay leaves',
        '1 tsp fresh thyme',
        '2 tbsp butter',
        '2 tbsp flour',
        'Salt and pepper',
        'Fresh parsley'
      ],
      instructions: `1. Season chicken pieces with salt and pepper.

2. In a large Dutch oven, cook diced bacon until crispy. Remove and set aside.

3. Brown chicken pieces in the bacon fat until golden on all sides. Remove and set aside.

4. Add pearl onions and mushrooms to the pot, cook until golden. Remove and set aside.

5. Add carrots, celery, and garlic to the pot. Cook for 5 minutes.

6. Add tomato paste and cook for 1 minute.

7. Return chicken to the pot, add red wine, bay leaves, and thyme.

8. Bring to a boil, then reduce heat and simmer covered for 45 minutes.

9. Add pearl onions and mushrooms back to the pot, simmer for 15 minutes more.

10. Mix butter and flour to make a paste, stir into the sauce to thicken.

11. Garnish with crispy bacon and fresh parsley before serving.`,
      cookTime: 75,
      prepTime: 20,
      servings: 4,
      difficulty: Difficulty.HARD,
      tags: ['french', 'chicken', 'wine', 'braised', 'classic'],
      cuisine: 'french',
      authorId: chefPierre.id,
      imageUrl: 'https://images.unsplash.com/photo-1610725663727-08695a1ac3ff?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Korean Bulgogi',
      description: 'Sweet and savory Korean grilled beef, perfect for BBQ or serving over rice.',
      ingredients: [
        '500g ribeye or sirloin, thinly sliced',
        '1 Asian pear, grated',
        '1/2 cup soy sauce',
        '2 tbsp brown sugar',
        '2 tbsp sesame oil',
        '1 tbsp rice wine',
        '4 cloves garlic, minced',
        '1 inch ginger, minced',
        '2 green onions, sliced',
        '1 tbsp sesame seeds',
        '1 tbsp vegetable oil',
        'Steamed rice',
        'Kimchi for serving'
      ],
      instructions: `1. In a bowl, mix grated pear, soy sauce, brown sugar, sesame oil, rice wine, garlic, and ginger.

2. Add sliced beef to the marinade and mix well. Marinate for at least 2 hours or overnight.

3. Heat vegetable oil in a large skillet or wok over high heat.

4. Remove beef from marinade and cook in batches, not overcrowding the pan.

5. Cook for 2-3 minutes per side until beef is caramelized and cooked through.

6. Garnish with sliced green onions and sesame seeds.

7. Serve hot over steamed rice with kimchi on the side.`,
      cookTime: 10,
      prepTime: 15,
      servings: 4,
      difficulty: Difficulty.EASY,
      tags: ['korean', 'beef', 'grilled', 'marinated', 'asian'],
      cuisine: 'korean',
      authorId: chefKenji.id,
      imageUrl: 'https://images.unsplash.com/photo-1625937306014-8e17ce8c0fee?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Moroccan Tagine',
      description: 'Aromatic slow-cooked stew with lamb, apricots, and warm spices.',
      ingredients: [
        '800g lamb shoulder, cubed',
        '2 onions, sliced',
        '3 cloves garlic, minced',
        '1 inch ginger, minced',
        '200g dried apricots',
        '400g canned tomatoes',
        '2 tsp ground cinnamon',
        '1 tsp ground ginger',
        '1 tsp turmeric',
        '1/2 tsp saffron threads',
        '2 tbsp olive oil',
        '500ml beef stock',
        '100g almonds, toasted',
        'Fresh cilantro',
        'Couscous for serving'
      ],
      instructions: `1. Heat olive oil in a tagine or heavy Dutch oven over medium-high heat.

2. Brown lamb pieces on all sides, about 8-10 minutes total. Remove and set aside.

3. Add sliced onions to the pot and cook until softened, about 5 minutes.

4. Add garlic and ginger, cook for 1 minute until fragrant.

5. Add spices (cinnamon, ginger, turmeric, saffron) and cook for 30 seconds.

6. Return lamb to the pot, add tomatoes, apricots, and stock.

7. Bring to a boil, then reduce heat and simmer covered for 1.5-2 hours until lamb is tender.

8. Stir in toasted almonds in the last 10 minutes of cooking.

9. Garnish with fresh cilantro and serve over couscous.`,
      cookTime: 120,
      prepTime: 20,
      servings: 6,
      difficulty: Difficulty.MEDIUM,
      tags: ['moroccan', 'lamb', 'apricots', 'slow-cooked', 'aromatic'],
      cuisine: 'moroccan',
      authorId: chefAisha.id,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Beef Wellington',
      description: 'Luxury beef tenderloin wrapped in puff pastry with mushroom duxelles - a true showstopper.',
      ingredients: [
        '1kg beef tenderloin, trimmed',
        '500g puff pastry',
        '300g mushrooms, finely chopped',
        '200g pâté de foie gras (optional)',
        '6 slices prosciutto',
        '2 egg yolks, beaten',
        '2 tbsp Dijon mustard',
        '2 tbsp olive oil',
        '1 shallot, minced',
        '2 cloves garlic, minced',
        '1/4 cup brandy',
        'Salt and pepper',
        'Fresh thyme'
      ],
      instructions: `1. Season beef with salt and pepper. Heat oil in a large skillet over high heat.

2. Sear beef on all sides until golden brown, about 2-3 minutes per side. Let cool completely.

3. Brush beef with Dijon mustard and spread with pâté if using.

4. For duxelles: Cook mushrooms, shallot, and garlic until moisture evaporates, about 10 minutes.

5. Add brandy and thyme, cook until dry. Season and cool completely.

6. Lay plastic wrap on work surface, arrange prosciutto slices overlapping.

7. Spread mushroom duxelles over prosciutto, place beef on top.

8. Roll tightly using plastic wrap, twist ends to seal. Refrigerate for 30 minutes.

9. Roll out puff pastry, remove plastic from beef and place in center.

10. Wrap pastry around beef, seal edges with beaten egg.

11. Brush with egg wash, score decoratively.

12. Bake at 400°F (200°C) for 25-30 minutes until pastry is golden and beef reaches 125°F (52°C) for medium-rare.

13. Rest for 10 minutes before slicing.`,
      cookTime: 45,
      prepTime: 60,
      servings: 6,
      difficulty: Difficulty.HARD,
      tags: ['british', 'beef', 'pastry', 'luxury', 'special-occasion'],
      cuisine: 'british',
      authorId: chefPierre.id,
      imageUrl: 'https://images.unsplash.com/photo-1558030089-6c3b027c2e81?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Mexican Street Tacos',
      description: 'Authentic tacos with perfectly seasoned meat, fresh toppings, and handmade tortillas.',
      ingredients: [
        '500g beef chuck roast, diced',
        '1 white onion, diced',
        '2 tsp chili powder',
        '1 tsp cumin',
        '1 tsp paprika',
        '1/2 tsp oregano',
        '12 corn tortillas',
        '1 white onion, finely diced',
        '1 bunch cilantro, chopped',
        '2 limes, cut into wedges',
        '200g queso fresco, crumbled',
        'Salsa verde',
        'Mexican crema',
        'Salt and pepper'
      ],
      instructions: `1. Season diced beef with chili powder, cumin, paprika, oregano, salt, and pepper.

2. Heat a large skillet over medium-high heat. Cook beef until browned and tender, about 8-10 minutes.

3. Add diced onion and cook until softened, about 5 minutes.

4. Warm corn tortillas on a dry skillet or over open flame until slightly charred.

5. Fill each tortilla with beef mixture.

6. Top with diced white onion, chopped cilantro, and crumbled queso fresco.

7. Serve with lime wedges, salsa verde, and Mexican crema on the side.

8. Eat immediately while tortillas are warm.`,
      cookTime: 15,
      prepTime: 15,
      servings: 4,
      difficulty: Difficulty.EASY,
      tags: ['mexican', 'beef', 'tacos', 'street-food', 'authentic'],
      cuisine: 'mexican',
      authorId: chefMaria.id,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Homemade Ramen',
      description: 'Rich, flavorful ramen with homemade broth, perfect noodles, and traditional toppings.',
      ingredients: [
        '2 packs fresh ramen noodles',
        '1L chicken stock',
        '500ml pork stock',
        '2 tbsp miso paste',
        '1 tbsp soy sauce',
        '1 tsp sesame oil',
        '2 eggs, soft-boiled',
        '100g chashu pork, sliced',
        '2 green onions, sliced',
        '1 sheet nori, cut into strips',
        '50g bamboo shoots',
        '1 clove garlic, minced',
        '1 tsp ginger, minced',
        'Corn kernels',
        'Bean sprouts'
      ],
      instructions: `1. Prepare soft-boiled eggs: boil for 6-7 minutes, then ice bath. Peel when cool.

2. In a large pot, combine chicken and pork stock. Bring to a simmer.

3. Whisk miso paste with a little hot broth until smooth, then add back to pot.

4. Add soy sauce, sesame oil, garlic, and ginger. Simmer for 10 minutes.

5. Cook ramen noodles according to package instructions. Drain and divide between bowls.

6. Pour hot broth over noodles.

7. Top with halved soft-boiled eggs, chashu pork, green onions, nori, and bamboo shoots.

8. Add corn and bean sprouts as desired.

9. Serve immediately while hot.`,
      cookTime: 20,
      prepTime: 30,
      servings: 2,
      difficulty: Difficulty.MEDIUM,
      tags: ['japanese', 'ramen', 'noodles', 'broth', 'comfort-food'],
      cuisine: 'japanese',
      authorId: chefKenji.id,
      imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Mediterranean Quinoa Bowl',
      description: 'Healthy and colorful bowl with quinoa, fresh vegetables, and Mediterranean flavors.',
      ingredients: [
        '200g quinoa',
        '1 cucumber, diced',
        '2 tomatoes, diced',
        '1/2 red onion, thinly sliced',
        '100g kalamata olives',
        '200g feta cheese, crumbled',
        '1/4 cup olive oil',
        '2 tbsp lemon juice',
        '1 tsp dried oregano',
        '2 cloves garlic, minced',
        'Fresh parsley',
        'Fresh mint',
        'Chickpeas (optional)',
        'Salt and pepper'
      ],
      instructions: `1. Cook quinoa according to package instructions. Let cool completely.

2. In a large bowl, combine cooked quinoa, diced cucumber, tomatoes, and red onion.

3. Add kalamata olives and crumbled feta cheese.

4. For dressing: whisk olive oil, lemon juice, oregano, minced garlic, salt, and pepper.

5. Pour dressing over quinoa mixture and toss well.

6. Add fresh parsley and mint, toss again.

7. Add chickpeas if using for extra protein.

8. Let marinate for at least 30 minutes before serving.

9. Serve chilled or at room temperature.`,
      cookTime: 15,
      prepTime: 20,
      servings: 4,
      difficulty: Difficulty.EASY,
      tags: ['mediterranean', 'quinoa', 'healthy', 'vegetarian', 'fresh'],
      cuisine: 'mediterranean',
      authorId: homeChef.id,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Chocolate Lava Cake',
      description: 'Decadent individual chocolate cakes with molten centers, perfect for special occasions.',
      ingredients: [
        '200g dark chocolate (70% cocoa)',
        '100g butter',
        '2 large eggs',
        '2 large egg yolks',
        '60g granulated sugar',
        '2 tbsp all-purpose flour',
        'Pinch of salt',
        'Butter for ramekins',
        'Cocoa powder for dusting',
        'Vanilla ice cream',
        'Fresh berries',
        'Powdered sugar'
      ],
      instructions: `1. Preheat oven to 425°F (220°C). Butter 4 ramekins and dust with cocoa powder.

2. Melt chocolate and butter in a double boiler, stirring until smooth.

3. In a bowl, whisk whole eggs, egg yolks, and sugar until thick and pale.

4. Slowly whisk in the melted chocolate mixture.

5. Fold in flour and salt until just combined.

6. Divide batter evenly among prepared ramekins.

7. Bake for 12-14 minutes until edges are firm but centers still jiggle slightly.

8. Let cool for 1 minute, then run a knife around edges to loosen.

9. Invert onto serving plates and let sit for 10 seconds before lifting ramekins.

10. Dust with powdered sugar and serve immediately with vanilla ice cream and fresh berries.`,
      cookTime: 14,
      prepTime: 20,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      tags: ['dessert', 'chocolate', 'molten', 'special-occasion', 'individual'],
      cuisine: 'french',
      authorId: chefPierre.id,
      imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Thai Green Curry',
      description: 'Aromatic and spicy Thai curry with coconut milk, vegetables, and fresh herbs.',
      ingredients: [
        '400ml coconut milk',
        '2 tbsp green curry paste',
        '300g chicken breast, sliced',
        '1 Thai eggplant, cubed',
        '100g green beans, trimmed',
        '1 red bell pepper, sliced',
        '2 kaffir lime leaves',
        '1 tbsp fish sauce',
        '1 tbsp palm sugar',
        'Thai basil leaves',
        '1 red chili, sliced',
        'Jasmine rice',
        'Lime wedges'
      ],
      instructions: `1. Heat 1/2 cup of coconut milk in a wok over medium heat until it starts to separate.

2. Add green curry paste and fry for 1-2 minutes until fragrant.

3. Add chicken and cook until nearly done, about 5 minutes.

4. Add remaining coconut milk, eggplant, green beans, and bell pepper.

5. Add kaffir lime leaves, fish sauce, and palm sugar.

6. Simmer for 10-15 minutes until vegetables are tender.

7. Stir in Thai basil leaves and sliced chili.

8. Serve over jasmine rice with lime wedges.`,
      cookTime: 25,
      prepTime: 15,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      tags: ['thai', 'curry', 'coconut', 'spicy', 'chicken'],
      cuisine: 'thai',
      authorId: chefKenji.id,
      imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Homemade Pasta Carbonara',
      description: 'Classic Roman pasta dish with eggs, cheese, pancetta, and black pepper.',
      ingredients: [
        '400g spaghetti',
        '150g pancetta, diced',
        '3 large eggs',
        '100g Pecorino Romano, grated',
        '50g Parmesan, grated',
        '2 cloves garlic, minced',
        'Freshly ground black pepper',
        '2 tbsp olive oil',
        'Salt for pasta water'
      ],
      instructions: `1. Bring a large pot of salted water to boil. Cook spaghetti until al dente.

2. While pasta cooks, heat olive oil in a large skillet over medium heat.

3. Add pancetta and cook until crispy, about 5-7 minutes.

4. Add minced garlic and cook for 1 minute.

5. In a bowl, whisk eggs with grated cheeses and lots of black pepper.

6. Reserve 1 cup pasta water, then drain pasta.

7. Add hot pasta to the skillet with pancetta.

8. Remove from heat and quickly toss with egg mixture, adding pasta water gradually.

9. Keep tossing until creamy sauce forms (eggs should not scramble).

10. Serve immediately with extra cheese and black pepper.`,
      cookTime: 15,
      prepTime: 10,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      tags: ['italian', 'pasta', 'eggs', 'pancetta', 'classic'],
      cuisine: 'italian',
      authorId: chefMaria.id,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&auto=format&fit=crop&q=60',
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
      authorId: homeChef.id,
      imageUrl: 'https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Sushi Rolls (California Roll)',
      description: 'Fresh sushi rolls with crab, avocado, and cucumber, perfect for beginners.',
      ingredients: [
        '200g sushi rice',
        '4 sheets nori (seaweed)',
        '200g imitation crab meat',
        '1 avocado, sliced',
        '1 cucumber, julienned',
        '2 tbsp rice vinegar',
        '1 tbsp sugar',
        '1 tsp salt',
        'Sesame seeds',
        'Soy sauce',
        'Wasabi',
        'Pickled ginger'
      ],
      instructions: `1. Cook sushi rice according to package instructions. Let cool slightly.

2. Mix rice vinegar, sugar, and salt. Gently fold into warm rice.

3. Place nori sheet on bamboo mat, shiny side down.

4. Spread rice evenly over nori, leaving 1-inch border at top.

5. Arrange crab, avocado, and cucumber in a line across the center.

6. Using the mat, roll tightly from bottom to top, wetting the border to seal.

7. Roll in sesame seeds if desired.

8. Using a sharp knife, cut into 8 pieces, wiping blade between cuts.

9. Serve with soy sauce, wasabi, and pickled ginger.`,
      cookTime: 30,
      prepTime: 45,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      tags: ['japanese', 'sushi', 'seafood', 'fresh', 'healthy'],
      cuisine: 'japanese',
      authorId: chefKenji.id,
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Shakshuka',
      description: 'Middle Eastern dish of eggs poached in spiced tomato sauce, perfect for brunch.',
      ingredients: [
        '2 tbsp olive oil',
        '1 large onion, diced',
        '1 red bell pepper, diced',
        '4 cloves garlic, minced',
        '1 tsp ground cumin',
        '1 tsp paprika',
        '1/4 tsp cayenne pepper',
        '400g canned crushed tomatoes',
        '1/2 tsp salt',
        '1/4 tsp black pepper',
        '6 eggs',
        '100g feta cheese, crumbled',
        'Fresh parsley',
        'Crusty bread'
      ],
      instructions: `1. Heat olive oil in a large skillet over medium heat.

2. Add diced onion and bell pepper, cook until softened, about 5 minutes.

3. Add garlic, cumin, paprika, and cayenne. Cook for 1 minute.

4. Add crushed tomatoes, salt, and pepper. Simmer for 10-15 minutes until thickened.

5. Make wells in the sauce and crack eggs into each well.

6. Cover and cook for 10-12 minutes until egg whites are set but yolks are still runny.

7. Sprinkle with crumbled feta and fresh parsley.

8. Serve directly from the skillet with crusty bread.`,
      cookTime: 30,
      prepTime: 15,
      servings: 3,
      difficulty: Difficulty.EASY,
      tags: ['middle-eastern', 'eggs', 'tomato', 'brunch', 'vegetarian'],
      cuisine: 'middle-eastern',
      authorId: chefAisha.id,
      imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Beef Stir Fry',
      description: 'Quick and flavorful beef stir fry with vegetables in a savory sauce.',
      ingredients: [
        '500g beef sirloin, sliced thin',
        '2 tbsp cornstarch',
        '3 tbsp soy sauce',
        '2 tbsp oyster sauce',
        '1 tbsp rice wine',
        '1 tsp sesame oil',
        '2 tbsp vegetable oil',
        '2 cloves garlic, minced',
        '1 inch ginger, minced',
        '1 bell pepper, sliced',
        '1 cup snap peas',
        '1 carrot, julienned',
        'Green onions',
        'Steamed rice'
      ],
      instructions: `1. Toss beef with cornstarch and 1 tbsp soy sauce. Let marinate 15 minutes.

2. Mix remaining soy sauce, oyster sauce, rice wine, and sesame oil for sauce.

3. Heat 1 tbsp oil in wok over high heat. Stir-fry beef until just cooked, about 2 minutes.

4. Remove beef and set aside.

5. Add remaining oil to wok. Add garlic and ginger, stir-fry 30 seconds.

6. Add bell pepper, snap peas, and carrot. Stir-fry for 2-3 minutes.

7. Return beef to wok, add sauce, and toss everything together.

8. Cook for 1 minute until sauce thickens.

9. Garnish with green onions and serve over steamed rice.`,
      cookTime: 10,
      prepTime: 20,
      servings: 4,
      difficulty: Difficulty.EASY,
      tags: ['chinese', 'beef', 'stir-fry', 'quick', 'vegetables'],
      cuisine: 'chinese',
      authorId: chefKenji.id,
      imageUrl: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Banana Bread',
      description: 'Moist and delicious homemade banana bread, perfect for breakfast or snacking.',
      ingredients: [
        '3 ripe bananas, mashed',
        '80g melted butter',
        '75g sugar',
        '1 egg, beaten',
        '1 tsp vanilla extract',
        '1 tsp baking soda',
        'Pinch of salt',
        '190g all-purpose flour',
        '100g walnuts, chopped (optional)'
      ],
      instructions: `1. Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.

2. In a large bowl, mash bananas with melted butter.

3. Mix in sugar, beaten egg, and vanilla extract.

4. Add baking soda and salt, mix well.

5. Add flour and stir until just combined. Don't overmix.

6. Fold in walnuts if using.

7. Pour batter into prepared loaf pan.

8. Bake for 60-65 minutes until a toothpick inserted in center comes out clean.

9. Cool in pan for 10 minutes, then turn out onto wire rack.

10. Slice and serve when completely cool.`,
      cookTime: 65,
      prepTime: 15,
      servings: 8,
      difficulty: Difficulty.EASY,
      tags: ['dessert', 'banana', 'bread', 'baking', 'sweet'],
      cuisine: 'american',
      authorId: homeChef.id,
      imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&auto=format&fit=crop&q=60',
    }
  ]

  // Create recipes
  console.log('🍳 Creating comprehensive sample recipes...')
  const createdRecipes = []
  
  for (const recipe of recipes) {
    // Check if recipe already exists by title
    const existingRecipe = await prisma.recipe.findFirst({
      where: { title: recipe.title }
    })
    
    if (!existingRecipe) {
      const newRecipe = await prisma.recipe.create({
        data: recipe,
      })
      createdRecipes.push(newRecipe)
      console.log(`   ✓ Created recipe: ${recipe.title}`)
    } else {
      // Update existing recipe with new data
      const updatedRecipe = await prisma.recipe.update({
        where: { id: existingRecipe.id },
        data: {
          imageUrl: recipe.imageUrl,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cookTime: recipe.cookTime,
          prepTime: recipe.prepTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          tags: recipe.tags,
          cuisine: recipe.cuisine
        }
      })
      createdRecipes.push(updatedRecipe)
      console.log(`   ✓ Updated recipe: ${recipe.title}`)
    }
  }

  // Create favorites to showcase the favorites feature
  console.log('❤️ Creating sample favorites...')
  const allRecipes = await prisma.recipe.findMany()
  
  // Demo user favorites - variety of cuisines
  const demoUserFavorites = [
    allRecipes.find(r => r.title === 'Classic Margherita Pizza'),
    allRecipes.find(r => r.title === 'Chocolate Lava Cake'),
    allRecipes.find(r => r.title === 'Authentic Butter Chicken'),
    allRecipes.find(r => r.title === 'Korean Bulgogi'),
    allRecipes.find(r => r.title === 'Mediterranean Quinoa Bowl'),
  ].filter(Boolean)

  for (const recipe of demoUserFavorites) {
    if (recipe) {
      await prisma.userFavorite.upsert({
        where: {
          userId_recipeId: {
            userId: demoUser.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: demoUser.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Chef Maria's favorites - Italian and French focus
  const mariaFavorites = [
    allRecipes.find(r => r.title === 'Coq au Vin'),
    allRecipes.find(r => r.title === 'Beef Wellington'),
    allRecipes.find(r => r.title === 'Homemade Pasta Carbonara'),
    allRecipes.find(r => r.title === 'French Onion Soup'),
  ].filter(Boolean)

  for (const recipe of mariaFavorites) {
    if (recipe) {
      await prisma.userFavorite.upsert({
        where: {
          userId_recipeId: {
            userId: chefMaria.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: chefMaria.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Chef Kenji's favorites - Asian focus
  const kenjiFavorites = [
    allRecipes.find(r => r.title === 'Authentic Chicken Pad Thai'),
    allRecipes.find(r => r.title === 'Homemade Ramen'),
    allRecipes.find(r => r.title === 'Thai Green Curry'),
    allRecipes.find(r => r.title === 'Sushi Rolls (California Roll)'),
  ].filter(Boolean)

  for (const recipe of kenjiFavorites) {
    if (recipe) {
      await prisma.userFavorite.upsert({
        where: {
          userId_recipeId: {
            userId: chefKenji.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: chefKenji.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Chef Aisha's favorites - Spicy and exotic
  const aishaFavorites = [
    allRecipes.find(r => r.title === 'Moroccan Tagine'),
    allRecipes.find(r => r.title === 'Shakshuka'),
    allRecipes.find(r => r.title === 'Thai Green Curry'),
  ].filter(Boolean)

  for (const recipe of aishaFavorites) {
    if (recipe) {
      await prisma.userFavorite.upsert({
        where: {
          userId_recipeId: {
            userId: chefAisha.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: chefAisha.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Home chef's favorites - Easy and comfort food
  const homeFavorites = [
    allRecipes.find(r => r.title === 'BBQ Pulled Pork Sandwiches'),
    allRecipes.find(r => r.title === 'Banana Bread'),
    allRecipes.find(r => r.title === 'Mediterranean Quinoa Bowl'),
    allRecipes.find(r => r.title === 'Beef Stir Fry'),
  ].filter(Boolean)

  for (const recipe of homeFavorites) {
    if (recipe) {
      await prisma.userFavorite.upsert({
        where: {
          userId_recipeId: {
            userId: homeChef.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: homeChef.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Create bookmarks to showcase the bookmarks feature
  console.log('📑 Creating sample bookmarks...')
  
  // Demo user bookmarks - different from favorites to show the distinction
  const demoUserBookmarks = [
    allRecipes.find(r => r.title === 'Beef Wellington'),
    allRecipes.find(r => r.title === 'Homemade Ramen'),
    allRecipes.find(r => r.title === 'Thai Green Curry'),
    allRecipes.find(r => r.title === 'Authentic Butter Chicken'),
    allRecipes.find(r => r.title === 'Mexican Street Tacos'),
    allRecipes.find(r => r.title === 'Coq au Vin'),
  ].filter(Boolean)

  for (const recipe of demoUserBookmarks) {
    if (recipe) {
      await prisma.userBookmark.upsert({
        where: {
          userId_recipeId: {
            userId: demoUser.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: demoUser.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Chef Maria's bookmarks - European cuisine focus
  const mariaBookmarks = [
    allRecipes.find(r => r.title === 'Authentic Chicken Pad Thai'),
    allRecipes.find(r => r.title === 'Korean Bulgogi'),
    allRecipes.find(r => r.title === 'Chicken Tikka Masala'),
    allRecipes.find(r => r.title === 'Chocolate Lava Cake'),
  ].filter(Boolean)

  for (const recipe of mariaBookmarks) {
    if (recipe) {
      await prisma.userBookmark.upsert({
        where: {
          userId_recipeId: {
            userId: chefMaria.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: chefMaria.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Chef Kenji's bookmarks - Western cuisine exploration
  const kenjiBookmarks = [
    allRecipes.find(r => r.title === 'Classic Margherita Pizza'),
    allRecipes.find(r => r.title === 'Beef Wellington'),
    allRecipes.find(r => r.title === 'French Onion Soup'),
  ].filter(Boolean)

  for (const recipe of kenjiBookmarks) {
    if (recipe) {
      await prisma.userBookmark.upsert({
        where: {
          userId_recipeId: {
            userId: chefKenji.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: chefKenji.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Chef Aisha's bookmarks - International exploration
  const aishaBookmarks = [
    allRecipes.find(r => r.title === 'Authentic Chicken Pad Thai'),
    allRecipes.find(r => r.title === 'Korean Bulgogi'),
    allRecipes.find(r => r.title === 'Classic Margherita Pizza'),
    allRecipes.find(r => r.title === 'Homemade Ramen'),
  ].filter(Boolean)

  for (const recipe of aishaBookmarks) {
    if (recipe) {
      await prisma.userBookmark.upsert({
        where: {
          userId_recipeId: {
            userId: chefAisha.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: chefAisha.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Chef Pierre's bookmarks - Asian cuisine exploration
  const pierreBookmarks = [
    allRecipes.find(r => r.title === 'Homemade Ramen'),
    allRecipes.find(r => r.title === 'Korean Bulgogi'),
    allRecipes.find(r => r.title === 'Thai Green Curry'),
  ].filter(Boolean)

  for (const recipe of pierreBookmarks) {
    if (recipe) {
      await prisma.userBookmark.upsert({
        where: {
          userId_recipeId: {
            userId: chefPierre.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: chefPierre.id,
          recipeId: recipe.id
        }
      })
    }
  }

  // Home Chef's bookmarks - Restaurant-quality dishes to try
  const sarahBookmarks = [
    allRecipes.find(r => r.title === 'Beef Wellington'),
    allRecipes.find(r => r.title === 'Coq au Vin'),
    allRecipes.find(r => r.title === 'Chocolate Lava Cake'),
  ].filter(Boolean)

  for (const recipe of sarahBookmarks) {
    if (recipe) {
      await prisma.userBookmark.upsert({
        where: {
          userId_recipeId: {
            userId: homeChef.id,
            recipeId: recipe.id
          }
        },
        update: {},
        create: {
          userId: homeChef.id,
          recipeId: recipe.id
        }
      })
    }
  }

  console.log('✅ Enhanced database seeding completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - 6 demo users with diverse profiles`)
  console.log(`   - ${recipes.length} comprehensive sample recipes`)
  console.log(`   - Multiple favorites to showcase the feature`)
  console.log(`   - Multiple bookmarks to showcase the feature`)
  console.log(`   - Recipes covering ${new Set(recipes.map(r => r.cuisine)).size} different cuisines`)
  console.log(`   - Difficulty levels: ${new Set(recipes.map(r => r.difficulty)).size} types`)
  console.log(``)
  console.log(`🔑 Demo login credentials:`)
  console.log(`   Main Demo: demo@recipemanager.com / password123`)
  console.log(`   Chef Maria: maria@chef.com / password123`)
  console.log(`   Chef Kenji: kenji@culinary.com / password123`)
  console.log(`   Chef Aisha: aisha@spice.com / password123`)
  console.log(`   Chef Pierre: pierre@bistro.com / password123`)
  console.log(`   Home Chef: sarah@home.com / password123`)
  console.log(``)
  console.log(`🌟 Features showcased:`)
  console.log(`   - Diverse recipe collection`)
  console.log(`   - Multiple difficulty levels`)
  console.log(`   - Various cuisines and cooking styles`)
  console.log(`   - Favorites system with sample data`)
  console.log(`   - Bookmarks system with sample data`)
  console.log(`   - Multiple user profiles`)
  console.log(`   - Rich recipe metadata (tags, cuisine, timing)`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })