import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError, z } from 'zod';
import { handleError, isError, isZodError } from './handle-error.js';

// Mock console.error to avoid test logs
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('handle-error', () => {
  let req: Request;
  let res: Response;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonMock = vi.fn().mockReturnThis();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    req = {
      path: '/test-path',
      method: 'GET',
    } as unknown as Request;

    res = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
  });

  describe('isZodError', () => {
    it('should return true for ZodError instances', () => {
      const schema = z.string();
      let error;
      try {
        schema.parse(123);
      } catch (e) {
        error = e;
      }
      expect(isZodError(error)).toBe(true);
    });

    it('should return false for non-ZodError instances', () => {
      expect(isZodError(new Error('regular error'))).toBe(false);
      expect(isZodError(null)).toBe(false);
      expect(isZodError(undefined)).toBe(false);
      expect(isZodError('string error')).toBe(false);
    });
  });

  describe('isError', () => {
    it('should return true for Error instances', () => {
      expect(isError(new Error('test error'))).toBe(true);
      expect(isError(new TypeError('type error'))).toBe(true);
    });

    it('should return false for non-Error instances', () => {
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
      expect(isError('string error')).toBe(false);
      expect(isError(123)).toBe(false);
      expect(isError({})).toBe(false);
    });
  });

  describe('handleError', () => {
    it('should throw an error if request path is not defined', () => {
      const reqWithoutPath = { method: 'GET' } as unknown as Request;

      expect(() => {
        handleError(reqWithoutPath, res, new Error('test error'));
      }).toThrow('Request route is not defined');
    });

    it('should handle ZodError with formatted validation errors', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().positive(),
      });

      let zodError: ZodError | undefined;

      try {
        schema.parse({ name: 123, age: -1 });
      } catch (e) {
        zodError = e as ZodError;
      }

      if (!zodError) {
        throw new Error('Expected ZodError to be thrown');
      }

      handleError(req, res, zodError);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: expect.any(Array),
            message: expect.any(String),
          }),
        ]),
      });
    });

    it('should handle standard Error objects', () => {
      const error = new Error('test error message');

      handleError(req, res, error);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'test error message',
        code: 'INTERNAL_SERVER_ERROR',
      });
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle unknown error types', () => {
      handleError(req, res, 'string error');

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Unknown error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    });
  });
});
