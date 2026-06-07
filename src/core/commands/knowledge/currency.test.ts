import { describe, it, expect, beforeEach, vi } from 'vitest';
import { convertCurrency } from './currency.js';

describe('convertCurrency', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should convert USD to EUR', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        amount: 1,
        base: 'USD',
        date: '2024-01-01',
        rates: { EUR: 0.92 },
      }),
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await convertCurrency(100, 'USD', 'EUR');

    expect(result.amount).toBe(100);
    expect(result.from).toBe('USD');
    expect(result.to).toBe('EUR');
    expect(result.result).toBe(92);
    expect(result.rate).toBe(0.92);
  });

  it('should handle lowercase currency codes', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        amount: 1,
        base: 'usd',
        date: '2024-01-01',
        rates: { GBP: 0.79 },
      }),
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await convertCurrency(50, 'usd', 'gbp');

    expect(result.from).toBe('USD');
    expect(result.to).toBe('GBP');
    expect(result.result).toBe(39.5);
  });

  it('should round to 2 decimal places', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        amount: 1,
        base: 'USD',
        date: '2024-01-01',
        rates: { JPY: 149.1234 },
      }),
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await convertCurrency(10, 'USD', 'JPY');

    expect(result.result).toBe(1491.23);
  });

  it('should throw on API failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    await expect(convertCurrency(1, 'USD', 'EUR')).rejects.toThrow(
      'Currency request failed: 500'
    );
  });

  it('should throw on unsupported currency code', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        amount: 1,
        base: 'USD',
        date: '2024-01-01',
        rates: { EUR: 0.92 },
      }),
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(convertCurrency(1, 'USD', 'XYZ')).rejects.toThrow(
      'Unsupported currency code: XYZ'
    );
  });
});
