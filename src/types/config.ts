/**
 * Configuration Types
 * Type definitions for converter configuration options
 */

/**
 * Main conversion configuration options
 */
export interface ConversionOptions {
  /** Whether to preserve comments in output */
  preserveComments?: boolean;
  /** Indentation settings */
  indentation?: IndentationConfig;
  /** Output format settings */
  outputFormat?: OutputFormat;
  /** Parser settings */
  parserOptions?: ParserOptions;
  /** Emitter settings */
  emitterOptions?: EmitterOptions;
}

/**
 * Indentation configuration
 */
export interface IndentationConfig {
  /** Type of indentation */
  type: 'spaces' | 'tabs';
  /** Number of spaces (if type is 'spaces') */
  size: number;
  /** Whether to use consistent indentation */
  consistent: boolean;
}

/**
 * Output format options
 */
export enum OutputFormat {
  /** Plain text pseudocode */
  PLAIN = 'plain',
  /** Markdown formatted pseudocode */
  MARKDOWN = 'markdown',
  /** HTML formatted pseudocode */
  HTML = 'html'
}

/**
 * Parser configuration options
 */
export interface ParserOptions {
  /** Whether to include source location information */
  includeLocations?: boolean;
  /** Whether to parse comments */
  parseComments?: boolean;
  /** Whether to handle incomplete code gracefully */
  tolerateErrors?: boolean;
  /** Maximum nesting depth to process */
  maxNestingDepth?: number;
}

/**
 * Emitter configuration options
 */
export interface EmitterOptions {
  /** Whether to include END statements for control structures */
  includeEndStatements?: boolean;
  /** Whether to use uppercase keywords */
  uppercaseKeywords?: boolean;
  /** Whether to add blank lines between sections */
  addBlankLines?: boolean;
  /** Maximum line length before wrapping */
  maxLineLength?: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Required<ConversionOptions> = {
  preserveComments: true,
  indentation: {
    type: 'spaces',
    size: 4,
    consistent: true
  },
  outputFormat: OutputFormat.PLAIN,
  parserOptions: {
    includeLocations: false,
    parseComments: true,
    tolerateErrors: true,
    maxNestingDepth: 10
  },
  emitterOptions: {
    includeEndStatements: true,
    uppercaseKeywords: true,
    addBlankLines: true,
    maxLineLength: 80
  }
};

/**
 * Merge user options with defaults
 */
export function mergeConfig(userOptions: ConversionOptions = {}): Required<ConversionOptions> {
  return {
    preserveComments: userOptions.preserveComments ?? DEFAULT_CONFIG.preserveComments,
    indentation: {
      ...DEFAULT_CONFIG.indentation,
      ...userOptions.indentation
    },
    outputFormat: userOptions.outputFormat ?? DEFAULT_CONFIG.outputFormat,
    parserOptions: {
      ...DEFAULT_CONFIG.parserOptions,
      ...userOptions.parserOptions
    },
    emitterOptions: {
      ...DEFAULT_CONFIG.emitterOptions,
      ...userOptions.emitterOptions
    }
  };
}

/**
 * Validation functions for configuration
 */
export class ConfigValidator {
  /**
   * Validate indentation configuration
   */
  static validateIndentation(config: IndentationConfig): string[] {
    const errors: string[] = [];
    
    if (config.type !== 'spaces' && config.type !== 'tabs') {
      errors.push('Indentation type must be "spaces" or "tabs"');
    }
    
    if (config.type === 'spaces' && (config.size < 1 || config.size > 8)) {
      errors.push('Indentation size must be between 1 and 8 spaces');
    }
    
    return errors;
  }
  
  /**
   * Validate parser options
   */
  static validateParserOptions(options: ParserOptions): string[] {
    const errors: string[] = [];
    
    if (options.maxNestingDepth !== undefined && options.maxNestingDepth < 1) {
      errors.push('Maximum nesting depth must be at least 1');
    }
    
    return errors;
  }
  
  /**
   * Validate emitter options
   */
  static validateEmitterOptions(options: EmitterOptions): string[] {
    const errors: string[] = [];
    
    if (options.maxLineLength !== undefined && options.maxLineLength < 20) {
      errors.push('Maximum line length must be at least 20 characters');
    }
    
    return errors;
  }
  
  /**
   * Validate entire configuration
   */
  static validate(config: ConversionOptions): string[] {
    const errors: string[] = [];
    
    if (config.indentation) {
      errors.push(...this.validateIndentation(config.indentation));
    }
    
    if (config.parserOptions) {
      errors.push(...this.validateParserOptions(config.parserOptions));
    }
    
    if (config.emitterOptions) {
      errors.push(...this.validateEmitterOptions(config.emitterOptions));
    }
    
    return errors;
  }
}