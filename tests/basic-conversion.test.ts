import { describe, it, expect } from 'vitest';
import { convertJavaToIB } from '../src/index';

describe('Basic Java to IB Conversion', () => {
  describe('Variable Declarations and Assignments', () => {
    it('should convert simple variable assignment', () => {
      const javaCode = 'int x = 5;';
      const expected = 'X ← 5';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert string assignment', () => {
      const javaCode = 'String name = "John";';
      const expected = 'NAME ← "John"';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert boolean assignment', () => {
      const javaCode = 'boolean flag = true;';
      const expected = 'FLAG ← true';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert multiple variable declarations', () => {
      const javaCode = `
        int x = 5;
        String name = "Alice";
        boolean active = false;
      `;
      const expected = `X ← 5
NAME ← "Alice"
ACTIVE ← false`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Arithmetic Operations', () => {
    it('should convert basic arithmetic expressions', () => {
      const javaCode = 'int result = x + y * 2;';
      const expected = 'RESULT ← X + Y * 2';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert compound assignment operators', () => {
      const javaCode = 'x += 5;';
      const expected = 'X ← X + 5';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert increment/decrement operators', () => {
      const javaCode = 'x++;';
      const expected = 'X ← X + 1';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Logical Operations', () => {
    it('should convert logical AND operator', () => {
      const javaCode = 'boolean result = a && b;';
      const expected = 'RESULT ← A AND B';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert logical OR operator', () => {
      const javaCode = 'boolean result = a || b;';
      const expected = 'RESULT ← A OR B';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert logical NOT operator', () => {
      const javaCode = 'boolean result = !flag;';
      const expected = 'RESULT ← NOT FLAG';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Comparison Operations', () => {
    it('should convert equality comparison', () => {
      const javaCode = 'boolean equal = x == y;';
      const expected = 'EQUAL ← X = Y';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert inequality comparison', () => {
      const javaCode = 'boolean notEqual = x != y;';
      const expected = 'NOTEQUAL ← X ≠ Y';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert less than comparison', () => {
      const javaCode = 'boolean less = x < y;';
      const expected = 'LESS ← X < Y';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert greater than or equal comparison', () => {
      const javaCode = 'boolean greaterEqual = x >= y;';
      const expected = 'GREATEREQUAL ← X >= Y';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Input/Output Operations', () => {
    it('should convert System.out.println to output', () => {
      const javaCode = 'System.out.println("Hello World");';
      const expected = 'output "Hello World"';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert System.out.print to output', () => {
      const javaCode = 'System.out.print(x);';
      const expected = 'output X';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert Scanner input to input', () => {
      const javaCode = 'int x = scanner.nextInt();';
      const expected = 'input X';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert Scanner string input to input', () => {
      const javaCode = 'String name = scanner.nextLine();';
      const expected = 'input NAME';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Comments', () => {
    it('should preserve single-line comments', () => {
      const javaCode = '// This is a comment\nint x = 5;';
      const expected = '// This is a comment\nX ← 5';
      expect(convertJavaToIB(javaCode, { preserveComments: true })).toBe(expected);
    });

    it('should preserve multi-line comments', () => {
      const javaCode = '/* Multi-line\n   comment */\nint x = 5;';
      const expected = '/* Multi-line\n   comment */\nX ← 5';
      expect(convertJavaToIB(javaCode, { preserveComments: true })).toBe(expected);
    });
  });
});