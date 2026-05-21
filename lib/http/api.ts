import { ZodError } from 'zod';
import { NextResponse } from 'next/server';
import { logError, logWarn } from '@/lib/logger';

export class AtlasApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function apiError(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        details
      }
    },
    { status }
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof AtlasApiError) {
    logWarn('api_error', error.message, {
      status: error.status,
      code: error.code,
      details: error.details
    });
    return apiError(error.status, error.code, error.message, error.details);
  }

  if (error instanceof ZodError) {
    logWarn('api_validation_error', 'Validation error', {
      issues: error.issues
    });
    return apiError(400, 'validation_error', 'Validation error', error.issues);
  }

  logError('api_internal_error', error instanceof Error ? error.message : 'Unexpected server error', {
    error: error instanceof Error ? { name: error.name, stack: error.stack } : error
  });
  return apiError(500, 'internal_error', 'Unexpected server error');
}
