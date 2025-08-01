/**
 * Type definitions for the Java to IB Pseudocode Converter
 * 
 * This module contains all the TypeScript interfaces, types, and enums used
 * throughout the converter library. These types provide strong typing for
 * the conversion process and ensure type safety when using the library.
 */

/**
 * Configuration options for the Java to IB pseudocode conversion process.
 * 
 * These options allow customization of the conversion behavior and output formatting
 * to meet specific educational or presentation requirements.
 * 
 * @example
 * ```typescript
 * const options: ConversionOptions = {
 *   preserveComments: true,
 *   strictMode: false,
 *   indentSize: 4
 * };
 * const result = converter.convert(javaCode, options);
 * ```
 */
export interface ConversionOptions {
  /**
   * Whether to preserve comments from the original Java code in the pseudocode output.
   * 
   * When true, both single-line (//) and multi-line comments are preserved
   * in their original positions within the converted pseudocode.
   * 
   * @defaultValue true
   */
  preserveComments?: boolean;
  
  /**
   * Enable strict conversion mode for enhanced error checking.
   * 
   * When enabled, the converter applies stricter validation rules and may
   * generate additional warnings for code patterns that don't translate
   * cleanly to IB pseudocode format.
   * 
   * @defaultValue false
   */
  strictMode?: boolean;
  
  /**
   * Number of spaces to use for each level of indentation in the output.
   * 
   * This controls the formatting of nested structures like if-statements,
   * loops, and method bodies in the generated pseudocode.
   * 
   * @defaultValue 4
   */
  indentSize?: number;
}

/**
 * The result of a Java to IB pseudocode conversion operation.
 * 
 * This interface contains all information about the conversion process,
 * including the converted pseudocode, success status, any errors or warnings
 * encountered, and metadata about the conversion.
 * 
 * @example
 * ```typescript
 * const result = converter.convert(javaCode);
 * 
 * if (result.success) {
 *   console.log('Converted pseudocode:');
 *   console.log(result.pseudocode);
 *   
 *   if (result.warnings.length > 0) {
 *     console.log('Warnings:', result.warnings);
 *   }
 * } else {
 *   console.error('Conversion failed:', result.errors);
 * }
 * ```
 */
export interface ConversionResult {
  /**
   * The converted IB pseudocode as a formatted string.
   * 
   * This contains the complete pseudocode output with proper indentation
   * and formatting according to IB Computer Science standards. If conversion
   * fails, this may contain error information or partial results.
   */
  pseudocode: string;
  
  /**
   * Indicates whether the conversion completed successfully.
   * 
   * A value of true means the conversion completed without critical errors,
   * though warnings may still be present. A value of false indicates that
   * critical errors prevented successful conversion.
   */
  success: boolean;
  
  /**
   * Array of critical errors that occurred during conversion.
   * 
   * These are errors that prevented successful conversion, such as syntax
   * errors in the input Java code or unsupported language constructs.
   */
  errors: ConversionError[];
  
  /**
   * Array of warnings generated during conversion.
   * 
   * Warnings indicate potential issues or approximations in the conversion
   * that don't prevent success but may require manual review.
   */
  warnings: ConversionWarning[];
  
  /**
   * Metadata about the conversion process.
   * 
   * Contains statistical information about the conversion, such as
   * processing time and line counts.
   */
  metadata: ConversionMetadata;
}

/**
 * Represents an error that occurred during the conversion process.
 * 
 * Errors contain detailed information about what went wrong, where it
 * occurred in the source code, and how severe the issue is.
 */
export interface ConversionError {
  /** The category of error that occurred */
  type: ErrorType;
  
  /** Human-readable description of the error */
  message: string;
  
  /** Location in the source code where the error occurred */
  location: SourceLocation;
  
  /** Severity level of the error */
  severity: ErrorSeverity;
}

/**
 * Represents a warning generated during the conversion process.
 * 
 * Warnings indicate potential issues or approximations that don't prevent
 * conversion but may require attention or manual review.
 */
export interface ConversionWarning {
  /** The category of warning that was generated */
  type: ErrorType;
  
  /** Human-readable description of the warning */
  message: string;
  
  /** Location in the source code that triggered the warning */
  location: SourceLocation;
  
  /** Severity level of the warning */
  severity: ErrorSeverity;
}

/**
 * Metadata about the conversion process and results.
 * 
 * Provides statistical information about the conversion operation,
 * useful for performance monitoring and result analysis.
 */
export interface ConversionMetadata {
  /** Number of lines in the original Java source code */
  originalLines: number;
  
  /** Number of lines in the converted pseudocode output */
  convertedLines: number;
  
  /** Time taken to complete the conversion, in milliseconds */
  processingTime: number;
}

/**
 * Represents a location within source code.
 * 
 * Used to pinpoint where errors, warnings, or other events occurred
 * during the parsing and conversion process.
 */
export interface SourceLocation {
  /** Line number in the source code (1-based) */
  line: number;
  
  /** Column number in the source code (1-based) */
  column: number;
  
  /** Optional filename, if processing multiple files */
  file?: string;
}

/**
 * Categories of errors that can occur during conversion.
 * 
 * These types help classify errors by the stage of processing
 * where they occurred, making debugging easier.
 */
export enum ErrorType {
  /** Errors in tokenizing the source code (invalid characters, etc.) */
  LEXICAL_ERROR = 'lexical',
  
  /** Errors in parsing tokens into an abstract syntax tree */
  SYNTAX_ERROR = 'syntax',
  
  /** Errors in semantic analysis (undefined variables, type mismatches) */
  SEMANTIC_ERROR = 'semantic',
  
  /** Errors in the conversion process itself */
  CONVERSION_ERROR = 'conversion',
}

/**
 * Severity levels for errors and warnings.
 * 
 * Determines how critical an issue is and whether it prevents
 * successful conversion.
 */
export enum ErrorSeverity {
  /** Critical errors that prevent successful conversion */
  ERROR = 'error',
  
  /** Non-critical issues that may require attention */
  WARNING = 'warning',
  
  /** Informational messages about the conversion process */
  INFO = 'info',
}

/**
 * Represents a token in the lexical analysis phase.
 * 
 * Tokens are the basic building blocks created by breaking down
 * the source code into meaningful units like keywords, identifiers,
 * operators, and literals.
 */
export interface Token {
  /** The category of this token */
  type: TokenType;
  
  /** The actual text content of the token */
  value: string;
  
  /** Location where this token appears in the source code */
  location: SourceLocation;
}

/**
 * Categories of tokens recognized by the lexer.
 * 
 * These types classify different kinds of tokens found in Java source code
 * during the lexical analysis phase.
 */
export enum TokenType {
  /** Java keywords like 'if', 'while', 'public', 'class', etc. */
  KEYWORD = 'keyword',
  
  /** Variable names, method names, class names, etc. */
  IDENTIFIER = 'identifier',
  
  /** String literals, numeric literals, boolean literals, etc. */
  LITERAL = 'literal',
  
  /** Operators like '+', '-', '==', '&&', etc. */
  OPERATOR = 'operator',
  
  /** Punctuation marks like '{', '}', '(', ')', ';', etc. */
  PUNCTUATION = 'punctuation',
  
  /** Whitespace characters (spaces, tabs, newlines) */
  WHITESPACE = 'whitespace',
  
  /** Single-line and multi-line comments */
  COMMENT = 'comment',
}

/**
 * Base interface for all Abstract Syntax Tree (AST) nodes.
 * 
 * AST nodes represent the hierarchical structure of the parsed Java code.
 * Each node corresponds to a syntactic construct in the language.
 */
export interface ASTNode {
  /** The specific type of this AST node */
  type: NodeType;
  
  /** Location in the source code where this construct appears */
  location: SourceLocation;
  
  /** Child nodes in the AST hierarchy (optional) */
  children?: ASTNode[];
}

/**
 * Types of AST nodes that can be created during parsing.
 * 
 * These node types represent different Java language constructs
 * that the parser can recognize and convert to pseudocode.
 */
export enum NodeType {
  /** Root node representing the entire program */
  PROGRAM = 'Program',
  
  /** Java class declaration */
  CLASS_DECLARATION = 'ClassDeclaration',
  
  /** Method or function declaration */
  METHOD_DECLARATION = 'MethodDeclaration',
  
  /** Variable declaration statement */
  VARIABLE_DECLARATION = 'VariableDeclaration',
  
  /** If-else conditional statement */
  IF_STATEMENT = 'IfStatement',
  
  /** While loop statement */
  WHILE_LOOP = 'WhileLoop',
  
  /** For loop statement */
  FOR_LOOP = 'ForLoop',
  
  /** Variable assignment statement */
  ASSIGNMENT = 'Assignment',
  
  /** Binary expression (operations with two operands) */
  BINARY_EXPRESSION = 'BinaryExpression',
  
  /** Method or function call */
  METHOD_CALL = 'MethodCall',
  
  /** Array element access */
  ARRAY_ACCESS = 'ArrayAccess',
  
  /** Literal values (numbers, strings, booleans) */
  LITERAL = 'Literal',
  
  /** Variable or method identifiers */
  IDENTIFIER = 'Identifier',
  
  /** Return statement in methods */
  RETURN_STATEMENT = 'ReturnStatement',
}
