/**
 * Tests for Object-Oriented Programming transformation features
 */

import { ASTTransformer } from '../src/transformer';
import { Parser, ClassDeclarationNode, MethodDeclarationNode } from '../src/parser';
import { Lexer } from '../src/lexer';
import { NodeType } from '../src/types';

describe('OOP Transformation', () => {
  let transformer: ASTTransformer;

  beforeEach(() => {
    transformer = new ASTTransformer();
  });

  describe('Class Declaration Transformation', () => {
    test('should transform simple class declaration', () => {
      const javaCode = `
        class MyClass {
          int field;
          
          void method() {
            field = 5;
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast } = parser.parse();

      expect(ast).not.toBeNull();
      const { pseudocodeAST } = transformer.transform(ast!);

      const pseudocodeLines = pseudocodeAST.map(node => node.content);
      
      expect(pseudocodeLines).toContain('// CLASS MY_CLASS');
      expect(pseudocodeLines).toContain('// Class fields');
      expect(pseudocodeLines).toContain('FIELD');
      expect(pseudocodeLines).toContain('PROCEDURE METHOD()');
      expect(pseudocodeLines).toContain('FIELD = 5');
      expect(pseudocodeLines).toContain('END PROCEDURE');
      expect(pseudocodeLines).toContain('// END CLASS MY_CLASS');
    });

    test('should transform class with inheritance', () => {
      const javaCode = `
        class ChildClass extends ParentClass {
          void childMethod() {
            // child method implementation
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast } = parser.parse();

      expect(ast).not.toBeNull();
      const { pseudocodeAST } = transformer.transform(ast!);

      const pseudocodeLines = pseudocodeAST.map(node => node.content);
      
      expect(pseudocodeLines).toContain('// CLASS CHILD_CLASS INHERITS FROM PARENT_CLASS');
      expect(pseudocodeLines).toContain('PROCEDURE CHILD_METHOD()');
      expect(pseudocodeLines).toContain('END PROCEDURE');
      expect(pseudocodeLines).toContain('// END CLASS CHILD_CLASS');
    });

    test('should transform class with multiple methods and fields', () => {
      const javaCode = `
        class Calculator {
          int result;
          boolean isActive;
          
          void setResult(int value) {
            result = value;
          }
          
          int getResult() {
            return result;
          }
          
          void activate() {
            isActive = true;
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast } = parser.parse();

      expect(ast).not.toBeNull();
      const { pseudocodeAST } = transformer.transform(ast!);

      const pseudocodeLines = pseudocodeAST.map(node => node.content);
      
      expect(pseudocodeLines).toContain('// CLASS CALCULATOR');
      expect(pseudocodeLines).toContain('// Class fields');
      expect(pseudocodeLines).toContain('RESULT');
      expect(pseudocodeLines).toContain('IS_ACTIVE');
      expect(pseudocodeLines).toContain('PROCEDURE SET_RESULT(VALUE)');
      expect(pseudocodeLines).toContain('FUNCTION GET_RESULT()');
      expect(pseudocodeLines).toContain('RETURN RESULT');
      expect(pseudocodeLines).toContain('END FUNCTION');
      expect(pseudocodeLines).toContain('PROCEDURE ACTIVATE()');
      expect(pseudocodeLines).toContain('IS_ACTIVE = TRUE');
      expect(pseudocodeLines).toContain('// END CLASS CALCULATOR');
    });
  });

  describe('Static Method Transformation', () => {
    test('should transform static void method', () => {
      const javaCode = `
        class MathUtils {
          public static void printMessage() {
            System.out.println("Hello from static method");
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast } = parser.parse();

      expect(ast).not.toBeNull();
      const { pseudocodeAST } = transformer.transform(ast!);

      const pseudocodeLines = pseudocodeAST.map(node => node.content);
      
      expect(pseudocodeLines).toContain('// CLASS MATH_UTILS');
      expect(pseudocodeLines).toContain('// Static method');
      expect(pseudocodeLines).toContain('PROCEDURE PRINT_MESSAGE()');
      expect(pseudocodeLines).toContain('output "Hello from static method"');
      expect(pseudocodeLines).toContain('END PROCEDURE');
    });

    test('should transform static function with return value', () => {
      const javaCode = `
        class MathUtils {
          public static int add(int a, int b) {
            return a + b;
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast } = parser.parse();

      expect(ast).not.toBeNull();
      const { pseudocodeAST } = transformer.transform(ast!);

      const pseudocodeLines = pseudocodeAST.map(node => node.content);
      
      expect(pseudocodeLines).toContain('// CLASS MATH_UTILS');
      expect(pseudocodeLines).toContain('// Static method');
      expect(pseudocodeLines).toContain('FUNCTION ADD(A, B)');
      expect(pseudocodeLines).toContain('RETURN A + B');
      expect(pseudocodeLines).toContain('END FUNCTION');
    });

    test('should transform main method as static', () => {
      const javaCode = `
        class MainClass {
          public static void main(String[] args) {
            int x = 10;
            System.out.println(x);
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast, errors } = parser.parse();

      expect(errors).toHaveLength(0);
      expect(ast).not.toBeNull();
      
      // Debug: check the parsed AST structure
      const classDecl = ast!.declarations[0] as ClassDeclarationNode;
      expect(classDecl.methods).toHaveLength(1);
      expect(classDecl.methods[0].name).toBe('main');
      expect(classDecl.methods[0].isStatic).toBe(true);

      const { pseudocodeAST } = transformer.transform(ast!);

      const pseudocodeLines = pseudocodeAST.map(node => node.content);
      
      expect(pseudocodeLines).toContain('// CLASS MAIN_CLASS');
      expect(pseudocodeLines).toContain('// Static method');
      expect(pseudocodeLines).toContain('PROCEDURE MAIN(ARGS)');
      expect(pseudocodeLines).toContain('X = 10');
      expect(pseudocodeLines).toContain('output X');
      expect(pseudocodeLines).toContain('END PROCEDURE');
    });
  });

  describe('Complex OOP Scenarios', () => {
    test('should transform class with both static and instance methods', () => {
      const javaCode = `
        class Employee {
          String name;
          int salary;
          
          public static int getMinimumWage() {
            return 15000;
          }
          
          public void setName(String newName) {
            name = newName;
          }
          
          public int calculateBonus() {
            return salary * 10 / 100;
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast } = parser.parse();

      expect(ast).not.toBeNull();
      const { pseudocodeAST } = transformer.transform(ast!);

      const pseudocodeLines = pseudocodeAST.map(node => node.content);
      
      expect(pseudocodeLines).toContain('// CLASS EMPLOYEE');
      expect(pseudocodeLines).toContain('// Class fields');
      expect(pseudocodeLines).toContain('NAME');
      expect(pseudocodeLines).toContain('SALARY');
      
      // Static method
      expect(pseudocodeLines).toContain('// Static method');
      expect(pseudocodeLines).toContain('FUNCTION GET_MINIMUM_WAGE()');
      expect(pseudocodeLines).toContain('RETURN 15000');
      expect(pseudocodeLines).toContain('END FUNCTION');
      
      // Instance methods
      expect(pseudocodeLines).toContain('PROCEDURE SET_NAME(NEW_NAME)');
      expect(pseudocodeLines).toContain('NAME = NEW_NAME');
      expect(pseudocodeLines).toContain('END PROCEDURE');
      
      expect(pseudocodeLines).toContain('FUNCTION CALCULATE_BONUS()');
      expect(pseudocodeLines).toContain('RETURN SALARY * 10 div 100');
      expect(pseudocodeLines).toContain('END FUNCTION');
    });

    test('should transform inheritance with method overriding', () => {
      const javaCode = `
        class Animal {
          String name;
          
          void makeSound() {
            System.out.println("Some generic animal sound");
          }
        }
        
        class Dog extends Animal {
          void makeSound() {
            System.out.println("Woof!");
          }
          
          void wagTail() {
            System.out.println("Wagging tail");
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast } = parser.parse();

      expect(ast).not.toBeNull();
      const { pseudocodeAST } = transformer.transform(ast!);

      const pseudocodeLines = pseudocodeAST.map(node => node.content);
      
      // Animal class
      expect(pseudocodeLines).toContain('// CLASS ANIMAL');
      expect(pseudocodeLines).toContain('NAME');
      expect(pseudocodeLines).toContain('PROCEDURE MAKE_SOUND()');
      expect(pseudocodeLines).toContain('output "Some generic animal sound"');
      expect(pseudocodeLines).toContain('// END CLASS ANIMAL');
      
      // Dog class with inheritance
      expect(pseudocodeLines).toContain('// CLASS DOG INHERITS FROM ANIMAL');
      expect(pseudocodeLines).toContain('PROCEDURE MAKE_SOUND()');
      expect(pseudocodeLines).toContain('output "Woof!"');
      expect(pseudocodeLines).toContain('PROCEDURE WAG_TAIL()');
      expect(pseudocodeLines).toContain('output "Wagging tail"');
      expect(pseudocodeLines).toContain('// END CLASS DOG');
    });

    test('should handle class with constructor-like method', () => {
      const javaCode = `
        class Person {
          String name;
          int age;
          
          void initialize(String personName, int personAge) {
            name = personName;
            age = personAge;
          }
          
          void displayInfo() {
            System.out.println("Name: " + name);
            System.out.println("Age: " + age);
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast } = parser.parse();

      expect(ast).not.toBeNull();
      const { pseudocodeAST } = transformer.transform(ast!);

      const pseudocodeLines = pseudocodeAST.map(node => node.content);
      
      expect(pseudocodeLines).toContain('// CLASS PERSON');
      expect(pseudocodeLines).toContain('NAME');
      expect(pseudocodeLines).toContain('AGE');
      expect(pseudocodeLines).toContain('PROCEDURE INITIALIZE(PERSON_NAME, PERSON_AGE)');
      expect(pseudocodeLines).toContain('NAME = PERSON_NAME');
      expect(pseudocodeLines).toContain('AGE = PERSON_AGE');
      expect(pseudocodeLines).toContain('PROCEDURE DISPLAY_INFO()');
      expect(pseudocodeLines).toContain('output "Name: " + NAME');
      expect(pseudocodeLines).toContain('output "Age: " + AGE');
    });
  });

  describe('Parser Integration', () => {
    test('should parse class with inheritance correctly', () => {
      const javaCode = `
        class Child extends Parent {
          void method() {}
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast, errors } = parser.parse();

      expect(errors).toHaveLength(0);
      expect(ast).not.toBeNull();
      expect(ast!.declarations).toHaveLength(1);

      const classDecl = ast!.declarations[0] as ClassDeclarationNode;
      expect(classDecl.type).toBe(NodeType.CLASS_DECLARATION);
      expect(classDecl.name).toBe('Child');
      expect(classDecl.superClass).toBe('Parent');
      expect(classDecl.methods).toHaveLength(1);
      expect(classDecl.methods[0].name).toBe('method');
    });

    test('should parse class without inheritance correctly', () => {
      const javaCode = `
        class SimpleClass {
          int field;
          void method() {}
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast, errors } = parser.parse();

      expect(errors).toHaveLength(0);
      expect(ast).not.toBeNull();

      const classDecl = ast!.declarations[0] as ClassDeclarationNode;
      expect(classDecl.type).toBe(NodeType.CLASS_DECLARATION);
      expect(classDecl.name).toBe('SimpleClass');
      expect(classDecl.superClass).toBeUndefined();
      expect(classDecl.fields).toHaveLength(1);
      expect(classDecl.methods).toHaveLength(1);
    });

    test('should parse static methods correctly', () => {
      const javaCode = `
        class Utils {
          public static int calculate(int x) {
            return x * 2;
          }
        }
      `;

      const lexer = new Lexer(javaCode);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { ast, errors } = parser.parse();

      expect(errors).toHaveLength(0);
      expect(ast).not.toBeNull();

      const classDecl = ast!.declarations[0] as ClassDeclarationNode;
      const method = classDecl.methods[0] as MethodDeclarationNode;
      
      expect(method.isStatic).toBe(true);
      expect(method.isPublic).toBe(true);
      expect(method.isVoid).toBe(false);
      expect(method.returnType).toBe('int');
      expect(method.name).toBe('calculate');
      expect(method.parameters).toHaveLength(1);
      expect(method.parameters[0].name).toBe('x');
    });
  });
});