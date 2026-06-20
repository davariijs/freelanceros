import { test, expect } from '@playwright/test';

test.describe('Health Check', () => {
  test('should return 200 status for /health', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
  });
});
