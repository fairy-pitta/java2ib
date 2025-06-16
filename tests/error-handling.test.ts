import { describe, it, expect } from 'vitest';
import { convertJavaToIB } from '../src/index';

describe('Error Handling and Edge Cases', () => {
  describe('Syntax Error Handling', () => {
    it('should handle incomplete Java code gracefully', () => {
      const javaCode = `
        public void incompleteMethod() {
            int x = 5;
            // Missing closing brace
      `;
      expect(() => convertJavaToIB(javaCode)).toThrow('Syntax error: Incomplete method declaration');
    });

    it('should handle invalid Java syntax', () => {
      const javaCode = `
        public void invalidSyntax() {
            int x = ;
            return x;
        }
      `;
      expect(() => convertJavaToIB(javaCode)).toThrow('Syntax error: Invalid variable declaration');
    });

    it('should handle mismatched parentheses', () => {
      const javaCode = `
        public int calculate() {
            return (5 + 3 * 2;
        }
      `;
      expect(() => convertJavaToIB(javaCode)).toThrow('Syntax error: Mismatched parentheses');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty Java code', () => {
      const javaCode = '';
      const expected = '';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle whitespace-only Java code', () => {
      const javaCode = '   \n\t   \n   ';
      const expected = '';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle comments-only Java code', () => {
      const javaCode = `
        // This is a comment
        /* This is a block comment */
        /**
         * This is a javadoc comment
         */
      `;
      const expected = `// This is a comment
// This is a block comment
// This is a javadoc comment`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle very long variable names', () => {
      const javaCode = `
        public void test() {
            int thisIsAVeryLongVariableNameThatShouldStillBeHandledCorrectly = 42;
            System.out.println(thisIsAVeryLongVariableNameThatShouldStillBeHandledCorrectly);
        }
      `;
      const expected = `PROCEDURE test()
    thisIsAVeryLongVariableNameThatShouldStillBeHandledCorrectly ← 42
    OUTPUT thisIsAVeryLongVariableNameThatShouldStillBeHandledCorrectly
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle Unicode characters in strings', () => {
      const javaCode = `
        public void unicodeTest() {
            String message = "こんにちは世界";
            System.out.println(message);
        }
      `;
      const expected = `PROCEDURE unicodeTest()
    message ← "こんにちは世界"
    OUTPUT message
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle deeply nested structures', () => {
      const javaCode = `
        public void deepNesting() {
            for (int i = 0; i < 10; i++) {
                for (int j = 0; j < 10; j++) {
                    for (int k = 0; k < 10; k++) {
                        for (int l = 0; l < 10; l++) {
                            if (i + j + k + l > 20) {
                                if (i % 2 == 0) {
                                    System.out.println("Even i: " + i);
                                }
                            }
                        }
                    }
                }
            }
        }
      `;
      const expected = `PROCEDURE deepNesting()
    FOR i ← 0 TO 9
        FOR j ← 0 TO 9
            FOR k ← 0 TO 9
                FOR l ← 0 TO 9
                    IF i + j + k + l > 20 THEN
                        IF i MOD 2 = 0 THEN
                            OUTPUT "Even i: " + i
                        ENDIF
                    ENDIF
                NEXT l
            NEXT k
        NEXT j
    NEXT i
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Complex Expression Handling', () => {
    it('should handle complex mathematical expressions', () => {
      const javaCode = `
        public double complexCalculation(double x, double y) {
            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / (Math.abs(x - y) + 1);
        }
      `;
      const expected = `FUNCTION complexCalculation(x, y)
    RETURN SQRT(POW(x, 2) + POW(y, 2)) / (ABS(x - y) + 1)
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle complex boolean expressions', () => {
      const javaCode = `
        public boolean complexCondition(int a, int b, int c, boolean flag) {
            return (a > b && b > c) || (flag && a % 2 == 0) || (!flag && c < 0);
        }
      `;
      const expected = `FUNCTION complexCondition(a, b, c, flag)
    RETURN (a > b AND b > c) OR (flag AND a MOD 2 = 0) OR (NOT flag AND c < 0)
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle method chaining', () => {
      const javaCode = `
        public void methodChaining() {
            String result = "hello world".toUpperCase().trim().substring(0, 5);
            System.out.println(result);
        }
      `;
      const expected = `PROCEDURE methodChaining()
    result ← "hello world".toUpperCase().trim().substring(0, 5)
    OUTPUT result
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Type Conversion Edge Cases', () => {
    it('should handle explicit type casting', () => {
      const javaCode = `
        public void typeCasting() {
            double d = 3.14;
            int i = (int) d;
            char c = (char) (i + 65);
            System.out.println(c);
        }
      `;
      const expected = `PROCEDURE typeCasting()
    d ← 3.14
    i ← INT(d)
    c ← CHAR(i + 65)
    OUTPUT c
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle string concatenation with different types', () => {
      const javaCode = `
        public void stringConcatenation() {
            int number = 42;
            boolean flag = true;
            double pi = 3.14159;
            String result = "Number: " + number + ", Flag: " + flag + ", Pi: " + pi;
            System.out.println(result);
        }
      `;
      const expected = `PROCEDURE stringConcatenation()
    number ← 42
    flag ← TRUE
    pi ← 3.14159
    result ← "Number: " + number + ", Flag: " + flag + ", Pi: " + pi
    OUTPUT result
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Array Edge Cases', () => {
    it('should handle empty array initialization', () => {
      const javaCode = `
        public void emptyArray() {
            int[] numbers = new int[0];
            String[] strings = {};
            System.out.println("Arrays created");
        }
      `;
      const expected = `PROCEDURE emptyArray()
    numbers ← NEW ARRAY[0] OF INTEGER
    strings ← {}
    OUTPUT "Arrays created"
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle multi-dimensional array access', () => {
      const javaCode = `
        public void multiDimensionalArray() {
            int[][] matrix = new int[3][3];
            matrix[1][2] = 5;
            int value = matrix[1][2];
            System.out.println(value);
        }
      `;
      const expected = `PROCEDURE multiDimensionalArray()
    matrix ← NEW ARRAY[3][3] OF INTEGER
    matrix[1][2] ← 5
    value ← matrix[1][2]
    OUTPUT value
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Special Java Keywords', () => {
    it('should handle final variables', () => {
      const javaCode = `
        public void finalVariables() {
            final int CONSTANT = 100;
            final String MESSAGE = "Hello";
            System.out.println(MESSAGE + CONSTANT);
        }
      `;
      const expected = `PROCEDURE finalVariables()
    CONSTANT CONSTANT ← 100
    CONSTANT MESSAGE ← "Hello"
    OUTPUT MESSAGE + CONSTANT
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle static methods', () => {
      const javaCode = `
        public static void staticMethod() {
            System.out.println("This is a static method");
        }
      `;
      const expected = `STATIC PROCEDURE staticMethod()
    OUTPUT "This is a static method"
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should handle this keyword', () => {
      const javaCode = `
        public void useThis() {
            this.value = 10;
            this.display();
        }
      `;
      const expected = `PROCEDURE useThis()
    THIS.value ← 10
    THIS.display()
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });
});