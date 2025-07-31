/**
 * Unit tests for Method and Function Transformations
 */

import { 
  ASTTransformer,
  MethodDeclarationRule,
  ReturnStatementRule,
  PseudocodeNodeType
} from '../src/transformer';
import { 
  NodeType, 
  SourceLocation
} from '../src/types';
import { 
  MethodDeclarationNode,
  ReturnStatementNode,
  ParameterNode,
  VariableDeclarationNode,
  AssignmentNode,
  BinaryExpressionNode,
  IdentifierNode,
  LiteralNode
} from '../src/parser';

describe('Method and Function Transformations', () => {
  let transformer: ASTTransformer;
  let mockLocation: SourceLocation;

  beforeEach(() => {
    transformer = new ASTTransformer();
    mockLocation = { line: 1, column: 1 };
  });

  describe('Void Method Transformation (PROCEDURE)', () => {
    it('should transform void method without parameters to PROCEDURE format', () => {
      const methodNode: MethodDeclarationNode = {
        type: NodeType.METHOD_DECLARATION,
        location: mockLocation,
        name: 'printMessage',
        returnType: 'void',
        parameters: [],
        body: [
          {
            type: NodeType.ASSIGNMENT,
            location: mockLocation,
            left: {
              type: NodeType.IDENTIFIER,
              location: mockLocation,
              name: 'message',
              children: []
            } as IdentifierNode,
            right: {
              type: NodeType.LITERAL,
              location: mockLocation,
              value: '"Hello World"',
              dataType: 'string',
              children: []
            } as LiteralNode,
            operator: '=',
            children: []
          } as AssignmentNode
        ],
        isVoid: true,
        isStatic: false,
        isPublic: true,
        children: []
      };

      const result = transformer.transform(methodNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('PROCEDURE PRINT_MESSAGE()');
      expect(result.pseudocodeAST[1].content).toBe('MESSAGE = "Hello World"');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('END PROCEDURE');
    });

    it('should transform void method with parameters to PROCEDURE format', () => {
      const parameters: ParameterNode[] = [
        {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'userName',
          paramType: 'String',
          children: []
        },
        {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'userAge',
          paramType: 'int',
          children: []
        }
      ];

      const methodNode: MethodDeclarationNode = {
        type: NodeType.METHOD_DECLARATION,
        location: mockLocation,
        name: 'displayUserInfo',
        returnType: 'void',
        parameters: parameters,
        body: [],
        isVoid: true,
        isStatic: false,
        isPublic: true,
        children: []
      };

      const result = transformer.transform(methodNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('PROCEDURE DISPLAY_USER_INFO(USER_NAME, USER_AGE)');
      expect(result.pseudocodeAST[1].content).toBe('END PROCEDURE');
    });
  });

  describe('Non-void Method Transformation (FUNCTION)', () => {
    it('should transform non-void method without parameters to FUNCTION format', () => {
      const returnStatement: ReturnStatementNode = {
        type: NodeType.RETURN_STATEMENT,
        location: mockLocation,
        expression: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '42',
          dataType: 'number',
          children: []
        } as LiteralNode,
        children: []
      };

      const methodNode: MethodDeclarationNode = {
        type: NodeType.METHOD_DECLARATION,
        location: mockLocation,
        name: 'getAnswer',
        returnType: 'int',
        parameters: [],
        body: [returnStatement],
        isVoid: false,
        isStatic: false,
        isPublic: true,
        children: []
      };

      const result = transformer.transform(methodNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('FUNCTION GET_ANSWER()');
      expect(result.pseudocodeAST[1].content).toBe('RETURN 42');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('END FUNCTION');
    });

    it('should transform non-void method with parameters to FUNCTION format', () => {
      const parameters: ParameterNode[] = [
        {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'firstNumber',
          paramType: 'int',
          children: []
        },
        {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'secondNumber',
          paramType: 'int',
          children: []
        }
      ];

      const returnExpression: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'firstNumber',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'secondNumber',
          children: []
        } as IdentifierNode,
        operator: '+',
        children: []
      };

      const returnStatement: ReturnStatementNode = {
        type: NodeType.RETURN_STATEMENT,
        location: mockLocation,
        expression: returnExpression,
        children: [returnExpression]
      };

      const methodNode: MethodDeclarationNode = {
        type: NodeType.METHOD_DECLARATION,
        location: mockLocation,
        name: 'addNumbers',
        returnType: 'int',
        parameters: parameters,
        body: [returnStatement],
        isVoid: false,
        isStatic: false,
        isPublic: true,
        children: []
      };

      const result = transformer.transform(methodNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('FUNCTION ADD_NUMBERS(FIRST_NUMBER, SECOND_NUMBER)');
      expect(result.pseudocodeAST[1].content).toBe('RETURN FIRST_NUMBER + SECOND_NUMBER');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('END FUNCTION');
    });

    it('should transform complex function with local variables', () => {
      const localVar: VariableDeclarationNode = {
        type: NodeType.VARIABLE_DECLARATION,
        location: mockLocation,
        name: 'result',
        dataType: 'int',
        initializer: {
          type: NodeType.BINARY_EXPRESSION,
          location: mockLocation,
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'x',
            children: []
          } as IdentifierNode,
          right: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'y',
            children: []
          } as IdentifierNode,
          operator: '*',
          children: []
        } as BinaryExpressionNode,
        children: []
      };

      const returnStatement: ReturnStatementNode = {
        type: NodeType.RETURN_STATEMENT,
        location: mockLocation,
        expression: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'result',
          children: []
        } as IdentifierNode,
        children: []
      };

      const parameters: ParameterNode[] = [
        {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'x',
          paramType: 'int',
          children: []
        },
        {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'y',
          paramType: 'int',
          children: []
        }
      ];

      const methodNode: MethodDeclarationNode = {
        type: NodeType.METHOD_DECLARATION,
        location: mockLocation,
        name: 'multiply',
        returnType: 'int',
        parameters: parameters,
        body: [localVar, returnStatement],
        isVoid: false,
        isStatic: false,
        isPublic: true,
        children: []
      };

      const result = transformer.transform(methodNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('FUNCTION MULTIPLY(X, Y)');
      expect(result.pseudocodeAST[1].content).toBe('RESULT = X * Y');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('RETURN RESULT');
      expect(result.pseudocodeAST[2].indentLevel).toBe(1);
      expect(result.pseudocodeAST[3].content).toBe('END FUNCTION');
    });
  });

  describe('Return Statement Transformation', () => {
    it('should transform return statement with expression', () => {
      const returnNode: ReturnStatementNode = {
        type: NodeType.RETURN_STATEMENT,
        location: mockLocation,
        expression: {
          type: NodeType.BINARY_EXPRESSION,
          location: mockLocation,
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'a',
            children: []
          } as IdentifierNode,
          right: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'b',
            children: []
          } as IdentifierNode,
          operator: '+',
          children: []
        } as BinaryExpressionNode,
        children: []
      };

      const result = transformer.transform(returnNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST).toHaveLength(1);
      expect(result.pseudocodeAST[0].content).toBe('RETURN A + B');
      expect(result.pseudocodeAST[0].type).toBe(PseudocodeNodeType.STATEMENT);
    });

    it('should transform void return statement', () => {
      const returnNode: ReturnStatementNode = {
        type: NodeType.RETURN_STATEMENT,
        location: mockLocation,
        expression: undefined,
        children: []
      };

      const result = transformer.transform(returnNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST).toHaveLength(1);
      expect(result.pseudocodeAST[0].content).toBe('RETURN');
      expect(result.pseudocodeAST[0].type).toBe(PseudocodeNodeType.STATEMENT);
    });
  });

  describe('Parameter Name Conversion', () => {
    it('should convert parameter names to UPPERCASE', () => {
      const parameters: ParameterNode[] = [
        {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'camelCaseParam',
          paramType: 'String',
          children: []
        },
        {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'anotherParam',
          paramType: 'int',
          children: []
        }
      ];

      const methodNode: MethodDeclarationNode = {
        type: NodeType.METHOD_DECLARATION,
        location: mockLocation,
        name: 'testMethod',
        returnType: 'void',
        parameters: parameters,
        body: [],
        isVoid: true,
        isStatic: false,
        isPublic: true,
        children: []
      };

      const result = transformer.transform(methodNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('PROCEDURE TEST_METHOD(CAMEL_CASE_PARAM, ANOTHER_PARAM)');
    });
  });
});