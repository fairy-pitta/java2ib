/**
 * Unit tests for AST Transformation System
 */

import { 
  ASTTransformer,
  VariableDeclarationRule,
  AssignmentRule,
  BinaryExpressionRule,
  IdentifierRule,
  LiteralRule,
  IfStatementRule,
  WhileLoopRule,
  ForLoopRule,
  PseudocodeNodeType,
  TransformationContext
} from '../src/transformer';
import { 
  NodeType, 
  SourceLocation,
  ErrorType 
} from '../src/types';
import { 
  VariableDeclarationNode,
  AssignmentNode,
  BinaryExpressionNode,
  IdentifierNode,
  LiteralNode,
  IfStatementNode,
  WhileLoopNode,
  ForLoopNode
} from '../src/parser';
import { IBRulesEngine } from '../src/ib-rules-engine';

describe('ASTTransformer', () => {
  let transformer: ASTTransformer;
  let mockLocation: SourceLocation;

  beforeEach(() => {
    transformer = new ASTTransformer();
    mockLocation = { line: 1, column: 1 };
  });

  describe('Variable Declaration Transformation', () => {
    it('should transform simple variable declaration without initializer', () => {
      const varNode: VariableDeclarationNode = {
        type: NodeType.VARIABLE_DECLARATION,
        location: mockLocation,
        name: 'myVariable',
        dataType: 'int',
        initializer: undefined,
        children: []
      };

      const result = transformer.transform(varNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST).toHaveLength(1);
      expect(result.pseudocodeAST[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result.pseudocodeAST[0].content).toBe('MY_VARIABLE');
    });

    it('should transform variable declaration with initializer', () => {
      const literalNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: '42',
        dataType: 'number',
        children: []
      };

      const varNode: VariableDeclarationNode = {
        type: NodeType.VARIABLE_DECLARATION,
        location: mockLocation,
        name: 'myNumber',
        dataType: 'int',
        initializer: literalNode,
        children: [literalNode]
      };

      const result = transformer.transform(varNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST).toHaveLength(1);
      expect(result.pseudocodeAST[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result.pseudocodeAST[0].content).toBe('MY_NUMBER = 42');
    });

    it('should convert camelCase variable names to UPPERCASE', () => {
      const varNode: VariableDeclarationNode = {
        type: NodeType.VARIABLE_DECLARATION,
        location: mockLocation,
        name: 'studentGrade',
        dataType: 'double',
        initializer: undefined,
        children: []
      };

      const result = transformer.transform(varNode);
      
      expect(result.pseudocodeAST[0].content).toBe('STUDENT_GRADE');
    });
  });

  describe('Assignment Transformation', () => {
    it('should transform simple assignment', () => {
      const identifierNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'myVar',
        children: []
      };

      const literalNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: '10',
        dataType: 'number',
        children: []
      };

      const assignmentNode: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: identifierNode,
        right: literalNode,
        operator: '=',
        children: [identifierNode, literalNode]
      };

      const result = transformer.transform(assignmentNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST).toHaveLength(1);
      expect(result.pseudocodeAST[0].type).toBe(PseudocodeNodeType.STATEMENT);
      expect(result.pseudocodeAST[0].content).toBe('MY_VAR = 10');
    });

    it('should transform compound assignment operators', () => {
      const identifierNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'counter',
        children: []
      };

      const literalNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: '5',
        dataType: 'number',
        children: []
      };

      const assignmentNode: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: identifierNode,
        right: literalNode,
        operator: '+=',
        children: [identifierNode, literalNode]
      };

      const result = transformer.transform(assignmentNode);
      
      expect(result.pseudocodeAST[0].content).toBe('COUNTER = COUNTER + 5');
    });
  });

  describe('Binary Expression Transformation', () => {
    it('should transform arithmetic expressions with operator conversion', () => {
      const leftNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'num1',
        children: []
      };

      const rightNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'num2',
        children: []
      };

      const binaryNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: leftNode,
        right: rightNode,
        operator: '%',
        children: [leftNode, rightNode]
      };

      const result = transformer.transform(binaryNode);
      
      expect(result.pseudocodeAST[0].type).toBe(PseudocodeNodeType.EXPRESSION);
      expect(result.pseudocodeAST[0].content).toBe('NUM1 mod NUM2');
    });

    it('should transform comparison expressions', () => {
      const leftNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: '10',
        dataType: 'number',
        children: []
      };

      const rightNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: '20',
        dataType: 'number',
        children: []
      };

      const binaryNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: leftNode,
        right: rightNode,
        operator: '==',
        children: [leftNode, rightNode]
      };

      const result = transformer.transform(binaryNode);
      
      expect(result.pseudocodeAST[0].content).toBe('10 = 20');
    });

    it('should transform logical expressions', () => {
      const leftNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'isValid',
        children: []
      };

      const rightNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'isReady',
        children: []
      };

      const binaryNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: leftNode,
        right: rightNode,
        operator: '&&',
        children: [leftNode, rightNode]
      };

      const result = transformer.transform(binaryNode);
      
      expect(result.pseudocodeAST[0].content).toBe('IS_VALID AND IS_READY');
    });

    it('should handle unary expressions', () => {
      const emptyLeftNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: '',
        dataType: 'number',
        children: []
      };

      const rightNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'flag',
        children: []
      };

      const unaryNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: emptyLeftNode,
        right: rightNode,
        operator: '!',
        children: [rightNode]
      };

      const result = transformer.transform(unaryNode);
      
      expect(result.pseudocodeAST[0].content).toBe('NOT FLAG');
    });
  });

  describe('Identifier Transformation', () => {
    it('should convert identifier names to UPPERCASE', () => {
      const identifierNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'userName',
        children: []
      };

      const result = transformer.transform(identifierNode);
      
      expect(result.pseudocodeAST[0].type).toBe(PseudocodeNodeType.EXPRESSION);
      expect(result.pseudocodeAST[0].content).toBe('USER_NAME');
    });

    it('should use stored variable info when available', () => {
      // First, create a variable declaration to store the variable info
      const varNode: VariableDeclarationNode = {
        type: NodeType.VARIABLE_DECLARATION,
        location: mockLocation,
        name: 'myVar',
        dataType: 'int',
        initializer: undefined,
        children: []
      };

      // Transform the variable declaration first
      transformer.transform(varNode);

      // Now transform an identifier that references the same variable
      const identifierNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'myVar',
        children: []
      };

      const result = transformer.transform(identifierNode);
      
      expect(result.pseudocodeAST[0].content).toBe('MY_VAR');
    });
  });

  describe('Literal Transformation', () => {
    it('should preserve numeric literals', () => {
      const literalNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: '42',
        dataType: 'number',
        children: []
      };

      const result = transformer.transform(literalNode);
      
      expect(result.pseudocodeAST[0].type).toBe(PseudocodeNodeType.EXPRESSION);
      expect(result.pseudocodeAST[0].content).toBe('42');
    });

    it('should preserve string literals', () => {
      const literalNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: '"Hello World"',
        dataType: 'string',
        children: []
      };

      const result = transformer.transform(literalNode);
      
      expect(result.pseudocodeAST[0].content).toBe('"Hello World"');
    });

    it('should convert boolean literals to UPPERCASE', () => {
      const trueLiteralNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: 'true',
        dataType: 'boolean',
        children: []
      };

      const falseLiteralNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: 'false',
        dataType: 'boolean',
        children: []
      };

      const trueResult = transformer.transform(trueLiteralNode);
      const falseResult = transformer.transform(falseLiteralNode);
      
      expect(trueResult.pseudocodeAST[0].content).toBe('TRUE');
      expect(falseResult.pseudocodeAST[0].content).toBe('FALSE');
    });
  });

  describe('Error Handling', () => {
    it('should handle unsupported node types gracefully', () => {
      const unsupportedNode = {
        type: 'UNSUPPORTED_TYPE' as NodeType,
        location: mockLocation,
        children: []
      };

      const result = transformer.transform(unsupportedNode);
      
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe(ErrorType.CONVERSION_ERROR);
      expect(result.errors[0].message).toContain('No transformation rule found');
      expect(result.pseudocodeAST).toHaveLength(0);
    });
  });

  describe('Complex Expression Transformation', () => {
    it('should transform nested binary expressions', () => {
      // Create expression: (a + b) * c
      const aNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'a',
        children: []
      };

      const bNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'b',
        children: []
      };

      const cNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'c',
        children: []
      };

      const addNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: aNode,
        right: bNode,
        operator: '+',
        children: [aNode, bNode]
      };

      const multiplyNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: addNode,
        right: cNode,
        operator: '*',
        children: [addNode, cNode]
      };

      const result = transformer.transform(multiplyNode);
      
      expect(result.pseudocodeAST[0].content).toBe('A + B * C');
    });
  });
});

describe('Individual Transformation Rules', () => {
  let ibRules: IBRulesEngine;
  let mockContext: TransformationContext;
  let mockLocation: SourceLocation;

  beforeEach(() => {
    ibRules = new IBRulesEngine();
    mockLocation = { line: 1, column: 1 };
    mockContext = {
      variables: new Map(),
      methods: new Map(),
      currentScope: { name: 'test', type: 'method' },
      ibRules,
      indentLevel: 0,
      transformer: new ASTTransformer()
    };
  });

  describe('VariableDeclarationRule', () => {
    it('should store variable information in context', () => {
      const rule = new VariableDeclarationRule();
      const varNode: VariableDeclarationNode = {
        type: NodeType.VARIABLE_DECLARATION,
        location: mockLocation,
        name: 'testVar',
        dataType: 'int',
        initializer: undefined,
        children: []
      };

      rule.transform(varNode, mockContext);

      expect(mockContext.variables.has('testVar')).toBe(true);
      const varInfo = mockContext.variables.get('testVar')!;
      expect(varInfo.originalName).toBe('testVar');
      expect(varInfo.pseudocodeName).toBe('TEST_VAR');
      expect(varInfo.type).toBe('int');
    });
  });

  describe('AssignmentRule', () => {
    it('should handle different compound assignment operators', () => {
      const rule = new AssignmentRule();
      
      const testCases = [
        { operator: '+=', expected: 'COUNTER = COUNTER + 5' },
        { operator: '-=', expected: 'COUNTER = COUNTER - 5' },
        { operator: '*=', expected: 'COUNTER = COUNTER * 5' },
        { operator: '/=', expected: 'COUNTER = COUNTER div 5' },
        { operator: '%=', expected: 'COUNTER = COUNTER mod 5' }
      ];

      testCases.forEach(({ operator, expected }) => {
        const identifierNode: IdentifierNode = {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'counter',
          children: []
        };

        const literalNode: LiteralNode = {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '5',
          dataType: 'number',
          children: []
        };

        const assignmentNode: AssignmentNode = {
          type: NodeType.ASSIGNMENT,
          location: mockLocation,
          left: identifierNode,
          right: literalNode,
          operator,
          children: [identifierNode, literalNode]
        };

        const result = rule.transform(assignmentNode, mockContext);
        expect(result[0].content).toBe(expected);
      });
    });
  });
});