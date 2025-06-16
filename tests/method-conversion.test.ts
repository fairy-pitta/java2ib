import { describe, it, expect } from 'vitest';
import { convertJavaToIB } from '../src/index';

describe('Method Conversion', () => {
  describe('Void Methods (Procedures)', () => {
    it('should convert simple void method to PROCEDURE', () => {
      const javaCode = `
        public void printMessage() {
            System.out.println("Hello");
        }
      `;
      const expected = `PROCEDURE printMessage()
    OUTPUT "Hello"
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert void method with parameters', () => {
      const javaCode = `
        public void greet(String name, int age) {
            System.out.println("Hello " + name);
        }
      `;
      const expected = `PROCEDURE greet(name, age)
    OUTPUT "Hello " + name
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert static void method', () => {
      const javaCode = `
        public static void main(String[] args) {
            System.out.println("Main method");
        }
      `;
      const expected = `PROCEDURE main(args)
    OUTPUT "Main method"
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert private void method', () => {
      const javaCode = `
        private void helper() {
            int x = 5;
        }
      `;
      const expected = `PROCEDURE helper()
    x ← 5
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Return Methods (Functions)', () => {
    it('should convert simple return method to FUNCTION', () => {
      const javaCode = `
        public int add(int a, int b) {
            return a + b;
        }
      `;
      const expected = `FUNCTION add(a, b)
    RETURN a + b
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert string return method', () => {
      const javaCode = `
        public String getName() {
            return "John";
        }
      `;
      const expected = `FUNCTION getName()
    RETURN "John"
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert boolean return method', () => {
      const javaCode = `
        public boolean isValid(int x) {
            return x > 0;
        }
      `;
      const expected = `FUNCTION isValid(x)
    RETURN x > 0
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert method with multiple return statements', () => {
      const javaCode = `
        public int max(int a, int b) {
            if (a > b) {
                return a;
            } else {
                return b;
            }
        }
      `;
      const expected = `FUNCTION max(a, b)
    IF a > b THEN
        RETURN a
    ELSE
        RETURN b
    ENDIF
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert static return method', () => {
      const javaCode = `
        public static double calculateArea(double radius) {
            return 3.14 * radius * radius;
        }
      `;
      const expected = `FUNCTION calculateArea(radius)
    RETURN 3.14 * radius * radius
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Method Calls', () => {
    it('should convert void method call', () => {
      const javaCode = 'printMessage();';
      const expected = 'printMessage()';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert method call with parameters', () => {
      const javaCode = 'greet("Alice", 25);';
      const expected = 'greet("Alice", 25)';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert function call in assignment', () => {
      const javaCode = 'int result = add(5, 3);';
      const expected = 'result ← add(5, 3)';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert nested function calls', () => {
      const javaCode = 'int result = add(multiply(2, 3), 4);';
      const expected = 'result ← add(multiply(2, 3), 4)';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert static method call', () => {
      const javaCode = 'Math.max(a, b);';
      const expected = 'Math.max(a, b)';
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Method Overloading', () => {
    it('should handle methods with same name but different parameters', () => {
      const javaCode = `
        public int add(int a, int b) {
            return a + b;
        }
        
        public double add(double a, double b) {
            return a + b;
        }
      `;
      const expected = `FUNCTION add(a, b)
    RETURN a + b
ENDFUNCTION

FUNCTION add(a, b)
    RETURN a + b
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Constructor Methods', () => {
    it('should convert simple constructor', () => {
      const javaCode = `
        public Person(String name) {
            this.name = name;
        }
      `;
      const expected = `PROCEDURE Person(name)
    this.name ← name
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert default constructor', () => {
      const javaCode = `
        public Person() {
            this.name = "Unknown";
        }
      `;
      const expected = `PROCEDURE Person()
    this.name ← "Unknown"
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });
});