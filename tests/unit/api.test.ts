import { describe, expect, it } from 'vitest';
import { AtlasApiError } from '../../lib/http/api';
import { handleApiError } from '../../lib/http/api';

describe('api helpers', () => {
  it('serializes AtlasApiError consistently', async () => {
    const response = handleApiError(new AtlasApiError(403, 'forbidden', 'Blocked'));
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('forbidden');
    expect(body.error.message).toBe('Blocked');
  });
});
