/**
 * Unit tests for the Pseudocode Generation System
 */

import { PseudocodeGenerator, CodeGenerationOptions, createGeneratorFromConversionOptions } from '../src/code-generator';
import { PseudocodeNode, PseudocodeNodeType } from '../src/transformer';
import { ConversionOptions } from '../src/types';

describe('PseudocodeGenerator', () => {
  let generator: PseudocodeGenerator;

  beforeEach(() => {
    generator = new PseudocodeGenerator();
  });

  describe('constructor and options', () => {
    it('should use default options when none provided', () => {
      const gen = new PseudocodeGenerator();
      const options = gen.getOptions();
      
      expect(options.indentSize).toBe(2);
      expect(options.preserveComments).toBe(true);
      expect(options.indentChar).toBe(' ');
    });

    it('should use custom options when provided', () => {
      const customOptions: Partial<CodeGenerationOptions> = {
        indentSize: 4,
        preserveComments: false,
        indentChar: '\t'
      };
      
      const gen = new PseudocodeGenerator(customOptions);
      const options = gen.getOptions();
      
      expect(options.indentSize).toBe(4);
      expect(options.preserveComments).toBe(false);
      expect(options.indentChar).toBe('\t');
    });

    it('should update options correctly', () => {
      generator.updateOptions({ indentSize: 3 });
      const options = generator.getOptions();
      
      expect(options.indentSize).toBe(3);
      expect(options.preserveComments).toBe(true); // Should preserve other options
    });
  });

  describe('basic statement generation', () => {
    it('should generate simple statement with no indentation', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'X = 5',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('X = 5');
    });

    it('should generate statement with proper indentation', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'X = 5',
          indentLevel: 2,
          location: { line: 1, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('    X = 5'); // 2 levels * 2 spaces = 4 spaces
    });

    it('should generate multiple statements', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'X = 5',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'Y = 10',
          indentLevel: 0,
          location: { line: 2, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('X = 5\nY = 10');
    });
  });

  describe('expression generation', () => {
    it('should generate expression nodes', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.EXPRESSION,
          content: 'X + Y',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('X + Y');
    });

    it('should generate expression with indentation', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.EXPRESSION,
          content: 'X + Y',
          indentLevel: 1,
          location: { line: 1, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('  X + Y');
    });
  });

  describe('comment generation', () => {
    it('should generate comments when preserveComments is true', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.COMMENT,
          content: '// This is a comment',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('// This is a comment');
    });

    it('should skip comments when preserveComments is false', () => {
      generator.updateOptions({ preserveComments: false });
      
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.COMMENT,
          content: '// This is a comment',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'X = 5',
          indentLevel: 0,
          location: { line: 2, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('X = 5');
    });

    it('should generate comments with proper indentation', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.COMMENT,
          content: '// Indented comment',
          indentLevel: 2,
          location: { line: 1, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('    // Indented comment');
    });
  });

  describe('block generation', () => {
    it('should generate block with header and children', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.BLOCK,
          content: 'if X > 0 then',
          indentLevel: 0,
          location: { line: 1, column: 1 },
          children: [
            {
              type: PseudocodeNodeType.STATEMENT,
              content: 'output "positive"',
              indentLevel: 1,
              location: { line: 2, column: 1 }
            }
          ]
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('if X > 0 then\n  output "positive"');
    });

    it('should generate block without header but with children', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.BLOCK,
          content: '',
          indentLevel: 0,
          location: { line: 1, column: 1 },
          children: [
            {
              type: PseudocodeNodeType.STATEMENT,
              content: 'X = 5',
              indentLevel: 0,
              location: { line: 1, column: 1 }
            },
            {
              type: PseudocodeNodeType.STATEMENT,
              content: 'Y = 10',
              indentLevel: 0,
              location: { line: 2, column: 1 }
            }
          ]
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('X = 5\nY = 10');
    });
  });

  describe('complex control structures', () => {
    it('should generate if-else structure correctly', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'if X > 0 then',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'output "positive"',
          indentLevel: 1,
          location: { line: 2, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'else',
          indentLevel: 0,
          location: { line: 3, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'output "not positive"',
          indentLevel: 1,
          location: { line: 4, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'end if',
          indentLevel: 0,
          location: { line: 5, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      const expected = 'if X > 0 then\n  output "positive"\nelse\n  output "not positive"\nend if';
      expect(result).toBe(expected);
    });

    it('should generate nested loops correctly', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'loop I from 1 to 3',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'loop J from 1 to 2',
          indentLevel: 1,
          location: { line: 2, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'output I, J',
          indentLevel: 2,
          location: { line: 3, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'end loop',
          indentLevel: 1,
          location: { line: 4, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'end loop',
          indentLevel: 0,
          location: { line: 5, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      const expected = 'loop I from 1 to 3\n  loop J from 1 to 2\n    output I, J\n  end loop\nend loop';
      expect(result).toBe(expected);
    });
  });

  describe('function and procedure generation', () => {
    it('should generate function with proper formatting', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'FUNCTION ADD(X, Y)',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'RESULT = X + Y',
          indentLevel: 1,
          location: { line: 2, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'return RESULT',
          indentLevel: 1,
          location: { line: 3, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'END FUNCTION',
          indentLevel: 0,
          location: { line: 4, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      const expected = 'FUNCTION ADD(X, Y)\n  RESULT = X + Y\n  return RESULT\nEND FUNCTION';
      expect(result).toBe(expected);
    });

    it('should generate procedure with proper formatting', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'PROCEDURE PRINT_MESSAGE(MESSAGE)',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'output MESSAGE',
          indentLevel: 1,
          location: { line: 2, column: 1 }
        },
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'END PROCEDURE',
          indentLevel: 0,
          location: { line: 3, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      const expected = 'PROCEDURE PRINT_MESSAGE(MESSAGE)\n  output MESSAGE\nEND PROCEDURE';
      expect(result).toBe(expected);
    });
  });

  describe('custom indentation', () => {
    it('should use custom indent size', () => {
      const customGenerator = new PseudocodeGenerator({ indentSize: 4 });
      
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'X = 5',
          indentLevel: 1,
          location: { line: 1, column: 1 }
        }
      ];

      const result = customGenerator.generate(nodes);
      expect(result).toBe('    X = 5'); // 1 level * 4 spaces = 4 spaces
    });

    it('should use custom indent character', () => {
      const customGenerator = new PseudocodeGenerator({ 
        indentSize: 1, 
        indentChar: '\t' 
      });
      
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'X = 5',
          indentLevel: 2,
          location: { line: 1, column: 1 }
        }
      ];

      const result = customGenerator.generate(nodes);
      expect(result).toBe('\t\tX = 5'); // 2 levels * 1 tab = 2 tabs
    });
  });

  describe('edge cases', () => {
    it('should handle empty node array', () => {
      const result = generator.generate([]);
      expect(result).toBe('');
    });

    it('should handle nodes with empty content', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: '',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('');
    });

    it('should handle nodes with zero indent level', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'X = 5',
          indentLevel: 0,
          location: { line: 1, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('X = 5');
    });

    it('should handle deeply nested indentation', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'deeply nested',
          indentLevel: 5,
          location: { line: 1, column: 1 }
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('          deeply nested'); // 5 levels * 2 spaces = 10 spaces
    });
  });

  describe('children handling', () => {
    it('should handle nodes with children for non-block types', () => {
      const nodes: PseudocodeNode[] = [
        {
          type: PseudocodeNodeType.STATEMENT,
          content: 'parent statement',
          indentLevel: 0,
          location: { line: 1, column: 1 },
          children: [
            {
              type: PseudocodeNodeType.STATEMENT,
              content: 'child statement',
              indentLevel: 1,
              location: { line: 2, column: 1 }
            }
          ]
        }
      ];

      const result = generator.generate(nodes);
      expect(result).toBe('parent statement\n  child statement');
    });
  });
});

describe('createGeneratorFromConversionOptions', () => {
  it('should create generator with default options when no conversion options provided', () => {
    const generator = createGeneratorFromConversionOptions();
    const options = generator.getOptions();
    
    expect(options.indentSize).toBe(2);
    expect(options.preserveComments).toBe(true);
    expect(options.indentChar).toBe(' ');
  });

  it('should create generator with conversion options mapped correctly', () => {
    const conversionOptions: ConversionOptions = {
      indentSize: 4,
      preserveComments: false,
      strictMode: true // This should be ignored as it's not relevant to code generation
    };
    
    const generator = createGeneratorFromConversionOptions(conversionOptions);
    const options = generator.getOptions();
    
    expect(options.indentSize).toBe(4);
    expect(options.preserveComments).toBe(false);
    expect(options.indentChar).toBe(' '); // Should use default
  });

  it('should handle partial conversion options', () => {
    const conversionOptions: ConversionOptions = {
      indentSize: 3
      // preserveComments not specified
    };
    
    const generator = createGeneratorFromConversionOptions(conversionOptions);
    const options = generator.getOptions();
    
    expect(options.indentSize).toBe(3);
    expect(options.preserveComments).toBe(true); // Should use default
  });
});