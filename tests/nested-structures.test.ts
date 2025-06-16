import { describe, it, expect } from 'vitest';
import { convertJavaToIB } from '../src/index';

describe('Nested Structures Conversion', () => {
  describe('3-Level Nesting (Required)', () => {
    it('should convert 3-level nested if statements', () => {
      const javaCode = `
        if (x > 0) {
            if (y > 0) {
                if (z > 0) {
                    System.out.println("All positive");
                } else {
                    System.out.println("Z not positive");
                }
            } else {
                System.out.println("Y not positive");
            }
        } else {
            System.out.println("X not positive");
        }
      `;
      const expected = `IF x > 0 THEN
    IF y > 0 THEN
        IF z > 0 THEN
            OUTPUT "All positive"
        ELSE
            OUTPUT "Z not positive"
        ENDIF
    ELSE
        OUTPUT "Y not positive"
    ENDIF
ELSE
    OUTPUT "X not positive"
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert 3-level nested loops', () => {
      const javaCode = `
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                for (int k = 0; k < 3; k++) {
                    System.out.println(i + ", " + j + ", " + k);
                }
            }
        }
      `;
      const expected = `FOR i ← 0 TO 2
    FOR j ← 0 TO 2
        FOR k ← 0 TO 2
            OUTPUT i + ", " + j + ", " + k
        NEXT k
    NEXT j
NEXT i`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert mixed 3-level nesting (if-for-while)', () => {
      const javaCode = `
        if (condition) {
            for (int i = 0; i < 10; i++) {
                while (j < 5) {
                    System.out.println("Nested: " + i + ", " + j);
                    j++;
                }
            }
        }
      `;
      const expected = `IF condition THEN
    FOR i ← 0 TO 9
        WHILE j < 5
            OUTPUT "Nested: " + i + ", " + j
            j ← j + 1
        ENDWHILE
    NEXT i
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('4-Level Nesting', () => {
    it('should convert 4-level nested structures', () => {
      const javaCode = `
        if (a > 0) {
            for (int i = 0; i < 5; i++) {
                while (b < 10) {
                    if (c == i) {
                        System.out.println("Found match");
                    }
                    b++;
                }
            }
        }
      `;
      const expected = `IF a > 0 THEN
    FOR i ← 0 TO 4
        WHILE b < 10
            IF c = i THEN
                OUTPUT "Found match"
            ENDIF
            b ← b + 1
        ENDWHILE
    NEXT i
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('5-Level Nesting (Edge Case)', () => {
    it('should convert 5-level deeply nested structures', () => {
      const javaCode = `
        if (level1) {
            for (int i = 0; i < 3; i++) {
                while (level3) {
                    if (level4) {
                        for (int j = 0; j < 2; j++) {
                            System.out.println("Deep nesting: " + i + ", " + j);
                        }
                    }
                }
            }
        }
      `;
      const expected = `IF level1 THEN
    FOR i ← 0 TO 2
        WHILE level3
            IF level4 THEN
                FOR j ← 0 TO 1
                    OUTPUT "Deep nesting: " + i + ", " + j
                NEXT j
            ENDIF
        ENDWHILE
    NEXT i
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Nested Methods with Control Structures', () => {
    it('should convert method with nested control structures', () => {
      const javaCode = `
        public void processData(int[] data) {
            for (int item : data) {
                if (item > 0) {
                    while (item > 1) {
                        System.out.println("Processing: " + item);
                        item = item / 2;
                    }
                } else {
                    System.out.println("Skipping negative");
                }
            }
        }
      `;
      const expected = `PROCEDURE processData(data)
    FOR EACH item IN data
        IF item > 0 THEN
            WHILE item > 1
                OUTPUT "Processing: " + item
                item ← item / 2
            ENDWHILE
        ELSE
            OUTPUT "Skipping negative"
        ENDIF
    NEXT item
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert function with complex nested logic', () => {
      const javaCode = `
        public int findMax(int[][] matrix) {
            int max = Integer.MIN_VALUE;
            for (int i = 0; i < matrix.length; i++) {
                for (int j = 0; j < matrix[i].length; j++) {
                    if (matrix[i][j] > max) {
                        max = matrix[i][j];
                    }
                }
            }
            return max;
        }
      `;
      const expected = `FUNCTION findMax(matrix)
    max ← Integer.MIN_VALUE
    FOR i ← 0 TO matrix.length - 1
        FOR j ← 0 TO matrix[i].length - 1
            IF matrix[i][j] > max THEN
                max ← matrix[i][j]
            ENDIF
        NEXT j
    NEXT i
    RETURN max
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Complex Nested Conditions', () => {
    it('should convert nested if-else with complex conditions', () => {
      const javaCode = `
        if (x > 0 && y > 0) {
            if (x > y) {
                if (x % 2 == 0) {
                    System.out.println("X is larger and even");
                } else {
                    System.out.println("X is larger and odd");
                }
            } else if (y > x) {
                System.out.println("Y is larger");
            } else {
                System.out.println("X and Y are equal");
            }
        } else {
            System.out.println("One or both are not positive");
        }
      `;
      const expected = `IF x > 0 AND y > 0 THEN
    IF x > y THEN
        IF x MOD 2 = 0 THEN
            OUTPUT "X is larger and even"
        ELSE
            OUTPUT "X is larger and odd"
        ENDIF
    ELSEIF y > x THEN
        OUTPUT "Y is larger"
    ELSE
        OUTPUT "X and Y are equal"
    ENDIF
ELSE
    OUTPUT "One or both are not positive"
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Nested Loops with Break and Continue', () => {
    it('should convert nested loops with break and continue', () => {
      const javaCode = `
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                if (i == j) {
                    continue;
                }
                if (i + j > 15) {
                    break;
                }
                System.out.println(i + ", " + j);
            }
        }
      `;
      const expected = `FOR i ← 0 TO 9
    FOR j ← 0 TO 9
        IF i = j THEN
            NEXT j
        ENDIF
        IF i + j > 15 THEN
            EXIT FOR
        ENDIF
        OUTPUT i + ", " + j
    NEXT j
NEXT i`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Nested Switch in Loops', () => {
    it('should convert nested switch inside loop', () => {
      const javaCode = `
        for (int i = 0; i < 5; i++) {
            switch (i) {
                case 0:
                    System.out.println("Zero");
                    break;
                case 1:
                case 2:
                    System.out.println("One or Two");
                    break;
                default:
                    System.out.println("Other");
            }
        }
      `;
      const expected = `FOR i ← 0 TO 4
    CASE OF i
        0: OUTPUT "Zero"
        1, 2: OUTPUT "One or Two"
        OTHERWISE: OUTPUT "Other"
    ENDCASE
NEXT i`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });
});