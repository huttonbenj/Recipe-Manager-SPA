import { RecipeService } from '../services/recipeService';
import { db } from '../config/database';
import { ApiError } from '../middleware/error';

describe('Additional branch coverage tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('updateRecipe should throw 404 ApiError when recipe not found', async () => {
    // Mock the DB client so no real query is executed
    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn()
    } as unknown as import('pg').PoolClient;

    jest.spyOn(db, 'getClient').mockResolvedValue(mockClient);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(RecipeService, 'getRecipeById').mockResolvedValueOnce(null as any);

    await expect(
      RecipeService.updateRecipe('non-existent-id', 'user-id', {})
    ).rejects.toEqual(expect.any(ApiError));

    // BEGIN should have been called, then ROLLBACK due to error
    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
  });

  it('Database.healthCheck should return false when query fails', async () => {
    // Force db.query to throw once
    const spy = jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('connection error'));

    const result = await db.healthCheck();
    expect(result).toBe(false);
    expect(spy).toHaveBeenCalled();
  });
}); 