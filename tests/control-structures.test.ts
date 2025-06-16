import { describe, it, expect } from 'vitest';
import { convertJavaToIB } from '../src/index';

describe('Control Structures Conversion', () => {
  describe('IF Statements', () => {
    it('should convert simple if statement', () => {
      const javaCode = `
        if (x > 0) {
            System.out.println("Positive");
        }
      `;
      const expected = `IF x > 0 THEN
    OUTPUT "Positive"
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert if-else statement', () => {
      const javaCode = `
        if (x > 0) {
            System.out.println("Positive");
        } else {
            System.out.println("Not positive");
        }
      `;
      const expected = `IF x > 0 THEN
    OUTPUT "Positive"
ELSE
    OUTPUT "Not positive"
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert if-else if-else statement', () => {
      const javaCode = `
        if (x > 0) {
            System.out.println("Positive");
        } else if (x < 0) {
            System.out.println("Negative");
        } else {
            System.out.println("Zero");
        }
      `;
      const expected = `IF x > 0 THEN
    OUTPUT "Positive"
ELSEIF x < 0 THEN
    OUTPUT "Negative"
ELSE
    OUTPUT "Zero"
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert nested if statements', () => {
      const javaCode = `
        if (x > 0) {
            if (x > 10) {
                System.out.println("Large positive");
            } else {
                System.out.println("Small positive");
            }
        }
      `;
      const expected = `IF x > 0 THEN
    IF x > 10 THEN
        OUTPUT "Large positive"
    ELSE
        OUTPUT "Small positive"
    ENDIF
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert if with complex condition', () => {
      const javaCode = `
        if (x > 0 && y < 10 || z == 5) {
            System.out.println("Complex condition");
        }
      `;
      const expected = `IF x > 0 AND y < 10 OR z = 5 THEN
    OUTPUT "Complex condition"
ENDIF`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('WHILE Loops', () => {
    it('should convert simple while loop', () => {
      const javaCode = `
        while (i < 10) {
            System.out.println(i);
            i++;
        }
      `;
      const expected = `WHILE i < 10
    OUTPUT i
    i ← i + 1
ENDWHILE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert while loop with complex condition', () => {
      const javaCode = `
        while (i < 10 && found == false) {
            i++;
        }
      `;
      const expected = `WHILE i < 10 AND found = false
    i ← i + 1
ENDWHILE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert nested while loops', () => {
      const javaCode = `
        while (i < 10) {
            while (j < 5) {
                System.out.println(i + j);
                j++;
            }
            i++;
        }
      `;
      const expected = `WHILE i < 10
    WHILE j < 5
        OUTPUT i + j
        j ← j + 1
    ENDWHILE
    i ← i + 1
ENDWHILE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('FOR Loops', () => {
    it('should convert simple for loop', () => {
      const javaCode = `
        for (int i = 0; i < 10; i++) {
            System.out.println(i);
        }
      `;
      const expected = `FOR i ← 0 TO 9
    OUTPUT i
NEXT i`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert for loop with step', () => {
      const javaCode = `
        for (int i = 0; i < 20; i += 2) {
            System.out.println(i);
        }
      `;
      const expected = `FOR i ← 0 TO 19 STEP 2
    OUTPUT i
NEXT i`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert for loop with different start and end', () => {
      const javaCode = `
        for (int i = 5; i <= 15; i++) {
            System.out.println(i);
        }
      `;
      const expected = `FOR i ← 5 TO 15
    OUTPUT i
NEXT i`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert nested for loops', () => {
      const javaCode = `
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                System.out.println(i + ", " + j);
            }
        }
      `;
      const expected = `FOR i ← 0 TO 2
    FOR j ← 0 TO 2
        OUTPUT i + ", " + j
    NEXT j
NEXT i`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Enhanced FOR Loops (For-Each)', () => {
    it('should convert for-each loop with array', () => {
      const javaCode = `
        for (int item : numbers) {
            System.out.println(item);
        }
      `;
      const expected = `FOR EACH item IN numbers
    OUTPUT item
NEXT item`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert for-each loop with collection', () => {
      const javaCode = `
        for (String name : nameList) {
            System.out.println("Hello " + name);
        }
      `;
      const expected = `FOR EACH name IN nameList
    OUTPUT "Hello " + name
NEXT name`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('DO-WHILE Loops', () => {
    it('should convert do-while loop', () => {
      const javaCode = `
        do {
            System.out.println(i);
            i++;
        } while (i < 10);
      `;
      const expected = `REPEAT
    OUTPUT i
    i ← i + 1
UNTIL i >= 10`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert do-while with complex condition', () => {
      const javaCode = `
        do {
            x = x * 2;
        } while (x < 100 && x > 0);
      `;
      const expected = `REPEAT
    x ← x * 2
UNTIL NOT (x < 100 AND x > 0)`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('SWITCH Statements', () => {
    it('should convert simple switch statement', () => {
      const javaCode = `
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            default:
                System.out.println("Other day");
        }
      `;
      const expected = `CASE OF day
    1: OUTPUT "Monday"
    2: OUTPUT "Tuesday"
    OTHERWISE: OUTPUT "Other day"
ENDCASE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert switch with multiple cases', () => {
      const javaCode = `
        switch (grade) {
            case 'A':
            case 'B':
                System.out.println("Good");
                break;
            case 'C':
                System.out.println("Average");
                break;
            case 'D':
            case 'F':
                System.out.println("Poor");
                break;
        }
      `;
      const expected = `CASE OF grade
    'A', 'B': OUTPUT "Good"
    'C': OUTPUT "Average"
    'D', 'F': OUTPUT "Poor"
ENDCASE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Break and Continue', () => {
    it('should convert break statement in loop', () => {
      const javaCode = `
        for (int i = 0; i < 10; i++) {
            if (i == 5) {
                break;
            }
            System.out.println(i);
        }
      `;
      const expected = `FOR i ← 0 TO 9
    IF i = 5 THEN
        EXIT FOR
    ENDIF
    OUTPUT i
NEXT i`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert continue statement in loop', () => {
      const javaCode = `
        for (int i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                continue;
            }
            System.out.println(i);
        }
      `;
      const expected = `FOR i ← 0 TO 9
    IF i MOD 2 = 0 THEN
        NEXT i
    ENDIF
    OUTPUT i
NEXT i`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });
});