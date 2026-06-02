import { describe, it, expect } from 'vitest';
import { timestamp } from './timestamp.js';

describe('timestamp', () => {
  it('should parse a standard date string', () => {
    const result = timestamp('2024-01-15');
    expect(result).toContain('<t:');
    expect(result).toContain(':f>');
    expect(result).not.toContain('❌');
  });

  it('should parse natural language dates', () => {
    const result = timestamp('tomorrow at 3pm');
    expect(result).toContain('<t:');
    expect(result).not.toContain('❌');
  });

  it('should include all 7 format styles', () => {
    const result = timestamp('2024-06-15');
    for (const style of ['t', 'T', 'd', 'D', 'f', 'F', 'R']) {
      expect(result).toContain(`:${style}>`);
    }
  });

  it('should include format labels', () => {
    const result = timestamp('2024-06-15');
    expect(result).toContain('Short Time');
    expect(result).toContain('Long Time');
    expect(result).toContain('Short Date');
    expect(result).toContain('Long Date');
    expect(result).toContain('Short Date/Time');
    expect(result).toContain('Long Date/Time');
    expect(result).toContain('Relative Time');
  });

  it('should show the rendered timestamp for each format', () => {
    const result = timestamp('2024-01-15');
    // Each line should have the `->` separator between code and rendered output
    const lines = result.split('\n');
    expect(lines.length).toBe(7);
    for (const line of lines) {
      expect(line).toContain('->');
    }
  });

  it('should return an error for unparseable input', () => {
    const result = timestamp('not-a-date-at-all');
    expect(result).toContain('❌');
  });

  it('should return an error for empty string', () => {
    const result = timestamp('');
    expect(result).toContain('❌');
  });

  it('should produce valid Unix timestamp numbers', () => {
    const result = timestamp('2024-01-15');
    // Extract the Unix timestamp from a <t:NUM:f> pattern
    const match = result.match(/<t:(\d+):f>/);
    expect(match).not.toBeNull();
    const unixTime = Number(match![1]);
    // Should be a reasonable 2024 timestamp (between Jan 1 and Feb 1 2024)
    expect(unixTime).toBeGreaterThan(1704067200);  // Jan 1 2024
    expect(unixTime).toBeLessThan(1706745600);     // Feb 1 2024
  });
});
