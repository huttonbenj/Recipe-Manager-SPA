import { http, HttpResponse } from 'msw';
import { User, Recipe, HTTP_STATUS } from '@recipe-manager/shared';

// Mock data
export const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  created_at: new Date('2023-01-01'),
  updated_at: new Date('2023-01-01'),
};

export const mockRecipe: Recipe = {
  id: 'recipe-1',
  user_id: 'user-1',
  title: 'Test Recipe',
  ingredients: 'Test ingredients',
  instructions: 'Test instructions',
  cook_time: 30,
  servings: 4,
  difficulty: 'Medium',
  category: 'Main Course',
  tags: 'test,recipe',
  image_url: 'https://example.com/image.jpg',
  created_at: new Date('2023-01-01'),
  updated_at: new Date('2023-01-01'),
};

export const mockRecipes: Recipe[] = [
  mockRecipe,
  {
    ...mockRecipe,
    id: 'recipe-2',
    title: 'Another Recipe',
    category: 'Dessert',
  },
];

export const mockUserStats = {
  totalRecipes: 10,
  totalLikes: 25,
  totalViews: 150,
  averageRating: 4.5,
  recipesCreatedThisMonth: 3,
  popularRecipes: mockRecipes.slice(0, 3),
};

// API handlers
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        success: true,
        data: {
          user: mockUser,
          tokens: {
            accessToken: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token'
          }
        },
        message: 'Login successful'
      });
    }
    
    return HttpResponse.json(
      {
        success: false,
        error: 'Invalid credentials',
      },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as { email: string; name: string; password: string };
    
    return HttpResponse.json({
      success: true,
              data: {
          user: {
            ...mockUser,
            email: body.email,
            name: body.name,
          },
          tokens: {
            accessToken: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token'
          }
        },
      message: 'Registration successful'
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: mockUser,
    });
  }),

  // User endpoints
  http.get('/api/users/stats', () => {
    return HttpResponse.json({
      success: true,
      data: mockUserStats,
    });
  }),

  http.put('/api/users/profile', async ({ request }) => {
    const body = await request.json() as Partial<User>;
    
    return HttpResponse.json({
      success: true,
      data: {
        ...mockUser,
        ...body,
        updated_at: new Date(),
      },
    });
  }),

  http.put('/api/users/password', async ({ request }) => {
    const body = await request.json() as { currentPassword: string; newPassword: string };
    
    if (body.currentPassword === 'password') {
      return HttpResponse.json({
        success: true,
        data: { message: 'Password updated successfully' },
      });
    }
    
    return HttpResponse.json(
      { success: false, error: 'Current password is incorrect' },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }),

  // Recipe endpoints
  http.get('/api/recipes', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search');
    const category = url.searchParams.get('category');
    
    let filteredRecipes = mockRecipes;
    
    if (search) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.category === category
      );
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedRecipes = filteredRecipes.slice(start, end);
    
    return HttpResponse.json({
      success: true,
      data: {
        recipes: paginatedRecipes,
        pagination: {
          page,
          limit,
          total: filteredRecipes.length,
          pages: Math.ceil(filteredRecipes.length / limit),
        },
      },
    });
  }),

  http.get('/api/recipes/:id', ({ params }) => {
    const id = params.id as string;
    const recipe = mockRecipes.find(r => r.id === id);
    
    if (!recipe) {
      return HttpResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: recipe,
    });
  }),

  http.post('/api/recipes', async ({ request }) => {
    const body = await request.json() as Partial<Recipe>;
    
    const newRecipe: Recipe = {
      ...mockRecipe,
      ...body,
      id: `recipe-${Date.now()}`,
      user_id: mockUser.id,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    return HttpResponse.json({
      success: true,
      data: newRecipe,
    });
  }),

  http.put('/api/recipes/:id', async ({ params, request }) => {
    const id = params.id as string;
    const body = await request.json() as Partial<Recipe>;
    
    const recipe = mockRecipes.find(r => r.id === id);
    
    if (!recipe) {
      return HttpResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    
    const updatedRecipe = {
      ...recipe,
      ...body,
      updated_at: new Date(),
    };
    
    return HttpResponse.json({
      success: true,
      data: updatedRecipe,
    });
  }),

  http.delete('/api/recipes/:id', ({ params }) => {
    const id = params.id as string;
    const recipe = mockRecipes.find(r => r.id === id);
    
    if (!recipe) {
      return HttpResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: { message: 'Recipe deleted successfully' },
    });
  }),

  // User recipes
  http.get('/api/users/:userId/recipes', ({ params, request }) => {
    const userId = params.userId as string;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const userRecipes = mockRecipes.filter(recipe => recipe.user_id === userId);
    const limitedRecipes = userRecipes.slice(0, limit);
    
    return HttpResponse.json({
      success: true,
      data: {
        recipes: limitedRecipes,
        pagination: {
          page: 1,
          limit,
          total: userRecipes.length,
          pages: Math.ceil(userRecipes.length / limit),
        },
      },
    });
  }),

  // Upload endpoint (mock)
  http.post('/api/upload', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return HttpResponse.json(
        { success: false, error: 'No file provided' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        url: `https://example.com/uploads/${file.name}`,
        filename: file.name,
      },
    });
  }),

  // Error handler for unhandled requests
  http.all('*', ({ request }) => {
    console.error(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json(
      { success: false, error: 'Not found' },
      { status: HTTP_STATUS.NOT_FOUND }
    );
  }),
]; 