/**
 * Unit tests for Control Structure Transformations
 */

import { 
  ASTTransformer,
  IfStatementRule,
  WhileLoopRule,
  ForLoopRule,
  PseudocodeNodeType
} from '../src/transformer';
import { 
  NodeType, 
  SourceLocation
} from '../src/types';
import { 
  IfStatementNode,
  WhileLoopNode,
  ForLoopNode,
  VariableDeclarationNode,
  AssignmentNode,
  BinaryExpressionNode,
  IdentifierNode,
  LiteralNode
} from '../src/parser';

describe('Control Structure Transformations', () => {
  let transformer: ASTTransformer;
  let mockLocation: SourceLocation;

  beforeEach(() => {
    transformer = new ASTTransformer();
    mockLocation = { line: 1, column: 1 };
  });

  describe('If Statement Transformation', () => {
    it('should transform simple if statement', () => {
      // Create condition: x > 5
      const leftNode: IdentifierNode = {
        type: NodeType.IDENTIFIER,
        location: mockLocation,
        name: 'x',
        children: []
      };

      const rightNode: LiteralNode = {
        type: NodeType.LITERAL,
        location: mockLocation,
        value: '5',
        dataType: 'number',
        children: []
      };

      const conditionNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: leftNode,
        right: rightNode,
        operator: '>',
        children: [leftNode, rightNode]
      };

      // Create then statement: x = 10
      const assignmentNode: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: leftNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '10',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '=',
        children: [leftNode, rightNode]
      };

      const ifNode: IfStatementNode = {
        type: NodeType.IF_STATEMENT,
        location: mockLocation,
        condition: conditionNode,
        thenStatement: assignmentNode,
        children: [conditionNode, assignmentNode]
      };

      const result = transformer.transform(ifNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST).toHaveLength(3);
      expect(result.pseudocodeAST[0].content).toBe('if X > 5 then');
      expect(result.pseudocodeAST[1].content).toBe('X = 10');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('end if');
    });

    it('should transform if-else statement', () => {
      const conditionNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'flag',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: 'true',
          dataType: 'boolean',
          children: []
        } as LiteralNode,
        operator: '==',
        children: []
      };

      const thenStatement: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'result',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '1',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '=',
        children: []
      };

      const elseStatement: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'result',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '0',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '=',
        children: []
      };

      const ifNode: IfStatementNode = {
        type: NodeType.IF_STATEMENT,
        location: mockLocation,
        condition: conditionNode,
        thenStatement: thenStatement,
        elseStatement: elseStatement,
        children: [conditionNode, thenStatement, elseStatement]
      };

      const result = transformer.transform(ifNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST).toHaveLength(5);
      expect(result.pseudocodeAST[0].content).toBe('if FLAG = TRUE then');
      expect(result.pseudocodeAST[1].content).toBe('RESULT = 1');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('else');
      expect(result.pseudocodeAST[3].content).toBe('RESULT = 0');
      expect(result.pseudocodeAST[3].indentLevel).toBe(1);
      expect(result.pseudocodeAST[4].content).toBe('end if');
    });

    it('should transform nested if statements', () => {
      // Create outer condition: x > 0
      const outerCondition: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'x',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '0',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '>',
        children: []
      };

      // Create inner condition: x > 10
      const innerCondition: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'x',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '10',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '>',
        children: []
      };

      // Create inner if statement
      const innerIf: IfStatementNode = {
        type: NodeType.IF_STATEMENT,
        location: mockLocation,
        condition: innerCondition,
        thenStatement: {
          type: NodeType.ASSIGNMENT,
          location: mockLocation,
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'result',
            children: []
          } as IdentifierNode,
          right: {
            type: NodeType.LITERAL,
            location: mockLocation,
            value: '"large"',
            dataType: 'string',
            children: []
          } as LiteralNode,
          operator: '=',
          children: []
        } as AssignmentNode,
        children: []
      };

      // Create outer if statement
      const outerIf: IfStatementNode = {
        type: NodeType.IF_STATEMENT,
        location: mockLocation,
        condition: outerCondition,
        thenStatement: innerIf,
        children: [outerCondition, innerIf]
      };

      const result = transformer.transform(outerIf);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('if X > 0 then');
      expect(result.pseudocodeAST[1].content).toBe('if X > 10 then');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('RESULT = "large"');
      expect(result.pseudocodeAST[2].indentLevel).toBe(2);
      expect(result.pseudocodeAST[3].content).toBe('end if');
      expect(result.pseudocodeAST[3].indentLevel).toBe(1);
      expect(result.pseudocodeAST[4].content).toBe('end if');
      expect(result.pseudocodeAST[4].indentLevel).toBe(0);
    });
  });

  describe('While Loop Transformation', () => {
    it('should transform simple while loop', () => {
      const conditionNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '10',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '<',
        children: []
      };

      const bodyStatement: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.BINARY_EXPRESSION,
          location: mockLocation,
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'i',
            children: []
          } as IdentifierNode,
          right: {
            type: NodeType.LITERAL,
            location: mockLocation,
            value: '1',
            dataType: 'number',
            children: []
          } as LiteralNode,
          operator: '+',
          children: []
        } as BinaryExpressionNode,
        operator: '=',
        children: []
      };

      const whileNode: WhileLoopNode = {
        type: NodeType.WHILE_LOOP,
        location: mockLocation,
        condition: conditionNode,
        body: bodyStatement,
        children: [conditionNode, bodyStatement]
      };

      const result = transformer.transform(whileNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST).toHaveLength(3);
      expect(result.pseudocodeAST[0].content).toBe('loop while I < 10');
      expect(result.pseudocodeAST[1].content).toBe('I = I + 1');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('end loop');
    });

    it('should transform nested while loops', () => {
      const outerCondition: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '3',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '<',
        children: []
      };

      const innerCondition: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'j',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '3',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '<',
        children: []
      };

      const innerBody: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'j',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.BINARY_EXPRESSION,
          location: mockLocation,
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'j',
            children: []
          } as IdentifierNode,
          right: {
            type: NodeType.LITERAL,
            location: mockLocation,
            value: '1',
            dataType: 'number',
            children: []
          } as LiteralNode,
          operator: '+',
          children: []
        } as BinaryExpressionNode,
        operator: '=',
        children: []
      };

      const innerWhile: WhileLoopNode = {
        type: NodeType.WHILE_LOOP,
        location: mockLocation,
        condition: innerCondition,
        body: innerBody,
        children: [innerCondition, innerBody]
      };

      const outerWhile: WhileLoopNode = {
        type: NodeType.WHILE_LOOP,
        location: mockLocation,
        condition: outerCondition,
        body: innerWhile,
        children: [outerCondition, innerWhile]
      };

      const result = transformer.transform(outerWhile);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('loop while I < 3');
      expect(result.pseudocodeAST[1].content).toBe('loop while J < 3');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('J = J + 1');
      expect(result.pseudocodeAST[2].indentLevel).toBe(2);
      expect(result.pseudocodeAST[3].content).toBe('end loop');
      expect(result.pseudocodeAST[3].indentLevel).toBe(1);
      expect(result.pseudocodeAST[4].content).toBe('end loop');
      expect(result.pseudocodeAST[4].indentLevel).toBe(0);
    });
  });

  describe('For Loop Transformation', () => {
    it('should transform simple counting for loop', () => {
      const initNode: VariableDeclarationNode = {
        type: NodeType.VARIABLE_DECLARATION,
        location: mockLocation,
        name: 'i',
        dataType: 'int',
        initializer: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '0',
          dataType: 'number',
          children: []
        } as LiteralNode,
        children: []
      };

      const conditionNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '10',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '<',
        children: []
      };

      const updateNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '++',
        children: []
      };

      const bodyStatement: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'sum',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.BINARY_EXPRESSION,
          location: mockLocation,
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'sum',
            children: []
          } as IdentifierNode,
          right: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'i',
            children: []
          } as IdentifierNode,
          operator: '+',
          children: []
        } as BinaryExpressionNode,
        operator: '=',
        children: []
      };

      const forNode: ForLoopNode = {
        type: NodeType.FOR_LOOP,
        location: mockLocation,
        initialization: initNode,
        condition: conditionNode,
        update: updateNode,
        body: bodyStatement,
        children: [initNode, conditionNode, updateNode, bodyStatement]
      };

      const result = transformer.transform(forNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('loop I from 0 to 10 - 1');
      expect(result.pseudocodeAST[1].content).toBe('SUM = SUM + I');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('end loop');
    });

    it('should transform for loop with <= condition', () => {
      const initNode: VariableDeclarationNode = {
        type: NodeType.VARIABLE_DECLARATION,
        location: mockLocation,
        name: 'i',
        dataType: 'int',
        initializer: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '1',
          dataType: 'number',
          children: []
        } as LiteralNode,
        children: []
      };

      const conditionNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '5',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '<=',
        children: []
      };

      const updateNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '++',
        children: []
      };

      const bodyStatement: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'product',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.BINARY_EXPRESSION,
          location: mockLocation,
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'product',
            children: []
          } as IdentifierNode,
          right: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'i',
            children: []
          } as IdentifierNode,
          operator: '*',
          children: []
        } as BinaryExpressionNode,
        operator: '=',
        children: []
      };

      const forNode: ForLoopNode = {
        type: NodeType.FOR_LOOP,
        location: mockLocation,
        initialization: initNode,
        condition: conditionNode,
        update: updateNode,
        body: bodyStatement,
        children: [initNode, conditionNode, updateNode, bodyStatement]
      };

      const result = transformer.transform(forNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('loop I from 1 to 5');
      expect(result.pseudocodeAST[1].content).toBe('PRODUCT = PRODUCT * I');
      expect(result.pseudocodeAST[1].indentLevel).toBe(1);
      expect(result.pseudocodeAST[2].content).toBe('end loop');
    });

    it('should transform complex for loop to while loop', () => {
      // Create a complex for loop that doesn't match simple counting pattern
      const initNode: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '0',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '=',
        children: []
      };

      const conditionNode: BinaryExpressionNode = {
        type: NodeType.BINARY_EXPRESSION,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.LITERAL,
          location: mockLocation,
          value: '10',
          dataType: 'number',
          children: []
        } as LiteralNode,
        operator: '<',
        children: []
      };

      const updateNode: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'i',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.BINARY_EXPRESSION,
          location: mockLocation,
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'i',
            children: []
          } as IdentifierNode,
          right: {
            type: NodeType.LITERAL,
            location: mockLocation,
            value: '2',
            dataType: 'number',
            children: []
          } as LiteralNode,
          operator: '+',
          children: []
        } as BinaryExpressionNode,
        operator: '=',
        children: []
      };

      const bodyStatement: AssignmentNode = {
        type: NodeType.ASSIGNMENT,
        location: mockLocation,
        left: {
          type: NodeType.IDENTIFIER,
          location: mockLocation,
          name: 'sum',
          children: []
        } as IdentifierNode,
        right: {
          type: NodeType.BINARY_EXPRESSION,
          location: mockLocation,
          left: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'sum',
            children: []
          } as IdentifierNode,
          right: {
            type: NodeType.IDENTIFIER,
            location: mockLocation,
            name: 'i',
            children: []
          } as IdentifierNode,
          operator: '+',
          children: []
        } as BinaryExpressionNode,
        operator: '=',
        children: []
      };

      const forNode: ForLoopNode = {
        type: NodeType.FOR_LOOP,
        location: mockLocation,
        initialization: initNode,
        condition: conditionNode,
        update: updateNode,
        body: bodyStatement,
        children: [initNode, conditionNode, updateNode, bodyStatement]
      };

      const result = transformer.transform(forNode);
      
      expect(result.errors).toHaveLength(0);
      expect(result.pseudocodeAST[0].content).toBe('// Complex for loop converted to while loop');
      expect(result.pseudocodeAST[1].content).toBe('I = 0');
      expect(result.pseudocodeAST[2].content).toBe('loop while I < 10');
      expect(result.pseudocodeAST[3].content).toBe('SUM = SUM + I');
      expect(result.pseudocodeAST[3].indentLevel).toBe(1);
      expect(result.pseudocodeAST[4].content).toBe('I = I + 2');
      expect(result.pseudocodeAST[4].indentLevel).toBe(1);
      expect(result.pseudocodeAST[5].content).toBe('end loop');
    });
  });
});