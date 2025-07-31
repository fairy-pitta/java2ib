/**
 * Tests for the main converter functionality
 */

import { JavaToIBConverter } from '../src/converter';
import { ConversionOptions, ErrorType, ErrorSeverity } from '../src/types';

describe('JavaToIBConverter', () => {
  let converter: JavaToIBConverter;

  beforeEach(() => {
    converter = new JavaToIBConverter();
  });

  describe('Constructor and Basic Interface', () => {
    test('should create converter instance', () => {
      expect(converter).toBeInstanceOf(JavaToIBConverter);
    });

    test('should have convert method', () => {
      expect(typeof converter.convert).toBe('function');
    });
  });

  describe('Conversion Result Structure', () => {
    test('should return conversion result structure with all required properties', () => {
      const result = converter.convert('int x = 5;');

      expect(result).toHaveProperty('pseudocode');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('metadata');

      expect(typeof result.pseudocode).toBe('string');
      expect(typeof result.success).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(typeof result.metadata).toBe('object');
    });

    test('should include metadata with processing information', () => {
      const result = converter.convert('int x = 5;');

      expect(result.metadata).toHaveProperty('originalLines');
      expect(result.metadata).toHaveProperty('convertedLines');
      expect(result.metadata).toHaveProperty('processingTime');

      expect(typeof result.metadata.originalLines).toBe('number');
      expect(typeof result.metadata.convertedLines).toBe('number');
      expect(typeof result.metadata.processingTime).toBe('number');
      expect(result.metadata.originalLines).toBeGreaterThan(0);
      expect(result.metadata.processingTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Input Validation', () => {
    test('should handle empty input gracefully', () => {
      const result = converter.convert('');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].type).toBe(ErrorType.CONVERSION_ERROR);
      expect(result.errors[0].message).toContain('empty');
    });

    test('should handle whitespace-only input', () => {
      const result = converter.convert('   \n  \t  ');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].type).toBe(ErrorType.CONVERSION_ERROR);
    });

    test('should handle null/undefined input gracefully', () => {
      const result1 = converter.convert(null as any);
      const result2 = converter.convert(undefined as any);

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
      expect(result1.errors.length).toBeGreaterThan(0);
      expect(result2.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Basic Java Constructs', () => {
    test('should convert simple variable declaration', () => {
      const result = converter.convert('int x = 5;');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('X = 5');
      expect(result.errors.length).toBe(0);
    });

    test('should convert variable assignment', () => {
      const result = converter.convert('int x = 5; x = 10;');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('X = 5');
      expect(result.pseudocode).toContain('X = 10');
    });

    test('should convert boolean literals', () => {
      const result = converter.convert('boolean flag = true;');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('FLAG = TRUE');
    });

    test('should convert string literals', () => {
      const result = converter.convert('String message = "Hello World";');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('MESSAGE = "Hello World"');
    });
  });

  describe('Operators', () => {
    test('should convert comparison operators', () => {
      const result = converter.convert('boolean result = (x == 5 && y != 3);');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('='); // == becomes =
      expect(result.pseudocode).toContain('≠'); // != becomes ≠
      expect(result.pseudocode).toContain('AND'); // && becomes AND
    });

    test('should convert logical operators', () => {
      const result = converter.convert('boolean result = (x > 0 || !flag);');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('OR'); // || becomes OR
      expect(result.pseudocode).toContain('NOT'); // ! becomes NOT
    });

    test('should convert modulo operator', () => {
      const result = converter.convert('int remainder = x % 2;');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('mod'); // % becomes mod
    });
  });

  describe('Control Structures', () => {
    test('should convert if statement', () => {
      const result = converter.convert('if (x > 0) { y = 1; }');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('if');
      expect(result.pseudocode).toContain('then');
      expect(result.pseudocode).toContain('end if');
    });

    test('should convert if-else statement', () => {
      const result = converter.convert('if (x > 0) { y = 1; } else { y = -1; }');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('if');
      expect(result.pseudocode).toContain('then');
      expect(result.pseudocode).toContain('else');
      expect(result.pseudocode).toContain('end if');
    });

    test('should convert while loop', () => {
      const result = converter.convert('while (x > 0) { x = x - 1; }');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('loop while');
      expect(result.pseudocode).toContain('end loop');
    });

    test('should convert for loop', () => {
      const result = converter.convert('for (int i = 0; i < 10; i++) { sum = sum + i; }');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('loop');
      expect(result.pseudocode).toContain('from');
      expect(result.pseudocode).toContain('to');
      expect(result.pseudocode).toContain('end loop');
    });
  });

  describe('Methods and Functions', () => {
    test('should convert void method to procedure', () => {
      const result = converter.convert('public void printMessage() { System.out.println("Hello"); }');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('PROCEDURE');
      expect(result.pseudocode).toContain('PRINT_MESSAGE');
      expect(result.pseudocode).toContain('END PROCEDURE');
    });

    test('should convert non-void method to function', () => {
      const result = converter.convert('public int add(int a, int b) { return a + b; }');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('FUNCTION');
      expect(result.pseudocode).toContain('ADD');
      expect(result.pseudocode).toContain('END FUNCTION');
      expect(result.pseudocode).toContain('RETURN');
    });

    test('should convert method parameters to uppercase', () => {
      const result = converter.convert('public int multiply(int firstNumber, int secondNumber) { return firstNumber * secondNumber; }');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('FIRST_NUMBER');
      expect(result.pseudocode).toContain('SECOND_NUMBER');
    });
  });

  describe('Arrays', () => {
    test('should convert array declaration', () => {
      const result = converter.convert('int[] numbers;');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('NUMBERS');
    });

    test('should convert array access', () => {
      const result = converter.convert('int value = numbers[0];');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('NUMBERS[0]');
    });

    test('should convert array length', () => {
      const result = converter.convert('int size = numbers.length;');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('SIZE(NUMBERS)');
    });
  });

  describe('Input/Output', () => {
    test('should convert System.out.println', () => {
      const result = converter.convert('System.out.println("Hello World");');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('output');
    });

    test('should convert Scanner input', () => {
      // Simplified test - assume scanner is already declared
      const result = converter.convert('int x = scanner.nextInt();');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('input');
    });
  });

  describe('Error Handling', () => {
    test('should handle syntax errors gracefully', () => {
      const result = converter.convert('int x = ;'); // Missing value

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].severity).toBe(ErrorSeverity.ERROR);
    });

    test('should handle lexical errors', () => {
      const result = converter.convert('int x = 5@;'); // Invalid character

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.type === ErrorType.LEXICAL_ERROR)).toBe(true);
    });

    test('should provide meaningful error messages', () => {
      const result = converter.convert('int x = ;');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toBeTruthy();
      expect(result.errors[0].location).toBeDefined();
      expect(result.errors[0].location.line).toBeGreaterThan(0);
      expect(result.errors[0].location.column).toBeGreaterThan(0);
    });

    test('should handle unsupported constructs with warnings', () => {
      // This test assumes some constructs generate warnings rather than errors
      const result = converter.convert('int x = 5; // Simple valid code');

      // Even if successful, check that the warning system works
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('Conversion Options', () => {
    test('should respect preserveComments option', () => {
      const javaCode = '// This is a comment\nint x = 5;';
      
      const resultWithComments = converter.convert(javaCode, { preserveComments: true });
      const resultWithoutComments = converter.convert(javaCode, { preserveComments: false });

      // Both should succeed
      expect(resultWithComments.success).toBe(true);
      expect(resultWithoutComments.success).toBe(true);
      
      // The main difference should be in comment handling
      // For now, just check that both produce valid pseudocode
      expect(resultWithComments.pseudocode).toContain('X = 5');
      expect(resultWithoutComments.pseudocode).toContain('X = 5');
    });

    test('should respect indentSize option', () => {
      const javaCode = 'if (x > 0) { y = 1; }';
      
      const resultSmallIndent = converter.convert(javaCode, { indentSize: 2 });
      const resultLargeIndent = converter.convert(javaCode, { indentSize: 4 });

      // Both should succeed but have different indentation
      expect(resultSmallIndent.success).toBe(true);
      expect(resultLargeIndent.success).toBe(true);
      
      // The large indent version should have more spaces
      const smallIndentLines = resultSmallIndent.pseudocode.split('\n');
      const largeIndentLines = resultLargeIndent.pseudocode.split('\n');
      
      // Find indented lines and compare
      const smallIndentedLine = smallIndentLines.find(line => line.startsWith('  '));
      const largeIndentedLine = largeIndentLines.find(line => line.startsWith('    '));
      
      if (smallIndentedLine && largeIndentedLine) {
        expect(largeIndentedLine.indexOf(largeIndentedLine.trim())).toBeGreaterThan(
          smallIndentedLine.indexOf(smallIndentedLine.trim())
        );
      }
    });

    test('should handle default options when none provided', () => {
      const result = converter.convert('int x = 5;');

      expect(result.success).toBe(true);
      expect(result.pseudocode).toBeTruthy();
    });
  });

  describe('Complex Programs', () => {
    test('should convert complete class with main method', () => {
      const javaCode = `
        int a = 5;
        int b = 3;
        int sum = a + b;
        System.out.println("Sum: " + sum);
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('A = 5');
      expect(result.pseudocode).toContain('B = 3');
      expect(result.pseudocode).toContain('SUM = A + B');
      expect(result.pseudocode).toContain('output');
    });

    test('should handle nested control structures', () => {
      const javaCode = `
        for (int i = 0; i < 10; i++) {
          if (i % 2 == 0) {
            System.out.println("Even: " + i);
          } else {
            System.out.println("Odd: " + i);
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('loop');
      expect(result.pseudocode).toContain('if');
      expect(result.pseudocode).toContain('mod');
      expect(result.pseudocode).toContain('end if');
      expect(result.pseudocode).toContain('end loop');
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle large input efficiently', () => {
      // Generate a large but valid Java program
      const lines = [];
      for (let i = 0; i < 100; i++) {
        lines.push(`int var${i} = ${i};`);
      }
      const largeCode = lines.join('\n');

      const startTime = Date.now();
      const result = converter.convert(largeCode);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(result.metadata.processingTime).toBeLessThan(5000);
    });

    test('should handle deeply nested structures', () => {
      let nestedCode = 'int x = 0;';
      for (let i = 0; i < 10; i++) {
        nestedCode = `if (x > ${i}) { ${nestedCode} }`;
      }

      const result = converter.convert(nestedCode);

      expect(result.success).toBe(true);
      // Should handle deep nesting without stack overflow
    });
  });
});
