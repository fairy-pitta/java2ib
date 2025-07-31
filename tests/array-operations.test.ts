/**
 * Tests for array operations transformation
 */

import { ASTTransformer } from '../src/transformer';
import { Parser } from '../src/parser';
import { Lexer } from '../src/lexer';
import { NodeType } from '../src/types';

function transformJavaCode(code: string) {
  const lexer = new Lexer(code);
  const { tokens } = lexer.tokenize();
  
  const parser = new Parser(tokens);
  const { ast } = parser.parse();
  
  if (!ast) {
    throw new Error('Failed to parse code');
  }
  
  const transformer = new ASTTransformer();
  const { pseudocodeAST } = transformer.transform(ast);
  
  return pseudocodeAST.map(node => node.content).join('\n');
}

describe('Array Operations Transformation', () => {
  describe('Array Declaration', () => {
    test('should transform array declaration with UPPERCASE naming', () => {
      const code = 'int[] numbers;';
      const result = transformJavaCode(code);
      
      expect(result).toBe('NUMBERS');
    });

    test('should transform array declaration with initialization', () => {
      const code = 'int[] values = numbers;';
      const result = transformJavaCode(code);
      
      expect(result).toBe('VALUES = NUMBERS');
    });

    test('should transform array declaration with new operator', () => {
      const code = 'String[] names = otherArray;';
      const result = transformJavaCode(code);
      
      expect(result).toBe('NAMES = OTHER_ARRAY');
    });

    test('should handle camelCase array names', () => {
      const code = 'double[] studentGrades;';
      const result = transformJavaCode(code);
      
      expect(result).toBe('STUDENT_GRADES');
    });
  });

  describe('Array Access', () => {
    test('should preserve bracket notation for array access', () => {
      const code = 'value = arr[index];';
      const result = transformJavaCode(code);
      
      expect(result).toBe('VALUE = ARR[INDEX]');
    });

    test('should handle nested array access', () => {
      const code = 'value = matrix[i][j];';
      const result = transformJavaCode(code);
      
      expect(result).toBe('VALUE = MATRIX[I][J]');
    });

    test('should handle array access with expressions', () => {
      const code = 'value = numbers[i + 1];';
      const result = transformJavaCode(code);
      
      expect(result).toBe('VALUE = NUMBERS[I + 1]');
    });

    test('should handle array assignment', () => {
      const code = 'arr[index] = value;';
      const result = transformJavaCode(code);
      
      expect(result).toBe('ARR[INDEX] = VALUE');
    });
  });

  describe('Array Length Conversion', () => {
    test('should convert array.length to SIZE(ARRAY)', () => {
      const code = 'length = myArray.length;';
      const result = transformJavaCode(code);
      
      expect(result).toBe('LENGTH = SIZE(MY_ARRAY)');
    });

    test('should handle array.length in expressions', () => {
      const code = 'lastIndex = numbers.length - 1;';
      const result = transformJavaCode(code);
      
      expect(result).toBe('LAST_INDEX = SIZE(NUMBERS) - 1');
    });

    test('should handle array.length in conditions', () => {
      const code = 'if (i < arr.length) { value = arr[i]; }';
      const result = transformJavaCode(code);
      
      expect(result).toContain('if I < SIZE(ARR) then');
      expect(result).toContain('VALUE = ARR[I]');
      expect(result).toContain('end if');
    });

    test('should handle multiple array length references', () => {
      const code = 'total = firstArray.length + secondArray.length;';
      const result = transformJavaCode(code);
      
      expect(result).toBe('TOTAL = SIZE(FIRST_ARRAY) + SIZE(SECOND_ARRAY)');
    });
  });

  describe('Array Loops', () => {
    test('should transform simple array iteration loop', () => {
      const code = `
        for (int i = 0; i < arr.length; i++) {
          sum += arr[i];
        }
      `;
      const result = transformJavaCode(code);
      
      expect(result).toContain('loop I from 0 to SIZE(ARR) - 1');
      expect(result).toContain('SUM = SUM + ARR[I]');
      expect(result).toContain('end loop');
    });

    test('should handle array loop with different bounds', () => {
      const code = `
        for (int j = 1; j <= numbers.length; j++) {
          process(numbers[j-1]);
        }
      `;
      const result = transformJavaCode(code);
      
      expect(result).toContain('loop J from 1 to SIZE(NUMBERS)');
      expect(result).toContain('PROCESS(NUMBERS[J - 1])');
      expect(result).toContain('end loop');
    });
  });

  describe('Complex Array Operations', () => {
    test('should handle array operations in method parameters', () => {
      const code = 'result = processArray(data[index], data.length);';
      const result = transformJavaCode(code);
      
      expect(result).toBe('RESULT = PROCESS_ARRAY(DATA[INDEX], SIZE(DATA))');
    });

    test('should handle array operations in return statements', () => {
      const code = 'return values[values.length - 1];';
      const result = transformJavaCode(code);
      
      expect(result).toBe('RETURN VALUES[SIZE(VALUES) - 1]');
    });

    test('should handle array comparison operations', () => {
      const code = 'if (arr1.length == arr2.length) { equal = true; }';
      const result = transformJavaCode(code);
      
      expect(result).toContain('if SIZE(ARR1) = SIZE(ARR2) then');
      expect(result).toContain('EQUAL = TRUE');
      expect(result).toContain('end if');
    });

    test('should handle array operations in while loops', () => {
      const code = `
        int i = 0;
        while (i < data.length) {
          process(data[i]);
          i++;
        }
      `;
      const result = transformJavaCode(code);
      
      expect(result).toContain('I = 0');
      expect(result).toContain('loop while I < SIZE(DATA)');
      expect(result).toContain('PROCESS(DATA[I])');
      expect(result).toContain('I = I + 1');
      expect(result).toContain('end loop');
    });
  });

  describe('Array Error Handling', () => {
    test('should handle empty array access gracefully', () => {
      const code = 'value = emptyArray;';
      const result = transformJavaCode(code);
      
      expect(result).toBe('VALUE = EMPTY_ARRAY');
    });

    test('should handle complex array expressions', () => {
      const code = 'result = matrix[row * cols + col];';
      const result = transformJavaCode(code);
      
      expect(result).toBe('RESULT = MATRIX[ROW * COLS + COL]');
    });
  });
});