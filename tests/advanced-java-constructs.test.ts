/**
 * Tests for advanced Java constructs: switch, enhanced for, break/continue, array initialization
 */

import { JavaToIBConverter } from '../src/converter';
import { NodeType } from '../src/types';

describe('Advanced Java Constructs', () => {
  let converter: JavaToIBConverter;

  beforeEach(() => {
    converter = new JavaToIBConverter();
  });

  describe('Switch Statements', () => {
    test('should convert basic switch statement', () => {
      const javaCode = `
        switch (grade) {
          case 'A':
            System.out.println("Excellent");
            break;
          case 'B':
            System.out.println("Good");
            break;
          default:
            System.out.println("Try harder");
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('case GRADE of');
      expect(result.pseudocode).toContain("'A':");
      expect(result.pseudocode).toContain('output "Excellent"');
      expect(result.pseudocode).toContain("'B':");
      expect(result.pseudocode).toContain('output "Good"');
      expect(result.pseudocode).toContain('default:');
      expect(result.pseudocode).toContain('output "Try harder"');
      expect(result.pseudocode).toContain('end case');
    });

    test('should convert switch with integer cases', () => {
      const javaCode = `
        switch (day) {
          case 1:
            System.out.println("Monday");
            break;
          case 2:
            System.out.println("Tuesday");
            break;
          case 3:
            System.out.println("Wednesday");
            break;
          default:
            System.out.println("Invalid day");
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('case DAY of');
      expect(result.pseudocode).toContain('1:');
      expect(result.pseudocode).toContain('2:');
      expect(result.pseudocode).toContain('3:');
      expect(result.pseudocode).toContain('default:');
      expect(result.pseudocode).toContain('end case');
    });

    test('should handle switch without default case', () => {
      const javaCode = `
        switch (status) {
          case "active":
            System.out.println("User is active");
            break;
          case "inactive":
            System.out.println("User is inactive");
            break;
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('case STATUS of');
      expect(result.pseudocode).toContain('"active":');
      expect(result.pseudocode).toContain('"inactive":');
      expect(result.pseudocode).toContain('end case');
      expect(result.pseudocode).not.toContain('default:');
    });
  });

  describe('Enhanced For Loops (For-Each)', () => {
    test('should convert enhanced for loop with array', () => {
      const javaCode = `
        for (String name : names) {
          System.out.println(name);
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('loop NAME in NAMES');
      expect(result.pseudocode).toContain('output NAME');
      expect(result.pseudocode).toContain('end loop');
    });

    test('should convert enhanced for loop with integers', () => {
      const javaCode = `
        for (int number : numbers) {
          System.out.println("Number: " + number);
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('loop NUMBER in NUMBERS');
      expect(result.pseudocode).toContain('output "Number: " + NUMBER');
      expect(result.pseudocode).toContain('end loop');
    });

    test('should convert enhanced for loop with complex expressions', () => {
      const javaCode = `
        for (Student student : classList) {
          System.out.println(student.getName());
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('loop STUDENT in CLASS_LIST');
      expect(result.pseudocode).toContain('end loop');
    });
  });

  describe('Array Initialization', () => {
    test('should convert array initialization with integers', () => {
      const javaCode = `
        int[] numbers = {1, 2, 3, 4, 5};
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('NUMBERS = [1, 2, 3, 4, 5]');
    });

    test('should convert array initialization with strings', () => {
      const javaCode = `
        String[] colors = {"red", "green", "blue"};
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('COLORS = ["red", "green", "blue"]');
    });

    test('should convert array initialization with mixed expressions', () => {
      const javaCode = `
        int[] values = {x + 1, y * 2, 10};
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('VALUES = [X + 1, Y * 2, 10]');
    });

    test('should convert empty array initialization', () => {
      const javaCode = `
        int[] empty = {};
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('EMPTY = []');
    });
  });

  describe('Break and Continue Statements', () => {
    test('should handle break statement in loop', () => {
      const javaCode = `
        for (int i = 0; i < 10; i++) {
          if (i == 5) {
            break;
          }
          System.out.println(i);
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      // Break statements are converted to comments in IB pseudocode
      expect(result.pseudocode).toContain('// break statement');
    });

    test('should handle continue statement in loop', () => {
      const javaCode = `
        for (int i = 0; i < 10; i++) {
          if (i % 2 == 0) {
            continue;
          }
          System.out.println(i);
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      // Continue statements are converted to comments in IB pseudocode
      expect(result.pseudocode).toContain('// continue statement');
    });
  });

  describe('Complex Combined Constructs', () => {
    test('should convert switch with enhanced for loop', () => {
      const javaCode = `
        switch (operation) {
          case "sum":
            int total = 0;
            for (int num : numbers) {
              total += num;
            }
            System.out.println("Sum: " + total);
            break;
          case "average":
            int sum = 0;
            for (int num : numbers) {
              sum += num;
            }
            System.out.println("Average: " + (sum / numbers.length));
            break;
          default:
            System.out.println("Unknown operation");
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('case OPERATION of');
      expect(result.pseudocode).toContain('"sum":');
      expect(result.pseudocode).toContain('loop NUM in NUMBERS');
      expect(result.pseudocode).toContain('TOTAL = TOTAL + NUM');
      expect(result.pseudocode).toContain('"average":');
      expect(result.pseudocode).toContain('default:');
      expect(result.pseudocode).toContain('end case');
    });

    test('should convert array initialization with enhanced for loop', () => {
      const javaCode = `
        int[] scores = {85, 92, 78, 96, 88};
        for (int score : scores) {
          if (score >= 90) {
            System.out.println("Excellent: " + score);
          }
        }
      `;

      const result = converter.convert(javaCode);
      
      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('SCORES = [85, 92, 78, 96, 88]');
      expect(result.pseudocode).toContain('loop SCORE in SCORES');
      expect(result.pseudocode).toContain('if SCORE >= 90 then');
      expect(result.pseudocode).toContain('output "Excellent: " + SCORE');
    });
  });
});