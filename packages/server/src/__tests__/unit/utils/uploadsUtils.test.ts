import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import sharp from 'sharp';
import * as middleware from '../../../routes/uploads/middleware';
import * as logger from '../../../utils/logger';
import { processImage, cleanupFile, cleanupFiles } from '../../../routes/uploads/utils';

vi.mock('fs', () => {
  const mockUnlinkSync = vi.fn();
  const mockExistsSync = vi.fn();
  const mockMkdirSync = vi.fn();
  return {
    unlinkSync: mockUnlinkSync,
    existsSync: mockExistsSync,
    mkdirSync: mockMkdirSync,
    default: {
      unlinkSync: mockUnlinkSync,
      existsSync: mockExistsSync,
      mkdirSync: mockMkdirSync,
    },
    __mockUnlinkSync: mockUnlinkSync,
    __mockExistsSync: mockExistsSync,
    __mockMkdirSync: mockMkdirSync,
  };
});


describe('uploads/utils', () => {
  const uploadDir = '/mock/uploads';
  const file = {
    path: '/mock/uploads/file.png',
    filename: 'file.png',
    originalname: 'original.png',
    size: 1234,
    mimetype: 'image/png',
  } as Express.Multer.File;

  let fs: any;

  beforeEach(async () => {
    vi.spyOn(middleware, 'uploadDir', 'get').mockReturnValue(uploadDir);
    fs = await import('fs');
    fs.__mockUnlinkSync.mockReset();
    fs.__mockExistsSync.mockReset();
    fs.__mockMkdirSync.mockReset();
    vi.spyOn(logger.default, 'error').mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('processImage', () => {
    it('should process and optimize image, remove original, and return ProcessedFile', async () => {
      const toFile = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(sharp.prototype, 'resize').mockReturnThis();
      vi.spyOn(sharp.prototype, 'jpeg').mockReturnThis();
      vi.spyOn(sharp.prototype, 'toFile').mockImplementation(toFile);
      const result = await processImage(file);
      expect(toFile).toHaveBeenCalledWith(path.join(uploadDir, 'optimized-file.png'));
      expect(fs.__mockUnlinkSync).toHaveBeenCalledWith(file.path);
      expect(result).toEqual({
        url: '/uploads/optimized-file.png',
        filename: 'optimized-file.png',
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      });
    });
  });

  describe('cleanupFile', () => {
    it('should remove file if it exists', async () => {
      fs.__mockExistsSync.mockReturnValue(true);
      cleanupFile('/mock/path/file.png');
      expect(fs.__mockExistsSync).toHaveBeenCalledWith('/mock/path/file.png');
      expect(fs.__mockUnlinkSync).toHaveBeenCalledWith('/mock/path/file.png');
    });
    it('should not remove file if it does not exist', async () => {
      fs.__mockExistsSync.mockReturnValue(false);
      cleanupFile('/mock/path/none.png');
      expect(fs.__mockExistsSync).toHaveBeenCalledWith('/mock/path/none.png');
      expect(fs.__mockUnlinkSync).not.toHaveBeenCalledWith('/mock/path/none.png');
    });
    it('should log error if unlinkSync throws', async () => {
      fs.__mockExistsSync.mockReturnValue(true);
      fs.__mockUnlinkSync.mockImplementationOnce(() => { throw new Error('fail'); });
      cleanupFile('/mock/path/error.png');
      expect(logger.default.error).toHaveBeenCalled();
    });
  });

  describe('cleanupFiles', () => {
    it('should call cleanupFile for each file', async () => {
      const files = [
        { path: '/mock/path/1.png' },
        { path: '/mock/path/2.png' },
      ] as Express.Multer.File[];
      fs.__mockExistsSync.mockReturnValue(true);
      cleanupFiles(files);
      // fs.__mockUnlinkSync should be called for each file
      expect(fs.__mockUnlinkSync).toHaveBeenCalledTimes(2);
      expect(fs.__mockUnlinkSync).toHaveBeenCalledWith('/mock/path/1.png');
      expect(fs.__mockUnlinkSync).toHaveBeenCalledWith('/mock/path/2.png');
    });
  });
}); 