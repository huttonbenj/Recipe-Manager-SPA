import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadService } from '../../../services/upload/uploadService';
import { API_ENDPOINTS } from '@recipe-manager/shared';

vi.mock('../../../services/base', () => {
  return {
    axiosInstance: {
      post: vi.fn(),
      delete: vi.fn(),
    },
    BaseService: class {},
  };
});

describe('UploadService', () => {
  let file: File;
  let axiosInstance: any;
  beforeEach(async () => {
    file = new File(['dummy'], 'test.png', { type: 'image/png' });
    // Dynamically import the mocked axiosInstance for each test
    axiosInstance = (await import('../../../services/base')).axiosInstance;
    axiosInstance.post.mockReset();
    axiosInstance.delete.mockReset();
  });

  it('uploadImage: returns data on success', async () => {
    axiosInstance.post.mockResolvedValue({ data: { success: true, data: { url: 'url', filename: 'file' } } });
    const result = await uploadService.uploadImage(file);
    expect(result).toEqual({ url: 'url', filename: 'file' });
    expect(axiosInstance.post).toHaveBeenCalledWith(
      API_ENDPOINTS.UPLOAD.IMAGE,
      expect.any(FormData),
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('uploadImage: throws error on failure', async () => {
    axiosInstance.post.mockResolvedValue({ data: { success: false, error: 'fail' } });
    await expect(uploadService.uploadImage(file)).rejects.toThrow('fail');
  });

  it('uploadImage: throws generic error if no error message', async () => {
    axiosInstance.post.mockResolvedValue({ data: { success: false } });
    await expect(uploadService.uploadImage(file)).rejects.toThrow('Failed to upload image');
  });

  it('uploadImageWithProgress: returns data and calls onProgress', async () => {
    const onProgress = vi.fn();
    axiosInstance.post.mockImplementation((_url: any, _formData: any, config: any) => {
      config.onUploadProgress({ loaded: 50, total: 100 });
      return Promise.resolve({ data: { success: true, data: { url: 'url', filename: 'file' } } });
    });
    const result = await uploadService.uploadImageWithProgress(file, onProgress);
    expect(result).toEqual({ url: 'url', filename: 'file' });
    expect(onProgress).toHaveBeenCalledWith(50);
  });

  it('uploadImageWithProgress: does not call onProgress if not provided', async () => {
    axiosInstance.post.mockImplementation((_url: any, _formData: any, config: any) => {
      if (config.onUploadProgress) config.onUploadProgress({ loaded: 10, total: 20 });
      return Promise.resolve({ data: { success: true, data: { url: 'url', filename: 'file' } } });
    });
    const result = await uploadService.uploadImageWithProgress(file);
    expect(result).toEqual({ url: 'url', filename: 'file' });
  });

  it('uploadImageWithProgress: throws error on failure', async () => {
    axiosInstance.post.mockResolvedValue({ data: { success: false, error: 'fail' } });
    await expect(uploadService.uploadImageWithProgress(file)).rejects.toThrow('fail');
  });

  it('deleteImage: resolves on success', async () => {
    axiosInstance.delete.mockResolvedValue({ data: { success: true } });
    await expect(uploadService.deleteImage('file')).resolves.toBeUndefined();
    expect(axiosInstance.delete).toHaveBeenCalledWith(`${API_ENDPOINTS.UPLOAD.IMAGE}/file`);
  });

  it('deleteImage: throws error on failure', async () => {
    axiosInstance.delete.mockResolvedValue({ data: { success: false, error: 'fail' } });
    await expect(uploadService.deleteImage('file')).rejects.toThrow('fail');
  });

  it('deleteImage: throws generic error if no error message', async () => {
    axiosInstance.delete.mockResolvedValue({ data: { success: false } });
    await expect(uploadService.deleteImage('file')).rejects.toThrow('Failed to delete image');
  });
}); 