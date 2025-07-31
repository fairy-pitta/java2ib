/**
 * Tests for I/O statement transformations (System.out.print/println and Scanner input)
 */

import { ASTTransformer } from '../src/transformer';
import { IBRulesEngine } from '../src/ib-rules-engine';
import { 
  NodeType, 
  SourceLocation
} from '../src/types';
import { PseudocodeNodeType } from '../src/transformer';
import {
  MethodCallNode,
  AssignmentNode,
  IdentifierNode,
  LiteralNode,
  VariableDeclarationNode
} from '../src/parser';

describe('I/O Transformation Tests', () => {
  let transformer: ASTTransformer;
  let ibRules: IBRulesEngine;
  const mockLocation: SourceLocation = { line: 1, column: 1 };

  beforeEach(() => {
    transformer = new ASTTransformer();
    ibRules = new IBRulesEngine();
  });

  describe('System.out.print/println transformation', () => {
    test('should convert System.out.println with string literal', () => {
      const methodCall: MethodCallNode = {
        type: NodeType.METHOD_CALL,
        location: mockLocation,
        object: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'System.out'
        } as IdentifierNode,
        methodName: 'println',
        arguments: [{
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '"Hello World"',
          dataType: 'string'
        } as LiteralNode]
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(methodCall, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result[0].content).toBe('output "Hello World"');
    });

    test('should convert System.out.print with variable', () => {
      const methodCall: MethodCallNode = {
        type: NodeType.METHOD_CALL,
        location: mockLocation,
        object: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'System.out'
        } as IdentifierNode,
        methodName: 'print',
        arguments: [{
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'message'
        } as IdentifierNode]
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(methodCall, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result[0].content).toBe('output MESSAGE');
    });

    test('should convert System.out.println with multiple arguments', () => {
      const methodCall: MethodCallNode = {
        type: NodeType.METHOD_CALL,
        location: mockLocation,
        object: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'System.out'
        } as IdentifierNode,
        methodName: 'println',
        arguments: [
          {
            type: NodeType.LITERAL,
            location: mockLocation,
            value: '"Name: "',
            dataType: 'string'
          } as LiteralNode,
          {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'userName'
          } as IdentifierNode
        ]
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(methodCall, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result[0].content).toBe('output "Name: ", USER_NAME');
    });

    test('should convert System.out.print with prompt message', () => {
      const methodCall: MethodCallNode = {
        type: NodeType.METHOD_CALL,
        location: mockLocation,
        object: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'System.out'
        } as IdentifierNode,
        methodName: 'print',
        arguments: [{
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '"Enter your age: "',
          dataType: 'string'
        } as LiteralNode]
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(methodCall, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result[0].content).toBe('output "Enter your age: "');
    });
  });

  describe('Scanner input transformation', () => {
    test('should convert scanner.nextInt() assignment', () => {
      const assignment: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        operator: '=',
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'age'
        } as IdentifierNode,
        right: {
          type: NodeType.METHOD_CALL,
          location: mockLocation,
          object: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'scanner'
          } as IdentifierNode,
          methodName: 'nextInt',
          arguments: []
        } as MethodCallNode
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(assignment, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result[0].content).toBe('input AGE');
    });

    test('should convert scanner.nextLine() assignment', () => {
      const assignment: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        operator: '=',
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'userName'
        } as IdentifierNode,
        right: {
          type: NodeType.METHOD_CALL,
          location: mockLocation,
          object: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'scanner'
          } as IdentifierNode,
          methodName: 'nextLine',
          arguments: []
        } as MethodCallNode
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(assignment, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result[0].content).toBe('input USER_NAME');
    });

    test('should convert scanner.nextDouble() assignment', () => {
      const assignment: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        operator: '=',
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'price'
        } as IdentifierNode,
        right: {
          type: NodeType.METHOD_CALL,
          location: mockLocation,
          object: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'scanner'
          } as IdentifierNode,
          methodName: 'nextDouble',
          arguments: []
        } as MethodCallNode
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(assignment, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result[0].content).toBe('input PRICE');
    });

    test('should handle different Scanner object names', () => {
      const scannerNames = ['scanner', 'input', 'sc', 'in'];
      
      scannerNames.forEach(scannerName => {
        const assignment: AssignmentNode = {
          type: NodeType.ASSIGNMENT,
          location: mockLocation,
          operator: '=',
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'value'
          } as IdentifierNode,
          right: {
            type: NodeType.METHOD_CALL,
            location: mockLocation,
            object: {
              type: NodeType.IDENTIFIER,
              location: mockLocation,
              name: scannerName
            } as IdentifierNode,
            methodName: 'nextInt',
            arguments: []
          } as MethodCallNode
        };

        const context = transformer.createContext(ibRules);
        const result = transformer.transformNode(assignment, context);

        expect(result).toHaveLength(1);
        expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
        expect(result[0].content).toBe('input VALUE');
      });
    });

    test('should handle all Scanner input methods', () => {
      const scannerMethods = [
        'nextInt', 'nextDouble', 'nextFloat', 'nextLong', 
        'nextBoolean', 'next', 'nextLine'
      ];
      
      scannerMethods.forEach(method => {
        const assignment: AssignmentNode = {
          type: NodeType.ASSIGNMENT,
          location: mockLocation,
          operator: '=',
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'testVar'
          } as IdentifierNode,
          right: {
            type: NodeType.METHOD_CALL,
            location: mockLocation,
            object: {
              type: NodeType.IDENTIFIER,
              location: mockLocation,
              name: 'scanner'
            } as IdentifierNode,
            methodName: method,
            arguments: []
          } as MethodCallNode
        };

        const context = transformer.createContext(ibRules);
        const result = transformer.transformNode(assignment, context);

        expect(result).toHaveLength(1);
        expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
        expect(result[0].content).toBe('input TEST_VAR');
      });
    });
  });

  describe('Combined I/O patterns', () => {
    test('should handle prompt followed by input pattern', () => {
      // This would typically be tested at a higher level with multiple statements
      // For now, we test the individual transformations work correctly
      
      // Test prompt output
      const promptCall: MethodCallNode = {
        type: NodeType.METHOD_CALL,
        location: mockLocation,
        object: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'System.out'
        } as IdentifierNode,
        methodName: 'print',
        arguments: [{
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '"Enter your name: "',
          dataType: 'string'
        } as LiteralNode]
      };

      const context = transformer.createContext(ibRules);
      const promptResult = transformer.transformNode(promptCall, context);

      expect(promptResult).toHaveLength(1);
      expect(promptResult[0].content).toBe('output "Enter your name: "');

      // Test input assignment
      const inputAssignment: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        operator: '=',
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'name'
        } as IdentifierNode,
        right: {
          type: NodeType.METHOD_CALL,
          location: mockLocation,
          object: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'scanner'
          } as IdentifierNode,
          methodName: 'nextLine',
          arguments: []
        } as MethodCallNode
      };

      const inputResult = transformer.transformNode(inputAssignment, context);

      expect(inputResult).toHaveLength(1);
      expect(inputResult[0].content).toBe('input NAME');
    });
  });

  describe('Variable declaration with Scanner input', () => {
    test('should handle variable declaration with Scanner input initialization', () => {
      // Test case: int age = scanner.nextInt();
      const varDeclaration: VariableDeclarationNode = {
        type: NodeType.VARIABLE_DECLARATION,
        location: mockLocation,
        name: 'age',
        dataType: 'int',
        initializer: {
          type: NodeType.METHOD_CALL,
          location: mockLocation,
          object: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'scanner'
          } as IdentifierNode,
          methodName: 'nextInt',
          arguments: []
        } as MethodCallNode
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(varDeclaration, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      // For variable declarations with Scanner input, we should get an input statement
      expect(result[0].content).toBe('input AGE');
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle non-Scanner method calls normally', () => {
      const methodCall: MethodCallNode = {
        type: NodeType.METHOD_CALL,
        location: mockLocation,
        object: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'myObject'
        } as IdentifierNode,
        methodName: 'someMethod',
        arguments: []
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(methodCall, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.EXPRESSION);
      expect(result[0].content).toBe('MY_OBJECT.SOME_METHOD()');
    });

    test('should handle System.out method calls with no arguments', () => {
      const methodCall: MethodCallNode = {
        type: NodeType.METHOD_CALL,
        location: mockLocation,
        object: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'System.out'
        } as IdentifierNode,
        methodName: 'println',
        arguments: []
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(methodCall, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result[0].content).toBe('output ');
    });

    test('should handle assignment with non-Scanner method call', () => {
      const assignment: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        operator: '=',
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'result'
        } as IdentifierNode,
        right: {
          type: NodeType.METHOD_CALL,
          location: mockLocation,
          object: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'calculator'
          } as IdentifierNode,
          methodName: 'add',
          arguments: []
        } as MethodCallNode
      };

      const context = transformer.createContext(ibRules);
      const result = transformer.transformNode(assignment, context);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result[0].content).toBe('RESULT = CALCULATOR.ADD()');
    });
  });
});