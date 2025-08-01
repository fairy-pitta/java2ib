/**
 * Tests for advanced Java construct handling
 * Covers main method extraction, string operations, and realistic educational patterns
 */

import { JavaToIBConverter } from '../src/converter';
import { ErrorType, ErrorSeverity } from '../src/types';

describe('Advanced Java Construct Handling', () => {
  let converter: JavaToIBConverter;

  beforeEach(() => {
    converter = new JavaToIBConverter();
  });

  describe('Main Method Extraction', () => {
    test('should extract and convert main method logic', () => {
      const javaCode = `
        public class HelloWorld {
          public static void main(String[] args) {
            int x = 5;
            int y = 10;
            int sum = x + y;
            System.out.println("Sum: " + sum);
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('// Main program logic extracted from main method');
      expect(result.pseudocode).toContain('X = 5');
      expect(result.pseudocode).toContain('Y = 10');
      expect(result.pseudocode).toContain('SUM = X + Y');
      expect(result.pseudocode).toContain('output');
      
      // Should not contain method declaration wrapper for main
      expect(result.pseudocode).not.toContain('PROCEDURE MAIN');
      expect(result.pseudocode).not.toContain('FUNCTION MAIN');
    });

    test('should handle main method with complex logic', () => {
      const javaCode = `
        public class Calculator {
          public static void main(String[] args) {
            int a = 10;
            int b = 5;
            
            if (a > b) {
              System.out.println("a is greater");
            } else {
              System.out.println("b is greater or equal");
            }
            
            for (int i = 0; i < 3; i++) {
              System.out.println("Count: " + i);
            }
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('A = 10');
      expect(result.pseudocode).toContain('B = 5');
      expect(result.pseudocode).toContain('if A > B then');
      expect(result.pseudocode).toContain('loop I from 0 to');
      expect(result.pseudocode).toContain('end if');
      expect(result.pseudocode).toContain('end loop');
    });

    test('should handle class with main method and other methods', () => {
      const javaCode = `
        public class MathUtils {
          public static int add(int a, int b) {
            return a + b;
          }
          
          public static void main(String[] args) {
            int result = add(5, 3);
            System.out.println("Result: " + result);
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      // When a class has other methods, preserve the class structure
      expect(result.pseudocode).toContain('// CLASS MATH_UTILS');
      expect(result.pseudocode).toContain('FUNCTION ADD(A, B)');
      expect(result.pseudocode).toContain('RETURN A + B');
      expect(result.pseudocode).toContain('END FUNCTION');
      expect(result.pseudocode).toContain('PROCEDURE MAIN(ARGS)');
      expect(result.pseudocode).toContain('RESULT = ADD(5, 3)');
    });

    test('should handle class without main method normally', () => {
      const javaCode = `
        public class Student {
          private String name;
          private int age;
          
          public void setName(String name) {
            this.name = name;
          }
          
          public String getName() {
            return name;
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('// CLASS STUDENT');
      expect(result.pseudocode).toContain('PROCEDURE SET_NAME');
      expect(result.pseudocode).toContain('FUNCTION GET_NAME');
      expect(result.pseudocode).not.toContain('Main program logic');
    });
  });

  describe('String Operations and Comparisons', () => {
    test('should convert string equals comparison', () => {
      const javaCode = `
        String name1 = "John";
        String name2 = "Jane";
        boolean same = name1.equals(name2);
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('NAME1 = "John"');
      expect(result.pseudocode).toContain('NAME2 = "Jane"');
      expect(result.pseudocode).toContain('SAME = NAME1 = NAME2');
    });

    test('should convert string equalsIgnoreCase comparison', () => {
      const javaCode = `
        String word1 = "Hello";
        String word2 = "HELLO";
        boolean same = word1.equalsIgnoreCase(word2);
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('SAME = UPPER(WORD1) = UPPER(WORD2)');
    });

    test('should convert string length operation', () => {
      const javaCode = `
        String message = "Hello World";
        int length = message.length();
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('MESSAGE = "Hello World"');
      expect(result.pseudocode).toContain('LENGTH = LENGTH(MESSAGE)');
    });

    test('should convert string substring operations', () => {
      const javaCode = `
        String text = "Programming";
        String part1 = text.substring(0, 4);
        String part2 = text.substring(4);
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('TEXT = "Programming"');
      expect(result.pseudocode).toContain('PART1 = SUBSTRING(TEXT, 0, 4)');
      expect(result.pseudocode).toContain('PART2 = SUBSTRING(TEXT, 4)');
    });

    test('should convert string charAt operation', () => {
      const javaCode = `
        String word = "Java";
        char firstChar = word.charAt(0);
        char lastChar = word.charAt(word.length() - 1);
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('WORD = "Java"');
      expect(result.pseudocode).toContain('FIRST_CHAR = WORD[0]');
      expect(result.pseudocode).toContain('LAST_CHAR = WORD[LENGTH(WORD) - 1]');
    });

    test('should convert string case conversion operations', () => {
      const javaCode = `
        String original = "Hello World";
        String upper = original.toUpperCase();
        String lower = original.toLowerCase();
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('ORIGINAL = "Hello World"');
      expect(result.pseudocode).toContain('UPPER = UPPER(ORIGINAL)');
      expect(result.pseudocode).toContain('LOWER = LOWER(ORIGINAL)');
    });

    test('should convert string indexOf operation', () => {
      const javaCode = `
        String sentence = "The quick brown fox";
        int position = sentence.indexOf("quick");
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('SENTENCE = "The quick brown fox"');
      expect(result.pseudocode).toContain('POSITION = POSITION("quick", SENTENCE)');
    });
  });

  describe('Enhanced Error Messages with Line Numbers', () => {
    test('should provide detailed error messages with line numbers for syntax errors', () => {
      const javaCode = `
        int x = 5;
        int y = 10
        int z = 15;
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      const error = result.errors[0];
      expect(error.message).toContain('line');
      expect(error.message).toContain('column');
      expect(error.location.line).toBe(4); // Error on line 4 (missing semicolon from previous line)
      expect(error.severity).toBe(ErrorSeverity.ERROR);
    });

    test('should provide contextual error messages for missing punctuation', () => {
      const javaCode = `
        public void test() {
          int x = 5
          int y = 10;
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      const error = result.errors[0];
      expect(error.message).toContain('Expected');
      expect(error.message).toContain('line');
      expect(error.message).toContain('missing punctuation');
    });

    test('should provide helpful error messages for unexpected tokens', () => {
      const javaCode = `
        int x = 5 @;
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Should have lexical error for invalid character
      const lexicalError = result.errors.find(e => e.type === ErrorType.LEXICAL_ERROR);
      expect(lexicalError).toBeDefined();
      expect(lexicalError!.message).toContain('line');
      expect(lexicalError!.message).toContain('column');
    });
  });

  describe('Realistic Educational Java Code Patterns', () => {
    test('should convert simple calculator program', () => {
      const javaCode = `
        public class SimpleCalculator {
          public static void main(String[] args) {
            int num1 = 10;
            int num2 = 5;
            
            int sum = num1 + num2;
            int difference = num1 - num2;
            int product = num1 * num2;
            int quotient = num1 / num2;
            int remainder = num1 % num2;
            
            System.out.println("Sum: " + sum);
            System.out.println("Difference: " + difference);
            System.out.println("Product: " + product);
            System.out.println("Quotient: " + quotient);
            System.out.println("Remainder: " + remainder);
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('NUM1 = 10');
      expect(result.pseudocode).toContain('NUM2 = 5');
      expect(result.pseudocode).toContain('SUM = NUM1 + NUM2');
      expect(result.pseudocode).toContain('DIFFERENCE = NUM1 - NUM2');
      expect(result.pseudocode).toContain('PRODUCT = NUM1 * NUM2');
      expect(result.pseudocode).toContain('QUOTIENT = NUM1 div NUM2');
      expect(result.pseudocode).toContain('REMAINDER = NUM1 mod NUM2');
      expect(result.pseudocode).toContain('output "Sum: " + SUM');
    });

    test('should convert grade classification program', () => {
      const javaCode = `
        public class GradeClassifier {
          public static void main(String[] args) {
            int score = 85;
            String grade;
            
            if (score >= 90) {
              grade = "A";
            } else if (score >= 80) {
              grade = "B";
            } else if (score >= 70) {
              grade = "C";
            } else if (score >= 60) {
              grade = "D";
            } else {
              grade = "F";
            }
            
            System.out.println("Grade: " + grade);
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('SCORE = 85');
      expect(result.pseudocode).toContain('if SCORE >= 90 then');
      expect(result.pseudocode).toContain('GRADE = "A"');
      expect(result.pseudocode).toContain('else');
      expect(result.pseudocode).toContain('if SCORE >= 80 then');
      expect(result.pseudocode).toContain('GRADE = "B"');
      expect(result.pseudocode).toContain('end if');
    });

    test('should convert array processing program', () => {
      const javaCode = `
        public class ArrayProcessor {
          public static void main(String[] args) {
            int[] numbers = {10, 20, 30, 40, 50};
            int sum = 0;
            
            for (int i = 0; i < numbers.length; i++) {
              sum = sum + numbers[i];
            }
            
            double average = sum / numbers.length;
            System.out.println("Sum: " + sum);
            System.out.println("Average: " + average);
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('NUMBERS');
      expect(result.pseudocode).toContain('SUM = 0');
      expect(result.pseudocode).toContain('loop I from 0 to SIZE(NUMBERS) - 1');
      expect(result.pseudocode).toContain('SUM = SUM + NUMBERS[I]');
      expect(result.pseudocode).toContain('AVERAGE = SUM div SIZE(NUMBERS)');
      expect(result.pseudocode).toContain('end loop');
    });

    test('should convert string manipulation program', () => {
      const javaCode = `
        public class StringManipulator {
          public static void main(String[] args) {
            String firstName = "John";
            String lastName = "Doe";
            String fullName = firstName + " " + lastName;
            
            System.out.println("Full name: " + fullName);
            System.out.println("Length: " + fullName.length());
            System.out.println("Uppercase: " + fullName.toUpperCase());
            
            if (fullName.equals("John Doe")) {
              System.out.println("Name matches!");
            }
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('FIRST_NAME = "John"');
      expect(result.pseudocode).toContain('LAST_NAME = "Doe"');
      expect(result.pseudocode).toContain('FULL_NAME = FIRST_NAME + " " + LAST_NAME');
      expect(result.pseudocode).toContain('LENGTH(FULL_NAME)');
      expect(result.pseudocode).toContain('UPPER(FULL_NAME)');
      expect(result.pseudocode).toContain('if FULL_NAME = "John Doe" then');
    });

    test('should convert factorial calculation program', () => {
      const javaCode = `
        public class FactorialCalculator {
          public static int factorial(int n) {
            if (n <= 1) {
              return 1;
            } else {
              return n * factorial(n - 1);
            }
          }
          
          public static void main(String[] args) {
            int number = 5;
            int result = factorial(number);
            System.out.println("Factorial of " + number + " is " + result);
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('FUNCTION FACTORIAL(N)');
      expect(result.pseudocode).toContain('if N <= 1 then');
      expect(result.pseudocode).toContain('RETURN 1');
      expect(result.pseudocode).toContain('RETURN N * FACTORIAL(N - 1)');
      expect(result.pseudocode).toContain('END FUNCTION');
      expect(result.pseudocode).toContain('NUMBER = 5');
      expect(result.pseudocode).toContain('RESULT = FACTORIAL(NUMBER)');
    });

    test('should convert number guessing game logic', () => {
      const javaCode = `
        public class NumberGuessingGame {
          public static void main(String[] args) {
            int secretNumber = 42;
            int guess = 35;
            int attempts = 1;
            
            while (guess != secretNumber) {
              if (guess < secretNumber) {
                System.out.println("Too low!");
              } else {
                System.out.println("Too high!");
              }
              
              attempts = attempts + 1;
              guess = guess + 1; // Simplified for testing
            }
            
            System.out.println("Correct! It took " + attempts + " attempts.");
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('SECRET_NUMBER = 42');
      expect(result.pseudocode).toContain('GUESS = 35');
      expect(result.pseudocode).toContain('ATTEMPTS = 1');
      expect(result.pseudocode).toContain('loop while GUESS ≠ SECRET_NUMBER');
      expect(result.pseudocode).toContain('if GUESS < SECRET_NUMBER then');
      expect(result.pseudocode).toContain('output "Too low!"');
      expect(result.pseudocode).toContain('output "Too high!"');
      expect(result.pseudocode).toContain('ATTEMPTS = ATTEMPTS + 1');
      expect(result.pseudocode).toContain('end loop');
    });
  });

  describe('Complex Nested Structures', () => {
    test('should handle deeply nested if-else chains', () => {
      const javaCode = `
        public class NestedConditions {
          public static void main(String[] args) {
            int x = 10;
            int y = 5;
            
            if (x > 0) {
              if (y > 0) {
                if (x > y) {
                  System.out.println("x is positive and greater than y");
                } else {
                  System.out.println("x is positive but not greater than y");
                }
              } else {
                System.out.println("x is positive but y is not");
              }
            } else {
              System.out.println("x is not positive");
            }
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('if X > 0 then');
      expect(result.pseudocode).toContain('if Y > 0 then');
      expect(result.pseudocode).toContain('if X > Y then');
      
      // Count the number of 'end if' statements
      const endIfCount = (result.pseudocode.match(/end if/g) || []).length;
      expect(endIfCount).toBe(3); // Should have 3 nested if statements
    });

    test('should handle nested loops with complex conditions', () => {
      const javaCode = `
        public class NestedLoops {
          public static void main(String[] args) {
            for (int i = 1; i <= 3; i++) {
              for (int j = 1; j <= 3; j++) {
                if (i == j) {
                  System.out.println("Diagonal: " + i + "," + j);
                } else {
                  System.out.println("Off-diagonal: " + i + "," + j);
                }
              }
            }
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.pseudocode).toContain('loop I from 1 to 3');
      expect(result.pseudocode).toContain('loop J from 1 to 3');
      expect(result.pseudocode).toContain('if I = J then');
      
      // Should have proper nesting with correct number of end statements
      const endLoopCount = (result.pseudocode.match(/end loop/g) || []).length;
      expect(endLoopCount).toBe(2); // Two nested loops
    });
  });
});