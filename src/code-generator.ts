/**
 * Pseudocode Generation System for converting PseudocodeNode AST to formatted pseudocode strings
 */

import { PseudocodeNode, PseudocodeNodeType } from './transformer';
import { ConversionOptions } from './types';

export interface CodeGenerationOptions {
  indentSize: number;
  preserveComments: boolean;
  indentChar: string;
}

export class PseudocodeGenerator {
  private options: CodeGenerationOptions;

  constructor(options: Partial<CodeGenerationOptions> = {}) {
    this.options = {
      indentSize: options.indentSize ?? 2,
      preserveComments: options.preserveComments ?? true,
      indentChar: options.indentChar ?? ' ',
    };
  }

  /**
   * Generate formatted pseudocode from PseudocodeNode AST
   * @param nodes - Array of PseudocodeNode objects to convert
   * @returns Formatted pseudocode string
   */
  generate(nodes: PseudocodeNode[]): string {
    const lines: string[] = [];
    
    for (const node of nodes) {
      const generatedLines = this.generateNode(node);
      lines.push(...generatedLines);
    }

    return lines.join('\n');
  }

  /**
   * Generate lines for a single PseudocodeNode
   * @param node - The PseudocodeNode to generate
   * @returns Array of formatted lines
   */
  private generateNode(node: PseudocodeNode): string[] {
    const lines: string[] = [];

    switch (node.type) {
      case PseudocodeNodeType.STATEMENT:
        lines.push(this.formatLine(node.content, node.indentLevel));
        break;

      case PseudocodeNodeType.BLOCK:
        // For block nodes, generate the block header and then children
        if (node.content) {
          lines.push(this.formatLine(node.content, node.indentLevel));
        }
        if (node.children) {
          for (const child of node.children) {
            lines.push(...this.generateNode(child));
          }
        }
        break;

      case PseudocodeNodeType.EXPRESSION:
        // Expressions are typically inline and don't generate separate lines
        // They are handled as part of statements
        lines.push(this.formatLine(node.content, node.indentLevel));
        break;

      case PseudocodeNodeType.COMMENT:
        if (this.options.preserveComments) {
          lines.push(this.formatLine(node.content, node.indentLevel));
        }
        break;

      default:
        // Fallback for unknown node types
        lines.push(this.formatLine(node.content, node.indentLevel));
        break;
    }

    // Generate children if they exist and haven't been handled above
    if (node.children && node.type !== PseudocodeNodeType.BLOCK) {
      for (const child of node.children) {
        lines.push(...this.generateNode(child));
      }
    }

    return lines;
  }

  /**
   * Format a single line with proper indentation
   * @param content - The content to format
   * @param indentLevel - The indentation level
   * @returns Formatted line with indentation
   */
  private formatLine(content: string, indentLevel: number): string {
    const indent = this.generateIndent(indentLevel);
    return `${indent}${content}`;
  }

  /**
   * Generate indentation string for the given level
   * @param level - The indentation level
   * @returns Indentation string
   */
  private generateIndent(level: number): string {
    const totalSpaces = level * this.options.indentSize;
    return this.options.indentChar.repeat(totalSpaces);
  }

  /**
   * Update generation options
   * @param options - New options to merge
   */
  updateOptions(options: Partial<CodeGenerationOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get current generation options
   * @returns Current options
   */
  getOptions(): CodeGenerationOptions {
    return { ...this.options };
  }
}

/**
 * Utility function to create a PseudocodeGenerator from ConversionOptions
 * @param conversionOptions - ConversionOptions from the main API
 * @returns Configured PseudocodeGenerator
 */
export function createGeneratorFromConversionOptions(
  conversionOptions?: ConversionOptions
): PseudocodeGenerator {
  const generatorOptions: Partial<CodeGenerationOptions> = {};

  if (conversionOptions) {
    if (conversionOptions.indentSize !== undefined) {
      generatorOptions.indentSize = conversionOptions.indentSize;
    }
    if (conversionOptions.preserveComments !== undefined) {
      generatorOptions.preserveComments = conversionOptions.preserveComments;
    }
  }

  return new PseudocodeGenerator(generatorOptions);
}