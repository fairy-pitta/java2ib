/**
 * Error Types
 * Custom error classes and types for the Java to IB converter
 */

/**
 * Base error class for all converter errors
 */
export abstract class ConverterError extends Error {
  /** Error code for programmatic handling */
  public readonly code: string;
  /** Source location where error occurred */
  public readonly location?: ErrorSourceLocation | undefined;
  /** Additional context information */
  public readonly context?: ErrorContext | undefined;

  constructor(message: string, code: string, location?: ErrorSourceLocation | undefined, context?: ErrorContext | undefined) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.location = location;
    this.context = context;
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get formatted error message with location info
   */
  getFormattedMessage(): string {
    let message = this.message;
    
    if (this.location) {
      message += ` at line ${this.location.line}, column ${this.location.column}`;
    }
    
    if (this.context?.sourceText) {
      message += `\nSource: ${this.context.sourceText}`;
    }
    
    return message;
  }
}

/**
 * Parser-specific errors
 */
export class ParseError extends ConverterError {
  constructor(message: string, location?: ErrorSourceLocation | undefined, context?: ErrorContext | undefined) {
    super(message, 'PARSE_ERROR', location, context);
  }
}

/**
 * Syntax errors in Java code
 */
export class SyntaxError extends ConverterError {
  constructor(message: string, location?: ErrorSourceLocation | undefined, context?: ErrorContext | undefined) {
    super(message, 'SYNTAX_ERROR', location, context);
  }
}

/**
 * Unsupported feature errors
 */
export class UnsupportedFeatureError extends ConverterError {
  /** The unsupported feature name */
  public readonly feature: string;

  constructor(feature: string, message?: string, location?: ErrorSourceLocation | undefined) {
    const defaultMessage = `Unsupported Java feature: ${feature}`;
    super(message || defaultMessage, 'UNSUPPORTED_FEATURE', location);
    this.feature = feature;
  }
}

/**
 * Emitter-specific errors
 */
export class EmitError extends ConverterError {
  constructor(message: string, location?: ErrorSourceLocation | undefined, context?: ErrorContext | undefined) {
    super(message, 'EMIT_ERROR', location, context);
  }
}

/**
 * Configuration errors
 */
export class ConfigError extends ConverterError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'CONFIG_ERROR', undefined, context);
  }
}

/**
 * Source location information for errors
 */
export interface ErrorSourceLocation {
  /** Line number (1-based) */
  line: number;
  /** Column number (1-based) */
  column: number;
  /** End line number */
  endLine?: number;
  /** End column number */
  endColumn?: number;
  /** Source file name */
  filename?: string;
}

/**
 * Additional error context
 */
export interface ErrorContext {
  /** Source text where error occurred */
  sourceText?: string;
  /** Suggested fix */
  suggestion?: string;
  /** Related error information */
  relatedErrors?: ConverterError[];
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  /** Fatal error - conversion cannot continue */
  FATAL = 'fatal',
  /** Error - significant issue but conversion may continue */
  ERROR = 'error',
  /** Warning - potential issue */
  WARNING = 'warning',
  /** Info - informational message */
  INFO = 'info'
}

/**
 * Diagnostic message
 */
export interface Diagnostic {
  /** Severity level */
  severity: ErrorSeverity;
  /** Error code */
  code: string;
  /** Human-readable message */
  message: string;
  /** Source location */
  location?: ErrorSourceLocation | undefined;
  /** Additional context */
  context?: ErrorContext | undefined;
}

/**
 * Collection of diagnostics
 */
export class DiagnosticCollection {
  private diagnostics: Diagnostic[] = [];

  /**
   * Add a diagnostic
   */
  add(diagnostic: Diagnostic): void {
    this.diagnostics.push(diagnostic);
  }

  /**
   * Add an error
   */
  addError(message: string, code: string, location?: ErrorSourceLocation | undefined, context?: ErrorContext | undefined): void {
    this.add({
      severity: ErrorSeverity.ERROR,
      code,
      message,
      location,
      context
    });
  }

  /**
   * Add a warning
   */
  addWarning(message: string, code: string, location?: ErrorSourceLocation | undefined, context?: ErrorContext | undefined): void {
    this.add({
      severity: ErrorSeverity.WARNING,
      code,
      message,
      location,
      context
    });
  }

  /**
   * Get all diagnostics
   */
  getAll(): Diagnostic[] {
    return [...this.diagnostics];
  }

  /**
   * Get diagnostics by severity
   */
  getBySeverity(severity: ErrorSeverity): Diagnostic[] {
    return this.diagnostics.filter(d => d.severity === severity);
  }

  /**
   * Check if there are any fatal errors
   */
  hasFatalErrors(): boolean {
    return this.diagnostics.some(d => d.severity === ErrorSeverity.FATAL);
  }

  /**
   * Check if there are any errors
   */
  hasErrors(): boolean {
    return this.diagnostics.some(d => d.severity === ErrorSeverity.ERROR || d.severity === ErrorSeverity.FATAL);
  }

  /**
   * Get error count
   */
  getErrorCount(): number {
    return this.diagnostics.filter(d => d.severity === ErrorSeverity.ERROR || d.severity === ErrorSeverity.FATAL).length;
  }

  /**
   * Get warning count
   */
  getWarningCount(): number {
    return this.diagnostics.filter(d => d.severity === ErrorSeverity.WARNING).length;
  }

  /**
   * Clear all diagnostics
   */
  clear(): void {
    this.diagnostics = [];
  }

  /**
   * Format all diagnostics as string
   */
  format(): string {
    return this.diagnostics.map(d => {
      let message = `${d.severity.toUpperCase()}: ${d.message}`;
      if (d.location) {
        message += ` at line ${d.location.line}, column ${d.location.column}`;
      }
      if (d.context?.sourceText) {
        message += `\nSource: ${d.context.sourceText}`;
      }
      return message;
    }).join('\n');
  }
}

/**
 * Error recovery strategies
 */
export enum RecoveryStrategy {
  /** Skip the problematic construct */
  SKIP = 'skip',
  /** Use a default/fallback value */
  DEFAULT = 'default',
  /** Attempt to fix the issue automatically */
  FIX = 'fix',
  /** Stop processing */
  ABORT = 'abort'
}

/**
 * Error recovery information
 */
export interface RecoveryInfo {
  /** Recovery strategy used */
  strategy: RecoveryStrategy;
  /** Description of what was done */
  description: string;
  /** Original error that was recovered from */
  originalError: ConverterError;
}