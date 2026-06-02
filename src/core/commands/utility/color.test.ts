import { describe, it, expect } from 'vitest';
import { generateColor } from './color.js';

describe('generateColor', () => {
  it('should parse a standard hex code', () => {
    const result = generateColor('FF5733');
    expect(result.info.hex).toBe('#FF5733');
    expect(result.info.rgb).toBe('255, 87, 51');
  });

  it('should handle hex with leading #', () => {
    const result = generateColor('#FF5733');
    expect(result.info.hex).toBe('#FF5733');
  });

  it('should handle lowercase hex', () => {
    const result = generateColor('ff5733');
    expect(result.info.hex).toBe('#FF5733');
  });

  it('should return correct RGB for black', () => {
    const result = generateColor('000000');
    expect(result.info.rgb).toBe('0, 0, 0');
  });

  it('should return correct RGB for white', () => {
    const result = generateColor('FFFFFF');
    expect(result.info.rgb).toBe('255, 255, 255');
  });

  it('should return correct HSL for red', () => {
    const result = generateColor('FF0000');
    expect(result.info.hsl).toBe('0°, 100%, 50%');
  });

  it('should return correct HSL for green', () => {
    const result = generateColor('00FF00');
    expect(result.info.hsl).toBe('120°, 100%, 50%');
  });

  it('should return correct HSL for blue', () => {
    const result = generateColor('0000FF');
    expect(result.info.hsl).toBe('240°, 100%, 50%');
  });

  it('should return correct CMYK for red', () => {
    const result = generateColor('FF0000');
    expect(result.info.cmyk).toBe('0%, 100%, 100%, 0%');
  });

  it('should format the output string correctly', () => {
    const result = generateColor('FF5733');
    expect(result.formatted).toContain('#FF5733');
    expect(result.formatted).toContain('RGB');
    expect(result.formatted).toContain('HSL');
    expect(result.formatted).toContain('CMYK');
  });

  it('should throw on invalid hex', () => {
    expect(() => generateColor('XYZ123')).toThrow();
  });

  it('should throw on short hex', () => {
    expect(() => generateColor('FFF')).toThrow();
  });

  it('should throw on empty string', () => {
    expect(() => generateColor('')).toThrow();
  });
});
