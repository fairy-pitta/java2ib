/**
 * Tests for the main converter functionality
 */

import { JavaToIBConverter } from '../src/converter';

describe('JavaToIBConverter', () => {
  let converter: JavaToIBConverter;

  beforeEach(() => {
    converter = new JavaToIBConverter();
  });

  test('should create converter instance', () => {
    expect(converter).toBeInstanceOf(JavaToIBConverter);
  });

  test('should have convert method', () => {
    expect(typeof converter.convert).toBe('function');
  });

  test('should return conversion result structure', () => {
    const result = converter.convert('int x = 5;');
    
    expect(result).toHaveProperty('pseudocode');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('warnings');
    expect(result).toHaveProperty('metadata');
  });
});