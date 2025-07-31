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
    const originalLines = javaCode.split('\n').length;
    const errors: ConversionError[] = [];
    const warnings: ConversionError[] = [];

    try {
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
          errors
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
          errors
        );
      }

      // Step 3: AST Transformation
      const transformResult = this.transformer.transform(parseResult.ast);
      if (transformResult.errors.length > 0) {
        errors.push(...transformResult.errors);
      }

      // Step 4: Code Generation
      const generator = createGeneratorFromConversionOptions(options);
      const pseudocode = generator.generate(transformResult.pseudocodeAST);

      const processingTime = Date.now() - startTime;
      const convertedLines = pseudocode.split('\n').length;

      // Determine success based on whether we have critical errors
      const criticalErrors = errors.filter(e => e.severity === ErrorSeverity.ERROR);
      const success = criticalErrors.length === 0 && pseudocode.trim().length > 0;

      return {
        pseudocode,
        success,
        errors: criticalErrors,
        warnings: errors.filter(e => e.severity === ErrorSeverity.WARNING),
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
