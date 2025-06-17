/**
 * Type Definitions Index
 * Exports all type definitions for the Java to IB converter
 */

// IR (Intermediate Representation) types
export {
  IRNode,
  IRKind,
  IRMetadata,
  MethodInfo,
  Parameter,
  VariableInfo,
  ExpressionInfo,
  ControlInfo,
  SourceLocation,
  CreateIRNode,
  IRBuilder
} from './ir';

// Configuration types
export {
  ConversionOptions,
  IndentationConfig,
  OutputFormat,
  ParserOptions,
  EmitterOptions,
  DEFAULT_CONFIG,
  mergeConfig,
  ConfigValidator
} from './config';

// Error types
export {
  ConverterError,
  ParseError,
  SyntaxError,
  UnsupportedFeatureError,
  EmitError,
  ConfigError,
  ErrorSourceLocation,
  ErrorContext,
  ErrorSeverity,
  Diagnostic,
  DiagnosticCollection,
  RecoveryStrategy,
  RecoveryInfo
} from './errors';