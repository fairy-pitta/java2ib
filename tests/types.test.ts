/**
 * Tests for core token and AST type definitions
 */

import {
  Token,
  TokenType,
  ASTNode,
  NodeType,
  SourceLocation,
  ConversionError,
  ErrorType,
  ErrorSeverity,
} from '../src/types';

describe('Token Types', () => {
  test('should create Token with all required properties', () => {
    const location: SourceLocation = { line: 1, column: 1 };
    const token: Token = {
      type: TokenType.KEYWORD,
      value: 'int',
      location,
    };

    expect(token.type).toBe(TokenType.KEYWORD);
    expect(token.value).toBe('int');
    expect(token.location).toBe(location);
  });

  test('should have all required TokenType enum values', () => {
    expect(TokenType.KEYWORD).toBe('keyword');
    expect(TokenType.IDENTIFIER).toBe('identifier');
    expect(TokenType.LITERAL).toBe('literal');
    expect(TokenType.OPERATOR).toBe('operator');
    expect(TokenType.PUNCTUATION).toBe('punctuation');
    expect(TokenType.WHITESPACE).toBe('whitespace');
    expect(TokenType.COMMENT).toBe('comment');
  });

  test('should create tokens of different types', () => {
    const location: SourceLocation = { line: 1, column: 1 };

    const keywordToken: Token = {
      type: TokenType.KEYWORD,
      value: 'if',
      location,
    };

    const identifierToken: Token = {
      type: TokenType.IDENTIFIER,
      value: 'variable',
      location,
    };

    const literalToken: Token = {
      type: TokenType.LITERAL,
      value: '42',
      location,
    };

    expect(keywordToken.type).toBe(TokenType.KEYWORD);
    expect(identifierToken.type).toBe(TokenType.IDENTIFIER);
    expect(literalToken.type).toBe(TokenType.LITERAL);
  });
});

describe('AST Node Types', () => {
  test('should create ASTNode with required properties', () => {
    const location: SourceLocation = { line: 1, column: 1 };
    const node: ASTNode = {
      type: NodeType.PROGRAM,
      location,
    };

    expect(node.type).toBe(NodeType.PROGRAM);
    expect(node.location).toBe(location);
    expect(node.children).toBeUndefined();
  });

  test('should create ASTNode with children', () => {
    const location: SourceLocation = { line: 1, column: 1 };
    const childNode: ASTNode = {
      type: NodeType.IDENTIFIER,
      location,
    };

    const parentNode: ASTNode = {
      type: NodeType.VARIABLE_DECLARATION,
      location,
      children: [childNode],
    };

    expect(parentNode.children).toHaveLength(1);
    expect(parentNode.children![0]).toBe(childNode);
  });

  test('should have all required NodeType enum values', () => {
    expect(NodeType.PROGRAM).toBe('Program');
    expect(NodeType.CLASS_DECLARATION).toBe('ClassDeclaration');
    expect(NodeType.METHOD_DECLARATION).toBe('MethodDeclaration');
    expect(NodeType.VARIABLE_DECLARATION).toBe('VariableDeclaration');
    expect(NodeType.IF_STATEMENT).toBe('IfStatement');
    expect(NodeType.WHILE_LOOP).toBe('WhileLoop');
    expect(NodeType.FOR_LOOP).toBe('ForLoop');
    expect(NodeType.ASSIGNMENT).toBe('Assignment');
    expect(NodeType.BINARY_EXPRESSION).toBe('BinaryExpression');
    expect(NodeType.METHOD_CALL).toBe('MethodCall');
    expect(NodeType.ARRAY_ACCESS).toBe('ArrayAccess');
    expect(NodeType.LITERAL).toBe('Literal');
    expect(NodeType.IDENTIFIER).toBe('Identifier');
  });

  test('should create nodes of different types', () => {
    const location: SourceLocation = { line: 1, column: 1 };

    const programNode: ASTNode = {
      type: NodeType.PROGRAM,
      location,
    };

    const classNode: ASTNode = {
      type: NodeType.CLASS_DECLARATION,
      location,
    };

    const methodNode: ASTNode = {
      type: NodeType.METHOD_DECLARATION,
      location,
    };

    expect(programNode.type).toBe(NodeType.PROGRAM);
    expect(classNode.type).toBe(NodeType.CLASS_DECLARATION);
    expect(methodNode.type).toBe(NodeType.METHOD_DECLARATION);
  });
});

describe('SourceLocation', () => {
  test('should create SourceLocation with line and column', () => {
    const location: SourceLocation = {
      line: 5,
      column: 10,
    };

    expect(location.line).toBe(5);
    expect(location.column).toBe(10);
    expect(location.file).toBeUndefined();
  });

  test('should create SourceLocation with optional file', () => {
    const location: SourceLocation = {
      line: 1,
      column: 1,
      file: 'test.java',
    };

    expect(location.line).toBe(1);
    expect(location.column).toBe(1);
    expect(location.file).toBe('test.java');
  });
});

describe('Error Handling Types', () => {
  test('should create ConversionError with all properties', () => {
    const location: SourceLocation = { line: 1, column: 1 };
    const error: ConversionError = {
      type: ErrorType.SYNTAX_ERROR,
      message: 'Unexpected token',
      location,
      severity: ErrorSeverity.ERROR,
    };

    expect(error.type).toBe(ErrorType.SYNTAX_ERROR);
    expect(error.message).toBe('Unexpected token');
    expect(error.location).toBe(location);
    expect(error.severity).toBe(ErrorSeverity.ERROR);
  });

  test('should have all required ErrorType enum values', () => {
    expect(ErrorType.LEXICAL_ERROR).toBe('lexical');
    expect(ErrorType.SYNTAX_ERROR).toBe('syntax');
    expect(ErrorType.SEMANTIC_ERROR).toBe('semantic');
    expect(ErrorType.CONVERSION_ERROR).toBe('conversion');
  });

  test('should have all required ErrorSeverity enum values', () => {
    expect(ErrorSeverity.ERROR).toBe('error');
    expect(ErrorSeverity.WARNING).toBe('warning');
    expect(ErrorSeverity.INFO).toBe('info');
  });
});