/**
 * Java to IB Pseudocode Converter
 * 
 * A TypeScript library that converts Java source code into IB Computer Science
 * pseudocode format according to the official IB specification. This library is
 * designed for educational purposes, enabling teachers and students to automatically
 * convert Java code examples into the standardized pseudocode format used in the
 * IB Computer Science curriculum.
 * 
 * ## Features
 * 
 * - **Complete Java Syntax Support**: Variables, control structures, methods, arrays, and OOP constructs
 * - **IB Specification Compliance**: Follows official IB pseudocode rules and formatting
 * - **Intelligent Transformations**: Converts Java naming conventions, operators, and syntax to IB format
 * - **Comprehensive Error Handling**: Detailed error messages with line numbers for debugging
 * - **TypeScript Support**: Full type definitions for enhanced development experience
 * - **Educational Focus**: Designed specifically for IB Computer Science curriculum needs
 * 
 * ## Quick Start
 * 
 * ```typescript
 * import { JavaToIBConverter } from 'java-to-ib-pseudocode';
 * 
 * const converter = new JavaToIBConverter();
 * const result = converter.convert('int x = 5;');
 * 
 * if (result.success) {
 *   console.log(result.pseudocode); // Output: X = 5
 * } else {
 *   console.error('Conversion failed:', result.errors);
 * }
 * ```
 * 
 * ## Main Exports
 * 
 * - {@link JavaToIBConverter} - The main converter class
 * - {@link ConversionOptions} - Configuration options for conversion
 * - {@link ConversionResult} - Result object containing converted pseudocode and metadata
 * - {@link ConversionError} - Error information for failed conversions
 * - {@link Lexer} - Low-level lexical analyzer (for advanced use)
 * - Various type definitions and enums for TypeScript support
 * 
 * @packageDocumentation
 */

// Export the main converter class and types
export * from './converter';
export * from './types';

// Export lexer for advanced users who need low-level access
export * from './lexer';
