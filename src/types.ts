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
  type: string;
  message: string;
  location: SourceLocation;
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