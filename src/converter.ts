/**
 * Main converter class for Java to IB Pseudocode conversion
 */

import { ConversionOptions, ConversionResult, ConversionError, ErrorType, ErrorSeverity } from './types';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { ASTTransformer } from './transformer';
import { PseudocodeGenerator, createGeneratorFromConversionOptions } from './code-generator';
import { IBRulesEngine } from './ib-rules-engine';

export class JavaToIBConverter {
  private transformer: ASTTransformer;
  private ibRules: IBRulesEngine;

  constructor() {
    this.ibRules = new IBRulesEngine();
    this.transformer = new ASTTransformer();
  }

  /**
   * Convert Java code to IB pseudocode format
   * @param javaCode - The Java source code to convert
   * @param options - Optional conversion settings
   * @returns Conversion result with pseudocode and metadata
   */
  convert(javaCode: string, options?: ConversionOptions): ConversionResult {
    const startTime = Date.now();
    
    // Handle null/undefined input
    if (javaCode === null || javaCode === undefined) {
      return this.createErrorResult(
        'Input code is null or undefined',
        1,
        Date.now() - startTime,
        [{
          type: ErrorType.CONVERSION_ERROR,
          message: 'Input code is null or undefined',
          location: { line: 1, column: 1 },
          severity: ErrorSeverity.ERROR,
        }]
      );
    }

    const originalLines = javaCode.split('\n').length;
    const errors: ConversionError[] = [];
    const warnings: ConversionError[] = [];

    try {
      // Validate input
      if (!javaCode || javaCode.trim().length === 0) {
        return this.createErrorResult(
          'Empty or invalid Java code provided',
          originalLines,
          Date.now() - startTime,
          [{
            type: ErrorType.CONVERSION_ERROR,
            message: 'Input code is empty or contains only whitespace',
            location: { line: 1, column: 1 },
            severity: ErrorSeverity.ERROR,
          }]
        );
      }

      // Step 1: Lexical Analysis
      const lexer = new Lexer(javaCode);
      const tokenizeResult = lexer.tokenize();
      if (tokenizeResult.errors.length > 0) {
        errors.push(...tokenizeResult.errors);
      }

      if (tokenizeResult.tokens.length === 0) {
        return this.createErrorResult(
          'No tokens found in input code',
          originalLines,
          Date.now() - startTime,
          errors.length > 0 ? errors : [{
            type: ErrorType.LEXICAL_ERROR,
            message: 'No valid tokens could be extracted from the input code',
            location: { line: 1, column: 1 },
            severity: ErrorSeverity.ERROR,
          }]
        );
      }

      // Step 2: Parsing
      const parser = new Parser(tokenizeResult.tokens);
      const parseResult = parser.parse();
      if (parseResult.errors.length > 0) {
        errors.push(...parseResult.errors);
      }

      if (!parseResult.ast) {
        return this.createErrorResult(
          'Failed to parse Java code',
          originalLines,
          Date.now() - startTime,
          errors.length > 0 ? errors : [{
            type: ErrorType.SYNTAX_ERROR,
            message: 'Could not build a valid syntax tree from the input code',
            location: { line: 1, column: 1 },
            severity: ErrorSeverity.ERROR,
          }]
        );
      }

      // Step 3: AST Transformation
      const transformResult = this.transformer.transform(parseResult.ast);
      if (transformResult.errors.length > 0) {
        errors.push(...transformResult.errors);
      }

      // Collect warnings from transformation
      if (transformResult.warnings && transformResult.warnings.length > 0) {
        warnings.push(...transformResult.warnings);
      }

      // If transformation failed completely, return error
      if (transformResult.pseudocodeAST.length === 0 && errors.length === 0) {
        return this.createErrorResult(
          'Failed to transform Java code to pseudocode',
          originalLines,
          Date.now() - startTime,
          [{
            type: ErrorType.CONVERSION_ERROR,
            message: 'No pseudocode could be generated from the input',
            location: { line: 1, column: 1 },
            severity: ErrorSeverity.ERROR,
          }]
        );
      }

      // Step 4: Code Generation
      const generator = createGeneratorFromConversionOptions(options);
      const pseudocode = generator.generate(transformResult.pseudocodeAST);

      const processingTime = Date.now() - startTime;
      const convertedLines = pseudocode.split('\n').length;

      // Determine success based on whether we have critical errors
      const criticalErrors = errors.filter(e => e.severity === ErrorSeverity.ERROR);
      const success = criticalErrors.length === 0 && pseudocode.trim().length > 0;

      // Convert warnings to proper format
      const formattedWarnings = warnings.map(w => ({
        type: w.type,
        message: w.message,
        location: w.location,
        severity: w.severity
      }));

      return {
        pseudocode,
        success,
        errors: criticalErrors,
        warnings: formattedWarnings,
        metadata: {
          originalLines,
          convertedLines,
          processingTime,
        },
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        errors.push({
          type: ErrorType.CONVERSION_ERROR,
          message: `Unexpected error during conversion: ${error.message}`,
          location: { line: 1, column: 1 },
          severity: ErrorSeverity.ERROR,
        });
      } else {
        errors.push({
          type: ErrorType.CONVERSION_ERROR,
          message: 'An unknown error occurred during conversion',
          location: { line: 1, column: 1 },
          severity: ErrorSeverity.ERROR,
        });
      }

      return this.createErrorResult(
        'Conversion failed due to unexpected error',
        originalLines,
        processingTime,
        errors
      );
    }
  }

  private createErrorResult(
    message: string,
    originalLines: number,
    processingTime: number,
    errors: ConversionError[]
  ): ConversionResult {
    return {
      pseudocode: `// Conversion failed: ${message}`,
      success: false,
      errors,
      warnings: [],
      metadata: {
        originalLines,
        convertedLines: 1,
        processingTime,
      },
    };
  }
}
