import { http, HttpResponse } from 'msw';
import { 
  User, 
  Recipe, 
  HTTP_STATUS, 
  API_ENDPOINTS, 
  PAGINATION_DEFAULTS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  CLIENT_CONFIG
} from '@recipe-manager/shared';

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
  popularRecipes: mockRecipes.slice(0, CLIENT_CONFIG.POPULAR_ITEMS_LIMIT),
};

// API handlers
export const handlers = [
  // Auth endpoints
  http.post(API_ENDPOINTS.AUTH.LOGIN, async ({ request }) => {
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
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS
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

  http.post(API_ENDPOINTS.AUTH.REGISTER, async ({ request }) => {
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
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS
    });
  }),

  http.post(API_ENDPOINTS.AUTH.LOGOUT, () => {
    return HttpResponse.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  }),

  http.get(API_ENDPOINTS.AUTH.PROFILE, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: mockUser,
    });
  }),

  // User endpoints
  http.get(API_ENDPOINTS.USERS.MY_STATS, () => {
    return HttpResponse.json({
      success: true,
      data: mockUserStats,
    });
  }),

  http.put(API_ENDPOINTS.USERS.PROFILE, async ({ request }) => {
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

  http.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, async ({ request }) => {
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
  http.get(API_ENDPOINTS.RECIPES.LIST, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || String(PAGINATION_DEFAULTS.PAGE));
    const limit = parseInt(url.searchParams.get('limit') || String(PAGINATION_DEFAULTS.LIMIT));
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

  http.get(API_ENDPOINTS.RECIPES.DETAIL, ({ params }) => {
    const id = params.id as string;
    const recipe = mockRecipes.find(r => r.id === id);
    
    if (!recipe) {
      return HttpResponse.json(
        { success: false, error: ERROR_MESSAGES.RECIPE_NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: recipe,
    });
  }),

  http.post(API_ENDPOINTS.RECIPES.CREATE, async ({ request }) => {
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

  http.put(API_ENDPOINTS.RECIPES.UPDATE, async ({ params, request }) => {
    const id = params.id as string;
    const body = await request.json() as Partial<Recipe>;
    
    const recipe = mockRecipes.find(r => r.id === id);
    
    if (!recipe) {
      return HttpResponse.json(
        { success: false, error: ERROR_MESSAGES.RECIPE_NOT_FOUND },
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

  http.delete(API_ENDPOINTS.RECIPES.DELETE, ({ params }) => {
    const id = params.id as string;
    const recipe = mockRecipes.find(r => r.id === id);
    
    if (!recipe) {
      return HttpResponse.json(
        { success: false, error: ERROR_MESSAGES.RECIPE_NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: { message: SUCCESS_MESSAGES.RECIPE_DELETED },
    });
  }),

  // User recipes
  http.get(API_ENDPOINTS.USERS.USER_RECIPES, ({ params, request }) => {
    const userId = params.userId as string;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || String(PAGINATION_DEFAULTS.LIMIT));
    
    const userRecipes = mockRecipes.filter(recipe => recipe.user_id === userId);
    const limitedRecipes = userRecipes.slice(0, limit);
    
    return HttpResponse.json({
      success: true,
      data: {
        recipes: limitedRecipes,
        pagination: {
          page: PAGINATION_DEFAULTS.PAGE,
          limit,
          total: userRecipes.length,
          pages: Math.ceil(userRecipes.length / limit),
        },
      },
    });
  }),

  // Upload endpoint (mock)
  http.post(API_ENDPOINTS.UPLOAD.IMAGE, async ({ request }) => {
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
      { success: false, error: ERROR_MESSAGES.NOT_FOUND },
      { status: HTTP_STATUS.NOT_FOUND }
    );
  }),
]; 