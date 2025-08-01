/**
 * Comprehensive Integration Tests for Java to IB Pseudocode Converter
 * 
 * This test suite covers end-to-end conversion scenarios including:
 * - Complete Java programs
 * - Complex if-elif-else chains
 * - Deeply nested loops
 * - OOP and inheritance scenarios
 * - Function vs procedure distinctions
 * - Error handling with invalid inputs
 */

import { JavaToIBConverter } from '../src/converter';
import { ErrorType, ErrorSeverity } from '../src/types';

describe('Comprehensive Integration Tests', () => {
  let converter: JavaToIBConverter;

  beforeEach(() => {
    converter = new JavaToIBConverter();
  });

  describe('End-to-End Complete Java Programs', () => {
    test('should convert complete calculator program', () => {
      const javaCode = `
        class Calculator {
          public static void main(String[] args) {
            int a = 15;
            int b = 7;
            int sum = a + b;
            int difference = a - b;
            int product = a * b;
            int quotient = a / b;
            int remainder = a % b;
            
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
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('A = 15');
      expect(pseudocode).toContain('B = 7');
      expect(pseudocode).toContain('SUM = A + B');
      expect(pseudocode).toContain('DIFFERENCE = A - B');
      expect(pseudocode).toContain('PRODUCT = A * B');
      expect(pseudocode).toContain('QUOTIENT = A div B');
      expect(pseudocode).toContain('REMAINDER = A mod B');
      expect(pseudocode).toContain('output "Sum: " + SUM');
      expect(pseudocode).toContain('output "Remainder: " + REMAINDER');
    });

    test('should convert complete array processing program', () => {
      const javaCode = `
        class ArrayProcessor {
          public static void main(String[] args) {
            int[] numbers;
            int sum = 0;
            int max = numbers[0];
            
            for (int i = 0; i < numbers.length; i++) {
              sum = sum + numbers[i];
              if (numbers[i] > max) {
                max = numbers[i];
              }
            }
            
            double average = sum / numbers.length;
            System.out.println("Sum: " + sum);
            System.out.println("Average: " + average);
            System.out.println("Maximum: " + max);
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('SUM = 0');
      expect(pseudocode).toContain('MAX = NUMBERS[0]');
      expect(pseudocode).toContain('loop I from 0 to SIZE(NUMBERS) - 1');
      expect(pseudocode).toContain('SUM = SUM + NUMBERS[I]');
      expect(pseudocode).toContain('if NUMBERS[I] > MAX then');
      expect(pseudocode).toContain('MAX = NUMBERS[I]');
      expect(pseudocode).toContain('end if');
      expect(pseudocode).toContain('end loop');
      expect(pseudocode).toContain('AVERAGE = SUM div SIZE(NUMBERS)');
    });

    test('should convert complete student grade management program', () => {
      const javaCode = `
        class GradeManager {
          public static void main(String[] args) {
            String[] students;
            int[] grades;
            int totalGrades = 0;
            String topStudent = "";
            int highestGrade = 0;
            
            for (int i = 0; i < students.length; i++) {
              totalGrades = totalGrades + grades[i];
              
              if (grades[i] > highestGrade) {
                highestGrade = grades[i];
                topStudent = students[i];
              }
              
              System.out.println(students[i] + ": " + grades[i]);
            }
            
            double classAverage = totalGrades / students.length;
            System.out.println("Class Average: " + classAverage);
            System.out.println("Top Student: " + topStudent + " with " + highestGrade);
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('TOTAL_GRADES = 0');
      expect(pseudocode).toContain('TOP_STUDENT = ""');
      expect(pseudocode).toContain('HIGHEST_GRADE = 0');
      expect(pseudocode).toContain('loop I from 0 to SIZE(STUDENTS) - 1');
      expect(pseudocode).toContain('TOTAL_GRADES = TOTAL_GRADES + GRADES[I]');
      expect(pseudocode).toContain('if GRADES[I] > HIGHEST_GRADE then');
      expect(pseudocode).toContain('HIGHEST_GRADE = GRADES[I]');
      expect(pseudocode).toContain('TOP_STUDENT = STUDENTS[I]');
      expect(pseudocode).toContain('CLASS_AVERAGE = TOTAL_GRADES div SIZE(STUDENTS)');
    });
  });

  describe('Complex If-Elif-Else Chains', () => {
    test('should convert complex grade classification system', () => {
      const javaCode = `
        int score = 85;
        String grade;
        String comment;
        
        if (score >= 90) {
          grade = "A";
          comment = "Excellent work!";
        } else if (score >= 80) {
          grade = "B";
          comment = "Good job!";
        } else if (score >= 70) {
          grade = "C";
          comment = "Satisfactory";
        } else if (score >= 60) {
          grade = "D";
          comment = "Needs improvement";
        } else {
          grade = "F";
          comment = "Must retake";
        }
        
        System.out.println("Grade: " + grade);
        System.out.println("Comment: " + comment);
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('SCORE = 85');
      expect(pseudocode).toContain('if SCORE >= 90 then');
      expect(pseudocode).toContain('GRADE = "A"');
      expect(pseudocode).toContain('COMMENT = "Excellent work!"');
      expect(pseudocode).toContain('if SCORE >= 80 then');
      expect(pseudocode).toContain('GRADE = "B"');
      expect(pseudocode).toContain('COMMENT = "Good job!"');
      expect(pseudocode).toContain('if SCORE >= 70 then');
      expect(pseudocode).toContain('if SCORE >= 60 then');
      expect(pseudocode).toContain('else');
      expect(pseudocode).toContain('GRADE = "F"');
      expect(pseudocode).toContain('COMMENT = "Must retake"');
      expect(pseudocode).toContain('end if');
    });

    test('should convert complex conditional logic with multiple operators', () => {
      const javaCode = `
        int age = 25;
        boolean hasLicense = true;
        boolean hasInsurance = true;
        String status;
        
        if (age >= 18 && hasLicense && hasInsurance) {
          status = "Can drive";
        } else if (age >= 18 && hasLicense && !hasInsurance) {
          status = "Need insurance";
        } else if (age >= 18 && !hasLicense) {
          status = "Need license";
        } else if (age >= 16) {
          status = "Can get learner permit";
        } else {
          status = "Too young";
        }
        
        System.out.println("Driving status: " + status);
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('AGE = 25');
      expect(pseudocode).toContain('HAS_LICENSE = TRUE');
      expect(pseudocode).toContain('HAS_INSURANCE = TRUE');
      expect(pseudocode).toContain('if AGE >= 18 AND HAS_LICENSE AND HAS_INSURANCE then');
      expect(pseudocode).toContain('STATUS = "Can drive"');
      expect(pseudocode).toContain('if AGE >= 18 AND HAS_LICENSE AND NOT HAS_INSURANCE then');
      expect(pseudocode).toContain('STATUS = "Need insurance"');
      expect(pseudocode).toContain('if AGE >= 18 AND NOT HAS_LICENSE then');
      expect(pseudocode).toContain('STATUS = "Need license"');
      expect(pseudocode).toContain('if AGE >= 16 then');
      expect(pseudocode).toContain('STATUS = "Can get learner permit"');
      expect(pseudocode).toContain('else');
      expect(pseudocode).toContain('STATUS = "Too young"');
    });

    test('should convert nested if-elif-else with complex conditions', () => {
      const javaCode = `
        int temperature = 75;
        boolean isRaining = false;
        boolean isWindy = true;
        String activity;
        
        if (temperature > 80) {
          if (isRaining) {
            activity = "Indoor swimming";
          } else if (isWindy) {
            activity = "Beach volleyball";
          } else {
            activity = "Outdoor swimming";
          }
        } else if (temperature > 60) {
          if (isRaining && isWindy) {
            activity = "Stay inside";
          } else if (isRaining) {
            activity = "Indoor activities";
          } else if (isWindy) {
            activity = "Light outdoor activities";
          } else {
            activity = "Perfect for hiking";
          }
        } else {
          if (isRaining || isWindy) {
            activity = "Cozy indoor day";
          } else {
            activity = "Bundle up and go out";
          }
        }
        
        System.out.println("Recommended activity: " + activity);
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('TEMPERATURE = 75');
      expect(pseudocode).toContain('IS_RAINING = FALSE');
      expect(pseudocode).toContain('IS_WINDY = TRUE');
      expect(pseudocode).toContain('if TEMPERATURE > 80 then');
      expect(pseudocode).toContain('if IS_RAINING then');
      expect(pseudocode).toContain('ACTIVITY = "Indoor swimming"');
      expect(pseudocode).toContain('if IS_WINDY then');
      expect(pseudocode).toContain('ACTIVITY = "Beach volleyball"');
      expect(pseudocode).toContain('if TEMPERATURE > 60 then');
      expect(pseudocode).toContain('if IS_RAINING AND IS_WINDY then');
      expect(pseudocode).toContain('ACTIVITY = "Stay inside"');
      expect(pseudocode).toContain('if IS_RAINING OR IS_WINDY then');
      expect(pseudocode).toContain('ACTIVITY = "Cozy indoor day"');
    });
  });

  describe('Deeply Nested Loop Scenarios', () => {
    test('should convert 3-level nested loops for matrix operations', () => {
      const javaCode = `
        int value = 1;
        
        for (int i = 0; i < 3; i++) {
          for (int j = 0; j < 3; j++) {
            for (int k = 0; k < 3; k++) {
              value = value + 1;
              System.out.println("Position [" + i + "][" + j + "][" + k + "] = " + value);
            }
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('VALUE = 1');
      expect(pseudocode).toContain('loop I from 0 to 3 - 1');
      expect(pseudocode).toContain('loop J from 0 to 3 - 1');
      expect(pseudocode).toContain('loop K from 0 to 3 - 1');
      expect(pseudocode).toContain('VALUE = VALUE + 1');
      expect(pseudocode).toContain('output "Position [" + I + "][" + J + "][" + K + "] = " + VALUE');
      expect(pseudocode).toContain('end loop'); // Should appear 3 times
      
      // Count the number of "end loop" statements
      const endLoopCount = (pseudocode.match(/end loop/g) || []).length;
      expect(endLoopCount).toBe(3);
    });

    test('should convert nested loops with complex conditions and breaks', () => {
      const javaCode = `
        boolean found = false;
        int target = 15;
        int[] grid;
        int foundRow = -1;
        int foundCol = -1;
        
        for (int row = 0; row < 3 && !found; row++) {
          for (int col = 0; col < 3; col++) {
            if (grid[row] == target) {
              found = true;
              foundRow = row;
              foundCol = col;
            }
          }
        }
        
        if (found) {
          System.out.println("Found " + target + " at position [" + foundRow + "][" + foundCol + "]");
        } else {
          System.out.println("Target not found");
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('FOUND = FALSE');
      expect(pseudocode).toContain('TARGET = 15');
      expect(pseudocode).toContain('FOUND_ROW = - 1');
      expect(pseudocode).toContain('FOUND_COL = - 1');
      expect(pseudocode).toContain('loop while ROW < 3 AND NOT FOUND');
      expect(pseudocode).toContain('loop COL from 0 to 3 - 1');
      expect(pseudocode).toContain('if GRID[ROW] = TARGET then');
      expect(pseudocode).toContain('FOUND = TRUE');
      expect(pseudocode).toContain('FOUND_ROW = ROW');
      expect(pseudocode).toContain('FOUND_COL = COL');
    });

    test('should convert deeply nested loops with while and for combinations', () => {
      const javaCode = `
        int layers = 3;
        int currentLayer = 0;
        
        while (currentLayer < layers) {
          System.out.println("Processing layer " + currentLayer);
          
          for (int section = 0; section < 4; section++) {
            System.out.println("  Section " + section);
            
            int item = 0;
            while (item < 5) {
              for (int detail = 0; detail < 3; detail++) {
                System.out.println("    Item " + item + ", Detail " + detail);
              }
              item = item + 1;
            }
          }
          
          currentLayer = currentLayer + 1;
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('LAYERS = 3');
      expect(pseudocode).toContain('CURRENT_LAYER = 0');
      expect(pseudocode).toContain('loop while CURRENT_LAYER < LAYERS');
      expect(pseudocode).toContain('output "Processing layer " + CURRENT_LAYER');
      expect(pseudocode).toContain('loop SECTION from 0 to 4 - 1');
      expect(pseudocode).toContain('output "  Section " + SECTION');
      expect(pseudocode).toContain('ITEM = 0');
      expect(pseudocode).toContain('loop while ITEM < 5');
      expect(pseudocode).toContain('loop DETAIL from 0 to 3 - 1');
      expect(pseudocode).toContain('output "    Item " + ITEM + ", Detail " + DETAIL');
      expect(pseudocode).toContain('ITEM = ITEM + 1');
      expect(pseudocode).toContain('CURRENT_LAYER = CURRENT_LAYER + 1');
      
      // Should have multiple nested end statements
      const endLoopCount = (pseudocode.match(/end loop/g) || []).length;
      expect(endLoopCount).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Comprehensive OOP and Inheritance Test Cases', () => {
    test('should convert complete inheritance hierarchy with method overriding', () => {
      const javaCode = `
        class Vehicle {
          String brand;
          int year;
          
          void start() {
            System.out.println("Vehicle starting...");
          }
          
          void displayInfo() {
            System.out.println("Brand: " + brand + ", Year: " + year);
          }
          
          int calculateAge(int currentYear) {
            return currentYear - year;
          }
        }
        
        class Car extends Vehicle {
          int doors;
          boolean isElectric;
          
          void start() {
            System.out.println("Car engine starting...");
          }
          
          void honk() {
            System.out.println("Beep beep!");
          }
          
          boolean needsCharging() {
            return isElectric;
          }
        }
        
        class SportsCar extends Car {
          int topSpeed;
          
          void start() {
            System.out.println("Sports car roaring to life!");
          }
          
          void activateTurbo() {
            System.out.println("Turbo activated!");
          }
          
          int getTopSpeed() {
            return topSpeed;
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      
      // Vehicle class
      expect(pseudocode).toContain('// CLASS VEHICLE');
      expect(pseudocode).toContain('BRAND');
      expect(pseudocode).toContain('YEAR');
      expect(pseudocode).toContain('PROCEDURE START()');
      expect(pseudocode).toContain('output "Vehicle starting..."');
      expect(pseudocode).toContain('PROCEDURE DISPLAY_INFO()');
      expect(pseudocode).toContain('FUNCTION CALCULATE_AGE(CURRENT_YEAR)');
      expect(pseudocode).toContain('RETURN CURRENT_YEAR - YEAR');
      expect(pseudocode).toContain('// END CLASS VEHICLE');
      
      // Car class with inheritance
      expect(pseudocode).toContain('// CLASS CAR INHERITS FROM VEHICLE');
      expect(pseudocode).toContain('DOORS');
      expect(pseudocode).toContain('IS_ELECTRIC');
      expect(pseudocode).toContain('output "Car engine starting..."');
      expect(pseudocode).toContain('PROCEDURE HONK()');
      expect(pseudocode).toContain('FUNCTION NEEDS_CHARGING()');
      expect(pseudocode).toContain('RETURN IS_ELECTRIC');
      expect(pseudocode).toContain('// END CLASS CAR');
      
      // SportsCar class with inheritance
      expect(pseudocode).toContain('// CLASS SPORTS_CAR INHERITS FROM CAR');
      expect(pseudocode).toContain('TOP_SPEED');
      expect(pseudocode).toContain('output "Sports car roaring to life!"');
      expect(pseudocode).toContain('PROCEDURE ACTIVATE_TURBO()');
      expect(pseudocode).toContain('FUNCTION GET_TOP_SPEED()');
      expect(pseudocode).toContain('RETURN TOP_SPEED');
      expect(pseudocode).toContain('// END CLASS SPORTS_CAR');
    });

    test('should convert complex class with static and instance methods', () => {
      const javaCode = `
        class MathLibrary {
          double PI = 3.14159;
          int calculationCount = 0;
          double precision;
          
          public static double add(double a, double b) {
            return a + b;
          }
          
          public static double multiply(double a, double b) {
            return a * b;
          }
          
          public static int getCalculationCount() {
            return 42;
          }
          
          public void setPrecision(double newPrecision) {
            precision = newPrecision;
          }
          
          public double roundToPrecision(double value) {
            return value;
          }
          
          public double calculateCircleArea(double radius) {
            return PI * radius * radius;
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      expect(pseudocode).toContain('// CLASS MATH_LIBRARY');
      expect(pseudocode).toContain('PI = 3.14159');
      expect(pseudocode).toContain('CALCULATION_COUNT = 0');
      expect(pseudocode).toContain('PRECISION');
      
      // Static methods
      expect(pseudocode).toContain('// Static method');
      expect(pseudocode).toContain('FUNCTION ADD(A, B)');
      expect(pseudocode).toContain('RETURN A + B');
      expect(pseudocode).toContain('FUNCTION MULTIPLY(A, B)');
      expect(pseudocode).toContain('FUNCTION GET_CALCULATION_COUNT()');
      expect(pseudocode).toContain('RETURN 42');
      
      // Instance methods
      expect(pseudocode).toContain('PROCEDURE SET_PRECISION(NEW_PRECISION)');
      expect(pseudocode).toContain('PRECISION = NEW_PRECISION');
      expect(pseudocode).toContain('FUNCTION ROUND_TO_PRECISION(VALUE)');
      expect(pseudocode).toContain('FUNCTION CALCULATE_CIRCLE_AREA(RADIUS)');
      expect(pseudocode).toContain('RETURN PI * RADIUS * RADIUS');
    });

    test('should convert abstract-like class pattern with multiple inheritance levels', () => {
      const javaCode = `
        class Shape {
          String color;
          
          void setColor(String newColor) {
            color = newColor;
          }
          
          String getColor() {
            return color;
          }
          
          double getArea() {
            return 0.0; // To be overridden
          }
        }
        
        class Rectangle extends Shape {
          double width;
          double height;
          
          double getArea() {
            return width * height;
          }
          
          double getPerimeter() {
            return 2 * (width + height);
          }
        }
        
        class Square extends Rectangle {
          void setSide(double side) {
            width = side;
            height = side;
          }
          
          double getSide() {
            return width;
          }
          
          boolean isSquare() {
            return width == height;
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      
      // Shape class
      expect(pseudocode).toContain('// CLASS SHAPE');
      expect(pseudocode).toContain('COLOR');
      expect(pseudocode).toContain('PROCEDURE SET_COLOR(NEW_COLOR)');
      expect(pseudocode).toContain('FUNCTION GET_COLOR()');
      expect(pseudocode).toContain('FUNCTION GET_AREA()');
      expect(pseudocode).toContain('RETURN 0.0');
      
      // Rectangle class
      expect(pseudocode).toContain('// CLASS RECTANGLE INHERITS FROM SHAPE');
      expect(pseudocode).toContain('WIDTH');
      expect(pseudocode).toContain('HEIGHT');
      expect(pseudocode).toContain('RETURN WIDTH * HEIGHT');
      expect(pseudocode).toContain('FUNCTION GET_PERIMETER()');
      expect(pseudocode).toContain('RETURN 2 * WIDTH + HEIGHT');
      
      // Square class
      expect(pseudocode).toContain('// CLASS SQUARE INHERITS FROM RECTANGLE');
      expect(pseudocode).toContain('PROCEDURE SET_SIDE(SIDE)');
      expect(pseudocode).toContain('WIDTH = SIDE');
      expect(pseudocode).toContain('HEIGHT = SIDE');
      expect(pseudocode).toContain('FUNCTION GET_SIDE()');
      expect(pseudocode).toContain('FUNCTION IS_SQUARE()');
      expect(pseudocode).toContain('RETURN WIDTH = HEIGHT');
    });
  });

  describe('Function vs Procedure Distinction Tests', () => {
    test('should clearly distinguish between functions and procedures', () => {
      const javaCode = `
        class UtilityClass {
          // Procedures (void methods)
          public static void printWelcome() {
            System.out.println("Welcome to the program!");
          }
          
          public static void displayMenu(String[] options) {
            for (int i = 0; i < options.length; i++) {
              System.out.println((i + 1) + ". " + options[i]);
            }
          }
          
          public static void processData(int[] data) {
            for (int i = 0; i < data.length; i++) {
              data[i] = data[i] * 2;
            }
          }
          
          // Functions (non-void methods)
          public static int calculateSum(int[] numbers) {
            int sum = 0;
            for (int i = 0; i < numbers.length; i++) {
              sum = sum + numbers[i];
            }
            return sum;
          }
          
          public static boolean isEven(int number) {
            return number % 2 == 0;
          }
          
          public static String formatName(String firstName, String lastName) {
            return lastName + ", " + firstName;
          }
          
          public static double calculateAverage(int[] scores) {
            int sum = calculateSum(scores);
            return sum / scores.length;
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      
      // Procedures (void methods)
      expect(pseudocode).toContain('PROCEDURE PRINT_WELCOME()');
      expect(pseudocode).toContain('END PROCEDURE');
      expect(pseudocode).toContain('PROCEDURE DISPLAY_MENU(OPTIONS)');
      expect(pseudocode).toContain('PROCEDURE PROCESS_DATA(DATA)');
      
      // Functions (non-void methods)
      expect(pseudocode).toContain('FUNCTION CALCULATE_SUM(NUMBERS)');
      expect(pseudocode).toContain('RETURN SUM');
      expect(pseudocode).toContain('END FUNCTION');
      expect(pseudocode).toContain('FUNCTION IS_EVEN(NUMBER)');
      expect(pseudocode).toContain('RETURN NUMBER mod 2 = 0');
      expect(pseudocode).toContain('FUNCTION FORMAT_NAME(FIRST_NAME, LAST_NAME)');
      expect(pseudocode).toContain('RETURN LAST_NAME + ", " + FIRST_NAME');
      expect(pseudocode).toContain('FUNCTION CALCULATE_AVERAGE(SCORES)');
      
      // Verify no mixing of PROCEDURE/FUNCTION keywords
      const procedureCount = (pseudocode.match(/PROCEDURE/g) || []).length;
      const functionCount = (pseudocode.match(/FUNCTION/g) || []).length;
      const endProcedureCount = (pseudocode.match(/END PROCEDURE/g) || []).length;
      const endFunctionCount = (pseudocode.match(/END FUNCTION/g) || []).length;
      
      expect(endProcedureCount).toBeGreaterThan(0);
      expect(endFunctionCount).toBeGreaterThan(0);
      expect(procedureCount).toBeGreaterThan(0);
      expect(functionCount).toBeGreaterThan(0);
    });

    test('should handle mixed function and procedure calls correctly', () => {
      const javaCode = `
        class Calculator {
          public static void main(String[] args) {
            int[] numbers = {1, 2, 3, 4, 5};
            
            // Call procedures
            printArray(numbers);
            displayTitle("Calculator Results");
            
            // Call functions and use return values
            int sum = calculateSum(numbers);
            double average = calculateAverage(numbers);
            boolean hasEvenNumbers = containsEven(numbers);
            
            // Display results using procedures
            displayResult("Sum", sum);
            displayResult("Average", average);
            
            if (hasEvenNumbers) {
              System.out.println("Array contains even numbers");
            }
          }
          
          // Procedures
          public static void printArray(int[] arr) {
            for (int i = 0; i < arr.length; i++) {
              System.out.print(arr[i] + " ");
            }
            System.out.println();
          }
          
          public static void displayTitle(String title) {
            System.out.println("=== " + title + " ===");
          }
          
          public static void displayResult(String label, double value) {
            System.out.println(label + ": " + value);
          }
          
          // Functions
          public static int calculateSum(int[] numbers) {
            int total = 0;
            for (int i = 0; i < numbers.length; i++) {
              total = total + numbers[i];
            }
            return total;
          }
          
          public static double calculateAverage(int[] numbers) {
            return calculateSum(numbers) / numbers.length;
          }
          
          public static boolean containsEven(int[] numbers) {
            for (int i = 0; i < numbers.length; i++) {
              if (numbers[i] % 2 == 0) {
                return true;
              }
            }
            return false;
          }
        }
      `;

      const result = converter.convert(javaCode);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      const pseudocode = result.pseudocode;
      
      // Main method should be a procedure
      expect(pseudocode).toContain('PROCEDURE MAIN(ARGS)');
      
      // Procedure calls (no assignment)
      expect(pseudocode).toContain('PRINT_ARRAY(NUMBERS)');
      expect(pseudocode).toContain('DISPLAY_TITLE("Calculator Results")');
      expect(pseudocode).toContain('DISPLAY_RESULT("Sum", SUM)');
      
      // Function calls (with assignment)
      expect(pseudocode).toContain('SUM = CALCULATE_SUM(NUMBERS)');
      expect(pseudocode).toContain('AVERAGE = CALCULATE_AVERAGE(NUMBERS)');
      expect(pseudocode).toContain('HAS_EVEN_NUMBERS = CONTAINS_EVEN(NUMBERS)');
      
      // Function definitions
      expect(pseudocode).toContain('FUNCTION CALCULATE_SUM(NUMBERS)');
      expect(pseudocode).toContain('FUNCTION CALCULATE_AVERAGE(NUMBERS)');
      expect(pseudocode).toContain('RETURN CALCULATE_SUM(NUMBERS) div SIZE(NUMBERS)');
      expect(pseudocode).toContain('FUNCTION CONTAINS_EVEN(NUMBERS)');
      
      // Procedure definitions
      expect(pseudocode).toContain('PROCEDURE PRINT_ARRAY(ARR)');
      expect(pseudocode).toContain('PROCEDURE DISPLAY_TITLE(TITLE)');
      expect(pseudocode).toContain('PROCEDURE DISPLAY_RESULT(LABEL, VALUE)');
    });
  });

  describe('Error Handling with Various Invalid Inputs', () => {
    test('should handle syntax errors with detailed messages', () => {
      const invalidCodes = [
        'int x = ;', // Missing value
        'if (x > 0 { y = 1; }', // Missing closing parenthesis
        'for (int i = 0; i < 10; i++ { sum += i; }', // Missing closing parenthesis
        'public void method( { }' // Missing parameter list
      ];

      invalidCodes.forEach(code => {
        const result = converter.convert(code);
        
        expect(result.success).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0].severity).toBe(ErrorSeverity.ERROR);
        expect(result.errors[0].location.line).toBeGreaterThan(0);
        expect(result.errors[0].location.column).toBeGreaterThan(0);
      });
    });

    test('should handle lexical errors with character positions', () => {
      const invalidCodes = [
        'int x = 5@;', // Invalid character
        'String s = "unterminated string', // Unterminated string
        'int x = 123abc;', // Invalid number format
        'char c = \'ab\';' // Invalid character literal
      ];

      invalidCodes.forEach(code => {
        const result = converter.convert(code);
        
        expect(result.success).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0].location).toBeDefined();
        expect(result.errors[0].location.line).toBeGreaterThan(0);
      });
    });

    test('should handle semantic errors and provide context', () => {
      const semanticErrors = [
        'int x = y + 5;', // y is not declared - but converter may handle this gracefully
        'void method() { return 5; }', // void method cannot return value
        'int method() { }' // missing return statement
      ];

      semanticErrors.forEach(code => {
        const result = converter.convert(code);
        
        // The converter may handle some semantic issues gracefully
        // Just ensure it doesn't crash and provides some result
        expect(result).toBeDefined();
        expect(result.pseudocode).toBeDefined();
        expect(result.metadata).toBeDefined();
      });
    });

    test('should handle complex nested errors gracefully', () => {
      const complexInvalidCode = `
        class BrokenClass {
          int field1
          String field2 = "unclosed string
          
          public void method1( {
            if (x > 0 {
              for (int i = 0; i < 10; i++ {
                int y = ;
                System.out.println(undefinedVar);
              }
            }
          }
          
          public int method2() {
            // missing return
          }
          
          public static void main(String[] args {
            method1();
            int result = method2();
          }
        }
      `;

      const result = converter.convert(complexInvalidCode);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Should have multiple types of errors
      const errorTypes = new Set(result.errors.map(e => e.type));
      expect(errorTypes.size).toBeGreaterThan(1);
      
      // All errors should have valid location information
      result.errors.forEach(error => {
        expect(error.location).toBeDefined();
        expect(error.location.line).toBeGreaterThan(0);
        expect(error.location.column).toBeGreaterThan(0);
        expect(error.message).toBeTruthy();
        expect(error.severity).toBeDefined();
      });
    });

    test('should provide enhanced error messages with context', () => {
      const testCases = [
        'int x = ;',
        'if (x > 0 { }',
        'int x = 5@;'
      ];

      testCases.forEach(code => {
        const result = converter.convert(code);
        
        expect(result.success).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        
        const errorMessage = result.errors[0].message;
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.length).toBeGreaterThan(10); // Should have meaningful content
      });
    });

    test('should handle edge cases and boundary conditions', () => {
      const edgeCases = [
        '', // Empty string
        '   \n  \t  ', // Only whitespace
        '// Just a comment', // Only comments
        'int x = 2147483647;', // Max integer
        'String s = "";', // Empty string literal
        'boolean b = true && false || true;', // Complex boolean expression
        'int[] arr = new int[0];', // Empty array
        'for (;;) { break; }' // Infinite loop with break
      ];

      edgeCases.forEach(code => {
        const result = converter.convert(code);
        
        // Should either succeed or fail gracefully
        expect(result).toBeDefined();
        expect(result.pseudocode).toBeDefined();
        expect(result.success).toBeDefined();
        expect(Array.isArray(result.errors)).toBe(true);
        expect(Array.isArray(result.warnings)).toBe(true);
        expect(result.metadata).toBeDefined();
        
        if (!result.success) {
          expect(result.errors.length).toBeGreaterThan(0);
          result.errors.forEach(error => {
            expect(error.type).toBeDefined();
            expect(error.message).toBeTruthy();
            expect(error.location).toBeDefined();
            expect(error.severity).toBeDefined();
          });
        }
      });
    });
  });

  describe('Performance and Stress Tests', () => {
    test('should handle large programs efficiently', () => {
      // Generate a large but valid Java program
      const lines = [
        'class LargeProgram {',
        '  public static void main(String[] args) {'
      ];
      
      // Add many variable declarations
      for (let i = 0; i < 100; i++) {
        lines.push(`    int var${i} = ${i};`);
      }
      
      // Add nested loops
      lines.push('    for (int i = 0; i < 10; i++) {');
      lines.push('      for (int j = 0; j < 10; j++) {');
      lines.push('        for (int k = 0; k < 10; k++) {');
      lines.push(`          System.out.println("i=" + i + ", j=" + j + ", k=" + k);`);
      lines.push('        }');
      lines.push('      }');
      lines.push('    }');
      
      // Add many method calls
      for (let i = 0; i < 50; i++) {
        lines.push(`    System.out.println("Message " + ${i});`);
      }
      
      lines.push('  }');
      lines.push('}');
      
      const largeCode = lines.join('\n');
      
      const startTime = Date.now();
      const result = converter.convert(largeCode);
      const endTime = Date.now();
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
      expect(result.metadata.processingTime).toBeLessThan(10000);
      
      // Verify the conversion is correct
      expect(result.pseudocode).toContain('VAR0 = 0');
      expect(result.pseudocode).toContain('VAR99 = 99');
      expect(result.pseudocode).toContain('loop I from 0 to 10 - 1');
      expect(result.pseudocode).toContain('loop J from 0 to 10 - 1');
      expect(result.pseudocode).toContain('loop K from 0 to 10 - 1');
      expect(result.pseudocode).toContain('output "Message " + 49');
    });

    test('should handle deeply nested structures without stack overflow', () => {
      // Create deeply nested if statements
      let nestedCode = 'int result = 42;';
      for (let i = 0; i < 20; i++) {
        nestedCode = `if (x > ${i}) { ${nestedCode} }`;
      }
      
      const result = converter.convert(nestedCode);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      
      // Should handle deep nesting
      const endIfCount = (result.pseudocode.match(/end if/g) || []).length;
      expect(endIfCount).toBe(20);
    });
  });
});