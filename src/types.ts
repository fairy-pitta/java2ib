/**
 * Type definitions for the Java to IB Pseudocode Converter
 */

export interface ConversionOptions {
  preserveComments?: boolean;
  strictMode?: boolean;
  indentSize?: number;
}

export interface ConversionResult {
  pseudocode: string;
  success: boolean;
  errors: ConversionError[];
  warnings: ConversionWarning[];
  metadata: ConversionMetadata;
}

export interface ConversionError {
  type: ErrorType;
  message: string;
  location: SourceLocation;
  severity: ErrorSeverity;
}

export interface ConversionWarning {
  type: ErrorType;
  message: string;
  location: SourceLocation;
  severity: ErrorSeverity;
}

export interface ConversionMetadata {
  originalLines: number;
  convertedLines: number;
  processingTime: number;
}

export interface SourceLocation {
  line: number;
  column: number;
  file?: string;
}

export enum ErrorType {
  LEXICAL_ERROR = 'lexical',
  SYNTAX_ERROR = 'syntax',
  SEMANTIC_ERROR = 'semantic',
  CONVERSION_ERROR = 'conversion',
}

export enum ErrorSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

// Token definitions
export interface Token {
  type: TokenType;
  value: string;
  location: SourceLocation;
}

export enum TokenType {
  KEYWORD = 'keyword',
  IDENTIFIER = 'identifier',
  LITERAL = 'literal',
  OPERATOR = 'operator',
  PUNCTUATION = 'punctuation',
  WHITESPACE = 'whitespace',
  COMMENT = 'comment',
}

// AST Node definitions
export interface ASTNode {
  type: NodeType;
  location: SourceLocation;
  children?: ASTNode[];
}

export enum NodeType {
  PROGRAM = 'Program',
  CLASS_DECLARATION = 'ClassDeclaration',
  METHOD_DECLARATION = 'MethodDeclaration',
  VARIABLE_DECLARATION = 'VariableDeclaration',
  IF_STATEMENT = 'IfStatement',
  WHILE_LOOP = 'WhileLoop',
  FOR_LOOP = 'ForLoop',
  ASSIGNMENT = 'Assignment',
  BINARY_EXPRESSION = 'BinaryExpression',
  METHOD_CALL = 'MethodCall',
  ARRAY_ACCESS = 'ArrayAccess',
  LITERAL = 'Literal',
  IDENTIFIER = 'Identifier',
  RETURN_STATEMENT = 'ReturnStatement',
}
