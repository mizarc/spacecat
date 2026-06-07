import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getIssData } from './iss.js';

describe('getIssData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return ISS position and crew data', async () => {
    const mockPosResponse = {
      ok: true,
      json: async () => ({
        message: 'success',
        timestamp: 1717000000,
        iss_position: { latitude: '51.5000', longitude: '-0.1000' },
      }),
    };

    const mockAstrosResponse = {
      ok: true,
      json: async () => ({
        message: 'success',
        number: 3,
        people: [
          { name: 'Oleg Kononenko', craft: 'ISS' },
          { name: 'Nikolai Chub', craft: 'ISS' },
          { name: 'Tracy Caldwell Dyson', craft: 'ISS' },
        ],
      }),
    };

    global.fetch = vi.fn()
      .mockResolvedValueOnce(mockPosResponse)
      .mockResolvedValueOnce(mockAstrosResponse);

    const result = await getIssData();

    expect(result.lat).toBe('51.5000');
    expect(result.lon).toBe('-0.1000');
    expect(result.crewCount).toBe(3);
    expect(result.crewNames).toContain('Oleg Kononenko');
    expect(result.mapsUrl).toContain('51.5000');
    expect(result.timestamp).toBe(1717000000);
  });

  it('should only count people on ISS', async () => {
    const mockPosResponse = {
      ok: true,
      json: async () => ({
        message: 'success',
        timestamp: 1717000000,
        iss_position: { latitude: '0', longitude: '0' },
      }),
    };

    const mockAstrosResponse = {
      ok: true,
      json: async () => ({
        message: 'success',
        number: 5,
        people: [
          { name: 'Person A', craft: 'ISS' },
          { name: 'Person B', craft: 'ISS' },
          { name: 'Person C', craft: 'Tiangong' },
          { name: 'Person D', craft: 'Tiangong' },
          { name: 'Person E', craft: 'ISS' },
        ],
      }),
    };

    global.fetch = vi.fn()
      .mockResolvedValueOnce(mockPosResponse)
      .mockResolvedValueOnce(mockAstrosResponse);

    const result = await getIssData();

    expect(result.crewCount).toBe(3);
    expect(result.crewNames).toEqual(['Person A', 'Person B', 'Person E']);
  });

  it('should throw on position API failure', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(getIssData()).rejects.toThrow(
      'ISS position request failed: 500'
    );
  });

  it('should throw on unsuccessful position message', async () => {
    const mockPosResponse = {
      ok: true,
      json: async () => ({
        message: 'failure',
        iss_position: { latitude: '0', longitude: '0' },
      }),
    };

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(mockPosResponse);

    await expect(getIssData()).rejects.toThrow(
      'Failed to retrieve ISS position.'
    );
  });

  it('should return position even when crew API fails', async () => {
    const mockPosResponse = {
      ok: true,
      json: async () => ({
        message: 'success',
        timestamp: 1717000000,
        iss_position: { latitude: '10.0000', longitude: '20.0000' },
      }),
    };

    global.fetch = vi.fn()
      .mockResolvedValueOnce(mockPosResponse)
      .mockRejectedValueOnce(new Error('Crew API timed out'));

    const result = await getIssData();

    expect(result.lat).toBe('10.0000');
    expect(result.lon).toBe('20.0000');
    expect(result.crewCount).toBe(0);
    expect(result.crewNames).toEqual([]);
  });

  it('should handle empty crew gracefully', async () => {
    const mockPosResponse = {
      ok: true,
      json: async () => ({
        message: 'success',
        timestamp: 1717000000,
        iss_position: { latitude: '10.0000', longitude: '20.0000' },
      }),
    };

    const mockAstrosResponse = {
      ok: true,
      json: async () => ({
        message: 'success',
        number: 0,
        people: [],
      }),
    };

    global.fetch = vi.fn()
      .mockResolvedValueOnce(mockPosResponse)
      .mockResolvedValueOnce(mockAstrosResponse);

    const result = await getIssData();

    expect(result.crewCount).toBe(0);
    expect(result.crewNames).toEqual([]);
  });
});
