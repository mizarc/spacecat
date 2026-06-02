import { describe, it, expect } from 'vitest';
import { generateQrCode } from './qrcode.js';

describe('generateQrCode', () => {
  it('should return a Buffer', async () => {
    const result = await generateQrCode('https://example.com');
    expect(result).toBeInstanceOf(Buffer);
  });

  it('should produce a valid PNG', async () => {
    const result = await generateQrCode('https://example.com');
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    expect(result.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
  });

  it('should handle a plain text string', async () => {
    const result = await generateQrCode('Hello, world!');
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(100);
  });

  it('should handle a long URL', async () => {
    const longUrl =
      'https://example.com/search?q=this+is+a+very+long+url+' +
      'that+should+still+encode+properly+into+a+qr+code+1234567890';
    const result = await generateQrCode(longUrl);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(100);
  });

  it('should produce different buffers for different data', async () => {
    const [a, b] = await Promise.all([
      generateQrCode('data-A'),
      generateQrCode('data-B'),
    ]);
    expect(a.equals(b)).toBe(false);
  });

  it('should reject an empty string', async () => {
    await expect(generateQrCode('')).rejects.toThrow();
  });
});
