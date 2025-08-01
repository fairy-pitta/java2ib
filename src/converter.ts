/**
 * Main converter class for Java to IB Pseudocode conversion
 * 
 * This class provides the primary interface for converting Java source code
 * into IB Computer Science pseudocode format according to the official IB specification.
 * 
 * @example
 * ```typescript
 * import { JavaToIBConverter } from 'java-to-ib-pseudocode';
 * 
 * const converter = new JavaToIBConverter();
 * const result = converter.convert('int x = 5;');
 * console.log(result.pseudocode); // Output: X = 5
 * ```
 * 
 * @example
 * ```typescript
 * // Convert a method with options
 * const options = { preserveComments: true, indentSize: 2 };
 * const result = converter.convert(`
 *   public int add(int a, int b) {
 *     return a + b;
 *   }
 * `, options);
 * ```
 */

import { ConversionOptions, ConversionResult, ConversionError, ErrorType, ErrorSeverity, SourceLocation } from './types';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { ASTTransformer } from './transformer';
import { PseudocodeGenerator, createGeneratorFromConversionOptions } from './code-generator';
import { IBRulesEngine } from './ib-rules-engine';

/**
 * The main converter class that handles Java to IB pseudocode conversion.
 * 
 * This class orchestrates the entire conversion process through a multi-stage pipeline:
 * 1. Lexical analysis (tokenization)
 * 2. Parsing (AST generation)
 * 3. AST transformation (applying IB rules)
 * 4. Code generation (producing formatted pseudocode)
 * 
 * The converter is designed to be stateless and thread-safe, allowing multiple
 * conversions to be performed concurrently.
 */
export class JavaToIBConverter {
  private transformer: ASTTransformer;
  private ibRules: IBRulesEngine;
  
  // Performance optimization: Cache frequently used generators
  private generatorCache = new Map<string, PseudocodeGenerator>();
  
  // Performance optimization: Reuse lexer instances to avoid object creation overhead
  private lexerPool: Lexer[] = [];
  private maxPoolSize = 5;

  /**
   * Creates a new JavaToIBConverter instance.
   * 
   * The constructor initializes the internal components needed for conversion:
   * - IBRulesEngine for applying IB pseudocode formatting rules
   * - ASTTransformer for converting Java AST nodes to pseudocode format
   */
  constructor() {
    this.ibRules = new IBRulesEngine();
    this.transformer = new ASTTransformer();
  }

  /**
   * Convert Java code to IB pseudocode format.
   * 
   * This method performs the complete conversion process from Java source code
   * to IB Computer Science pseudocode format. The conversion follows the official
   * IB specification for pseudocode syntax and formatting.
   * 
   * @param javaCode - The Java source code to convert. Must be valid Java syntax.
   * @param options - Optional conversion settings to customize the output format.
   * @returns A ConversionResult object containing the converted pseudocode,
   *          success status, any errors or warnings, and conversion metadata.
   * 
   * @example
   * ```typescript
   * // Basic conversion
   * const result = converter.convert('int x = 10;');
   * if (result.success) {
   *   console.log(result.pseudocode); // "X = 10"
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // Conversion with options
   * const options = { preserveComments: true, indentSize: 2 };
   * const result = converter.convert(`
   *   // Calculate area
   *   public int calculateArea(int width, int height) {
   *     return width * height;
   *   }
   * `, options);
   * ```
   * 
   * @example
   * ```typescript
   * // Error handling
   * const result = converter.convert('invalid java code');
   * if (!result.success) {
   *   result.errors.forEach(error => {
   *     console.error(`${error.type}: ${error.message} at line ${error.location.line}`);
   *   });
   * }
   * ```
   */
  convert(javaCode: string, options?: ConversionOptions): ConversionResult {
    const startTime = Date.now(); // Use Date.now() for compatibility
    
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

    // Performance optimization: Pre-calculate line count more efficiently
    const originalLines = this.countLines(javaCode);
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

      // Performance optimization: Early exit for very large files
      if (javaCode.length > 1000000) { // 1MB limit
        return this.createErrorResult(
          'Input file too large (>1MB). Please split into smaller files.',
          originalLines,
          Date.now() - startTime,
          [{
            type: ErrorType.CONVERSION_ERROR,
            message: 'Input file exceeds maximum size limit of 1MB',
            location: { line: 1, column: 1 },
            severity: ErrorSeverity.ERROR,
          }]
        );
      }

      // Step 1: Lexical Analysis - Use pooled lexer for better performance
      const lexingStart = Date.now();
      const lexer = this.getLexer(javaCode);
      const tokenizeResult = lexer.tokenize();
      this.returnLexer(lexer);
      const lexingTime = Date.now() - lexingStart;
      if (tokenizeResult.errors.length > 0) {
        // Enhance lexer errors with better messages
        const enhancedLexErrors = tokenizeResult.errors.map(error => ({
          ...error,
          message: this.enhanceErrorMessage(error.message, error.location)
        }));
        errors.push(...enhancedLexErrors);
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
      const parsingStart = Date.now();
      const parser = new Parser(tokenizeResult.tokens);
      const parseResult = parser.parse();
      const parsingTime = Date.now() - parsingStart;
      if (parseResult.errors.length > 0) {
        // Enhance parser errors with better messages
        const enhancedParseErrors = parseResult.errors.map(error => ({
          ...error,
          message: this.enhanceErrorMessage(error.message, error.location)
        }));
        errors.push(...enhancedParseErrors);
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
      const transformationStart = Date.now();
      const transformResult = this.transformer.transform(parseResult.ast);
      const transformationTime = Date.now() - transformationStart;
      if (transformResult.errors.length > 0) {
        // Enhance transformation errors with better messages
        const enhancedTransformErrors = transformResult.errors.map(error => ({
          ...error,
          message: this.enhanceErrorMessage(error.message, error.location)
        }));
        errors.push(...enhancedTransformErrors);
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

      // Step 4: Code Generation - Use cached generator for better performance
      const codeGenerationStart = Date.now();
      const generator = this.getGenerator(options);
      const pseudocode = generator.generate(transformResult.pseudocodeAST);
      const codeGenerationTime = Date.now() - codeGenerationStart;

      const processingTime = Date.now() - startTime;
      const convertedLines = this.countLines(pseudocode);

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
          performanceBreakdown: {
            lexingTime,
            parsingTime,
            transformationTime,
            codeGenerationTime,
          },
          statistics: {
            tokenCount: tokenizeResult.tokens.length,
            astNodeCount: this.countASTNodes(parseResult.ast),
            inputSize: javaCode.length,
            outputSize: pseudocode.length,
          },
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
    // Enhance error messages with more context
    const enhancedErrors = errors.map(error => ({
      ...error,
      message: this.enhanceErrorMessage(error.message, error.location)
    }));

    return {
      pseudocode: `// Conversion failed: ${message}`,
      success: false,
      errors: enhancedErrors,
      warnings: [],
      metadata: {
        originalLines,
        convertedLines: 1,
        processingTime,
      },
    };
  }

  private enhanceErrorMessage(message: string, location: SourceLocation): string {
    const lineInfo = `at line ${location.line}, column ${location.column}`;
    
    // Add contextual information based on error patterns
    if (message.includes('Expected')) {
      return `${message} ${lineInfo}. Check for missing punctuation or incorrect syntax.`;
    } else if (message.includes('Unexpected token')) {
      return `${message} ${lineInfo}. Verify that all operators and identifiers are valid Java syntax.`;
    } else if (message.includes('Undefined') || message.includes('not found')) {
      return `${message} ${lineInfo}. Make sure all variables and methods are properly declared before use.`;
    } else if (message.includes('type')) {
      return `${message} ${lineInfo}. Check that variable types match their usage.`;
    } else {
      return `${message} ${lineInfo}`;
    }
  }

  /**
   * Performance optimization: Efficiently count lines without creating array
   */
  private countLines(text: string): number {
    let count = 1;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\n') {
        count++;
      }
    }
    return count;
  }

  /**
   * Performance optimization: Get a lexer from the pool or create new one
   */
  private getLexer(input: string): Lexer {
    if (this.lexerPool.length > 0) {
      const lexer = this.lexerPool.pop()!;
      // Reset lexer with new input
      (lexer as any).input = input;
      (lexer as any).position = 0;
      (lexer as any).line = 1;
      (lexer as any).column = 1;
      (lexer as any).errors = [];
      return lexer;
    }
    return new Lexer(input);
  }

  /**
   * Performance optimization: Return lexer to pool for reuse
   */
  private returnLexer(lexer: Lexer): void {
    if (this.lexerPool.length < this.maxPoolSize) {
      this.lexerPool.push(lexer);
    }
  }

  /**
   * Performance optimization: Get cached generator or create new one
   */
  private getGenerator(options?: ConversionOptions): PseudocodeGenerator {
    const cacheKey = JSON.stringify(options || {});
    
    if (this.generatorCache.has(cacheKey)) {
      return this.generatorCache.get(cacheKey)!;
    }
    
    const generator = createGeneratorFromConversionOptions(options);
    
    // Limit cache size to prevent memory leaks
    if (this.generatorCache.size < 10) {
      this.generatorCache.set(cacheKey, generator);
    }
    
    return generator;
  }

  /**
   * Count the total number of AST nodes recursively
   */
  private countASTNodes(ast: any): number {
    if (!ast) return 0;
    
    let count = 1; // Count this node
    
    if (ast.children && Array.isArray(ast.children)) {
      for (const child of ast.children) {
        count += this.countASTNodes(child);
      }
    }
    
    // Handle specific node types with additional child properties
    if (ast.declarations && Array.isArray(ast.declarations)) {
      for (const decl of ast.declarations) {
        count += this.countASTNodes(decl);
      }
    }
    
    return count;
  }
}
