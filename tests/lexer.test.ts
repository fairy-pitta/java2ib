/**
 * Tests for the Java lexical analyzer
 */

import { Lexer } from '../src/lexer';
import { TokenType, ErrorType } from '../src/types';

describe('Lexer', () => {
  describe('Keywords', () => {
    test('should tokenize Java keywords correctly', () => {
      const keywords = ['int', 'double', 'boolean', 'if', 'else', 'while', 'for', 'class', 'public', 'private', 'static', 'void', 'return'];
      
      for (const keyword of keywords) {
        const lexer = new Lexer(keyword);
        const { tokens, errors } = lexer.tokenize();
        
        expect(errors).toHaveLength(0);
        expect(tokens).toHaveLength(1);
        expect(tokens[0].type).toBe(TokenType.KEYWORD);
        expect(tokens[0].value).toBe(keyword);
        expect(tokens[0].location.line).toBe(1);
        expect(tokens[0].location.column).toBe(1);
      }
    });

    test('should distinguish keywords from identifiers', () => {
      const lexer = new Lexer('int intValue');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(2);
      expect(tokens[0].type).toBe(TokenType.KEYWORD);
      expect(tokens[0].value).toBe('int');
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].value).toBe('intValue');
    });
  });

  describe('Identifiers', () => {
    test('should tokenize valid identifiers', () => {
      const identifiers = ['variable', 'myVar', 'var123', '_private', '$special', 'camelCase'];
      
      for (const identifier of identifiers) {
        const lexer = new Lexer(identifier);
        const { tokens, errors } = lexer.tokenize();
        
        expect(errors).toHaveLength(0);
        expect(tokens).toHaveLength(1);
        expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
        expect(tokens[0].value).toBe(identifier);
      }
    });

    test('should handle identifiers with underscores and dollar signs', () => {
      const lexer = new Lexer('_var $var var_name $var_123');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(4);
      expect(tokens[0].value).toBe('_var');
      expect(tokens[1].value).toBe('$var');
      expect(tokens[2].value).toBe('var_name');
      expect(tokens[3].value).toBe('$var_123');
    });
  });

  describe('Operators', () => {
    test('should tokenize arithmetic operators', () => {
      const lexer = new Lexer('+ - * / %');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(5);
      expect(tokens[0].type).toBe(TokenType.OPERATOR);
      expect(tokens[0].value).toBe('+');
      expect(tokens[1].value).toBe('-');
      expect(tokens[2].value).toBe('*');
      expect(tokens[3].value).toBe('/');
      expect(tokens[4].value).toBe('%');
    });

    test('should tokenize comparison operators', () => {
      const lexer = new Lexer('== != < > <= >=');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(6);
      expect(tokens[0].value).toBe('==');
      expect(tokens[1].value).toBe('!=');
      expect(tokens[2].value).toBe('<');
      expect(tokens[3].value).toBe('>');
      expect(tokens[4].value).toBe('<=');
      expect(tokens[5].value).toBe('>=');
    });

    test('should tokenize logical operators', () => {
      const lexer = new Lexer('&& || !');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(3);
      expect(tokens[0].value).toBe('&&');
      expect(tokens[1].value).toBe('||');
      expect(tokens[2].value).toBe('!');
    });

    test('should tokenize assignment operators', () => {
      const lexer = new Lexer('= += -= *= /= %=');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(6);
      expect(tokens[0].value).toBe('=');
      expect(tokens[1].value).toBe('+=');
      expect(tokens[2].value).toBe('-=');
      expect(tokens[3].value).toBe('*=');
      expect(tokens[4].value).toBe('/=');
      expect(tokens[5].value).toBe('%=');
    });

    test('should tokenize increment and decrement operators', () => {
      const lexer = new Lexer('++ --');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(2);
      expect(tokens[0].value).toBe('++');
      expect(tokens[1].value).toBe('--');
    });
  });

  describe('Literals', () => {
    test('should tokenize integer literals', () => {
      const lexer = new Lexer('42 0 123 999');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(4);
      expect(tokens[0].type).toBe(TokenType.LITERAL);
      expect(tokens[0].value).toBe('42');
      expect(tokens[1].value).toBe('0');
      expect(tokens[2].value).toBe('123');
      expect(tokens[3].value).toBe('999');
    });

    test('should tokenize floating point literals', () => {
      const lexer = new Lexer('3.14 0.5 123.456');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(3);
      expect(tokens[0].type).toBe(TokenType.LITERAL);
      expect(tokens[0].value).toBe('3.14');
      expect(tokens[1].value).toBe('0.5');
      expect(tokens[2].value).toBe('123.456');
    });

    test('should tokenize scientific notation literals', () => {
      const lexer = new Lexer('1e10 2.5e-3 1.23E+5');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(3);
      expect(tokens[0].value).toBe('1e10');
      expect(tokens[1].value).toBe('2.5e-3');
      expect(tokens[2].value).toBe('1.23E+5');
    });

    test('should tokenize literals with type suffixes', () => {
      const lexer = new Lexer('42L 3.14f 2.5d');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(3);
      expect(tokens[0].value).toBe('42L');
      expect(tokens[1].value).toBe('3.14f');
      expect(tokens[2].value).toBe('2.5d');
    });

    test('should tokenize string literals', () => {
      const lexer = new Lexer('"Hello World" "test" ""');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(3);
      expect(tokens[0].type).toBe(TokenType.LITERAL);
      expect(tokens[0].value).toBe('"Hello World"');
      expect(tokens[1].value).toBe('"test"');
      expect(tokens[2].value).toBe('""');
    });

    test('should tokenize string literals with escape sequences', () => {
      const lexer = new Lexer('"Hello\\nWorld" "Tab\\tSeparated" "Quote\\""');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(3);
      expect(tokens[0].value).toBe('"Hello\\nWorld"');
      expect(tokens[1].value).toBe('"Tab\\tSeparated"');
      expect(tokens[2].value).toBe('"Quote\\""');
    });

    test('should tokenize character literals', () => {
      const lexer = new Lexer("'a' 'Z' '1'");
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(3);
      expect(tokens[0].type).toBe(TokenType.LITERAL);
      expect(tokens[0].value).toBe("'a'");
      expect(tokens[1].value).toBe("'Z'");
      expect(tokens[2].value).toBe("'1'");
    });

    test('should tokenize character literals with escape sequences', () => {
      const lexer = new Lexer("'\\n' '\\t' '\\''");
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(3);
      expect(tokens[0].value).toBe("'\\n'");
      expect(tokens[1].value).toBe("'\\t'");
      expect(tokens[2].value).toBe("'\\''");
    });
  });

  describe('Punctuation', () => {
    test('should tokenize punctuation marks', () => {
      const lexer = new Lexer('( ) { } [ ] ; , .');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(9);
      expect(tokens[0].type).toBe(TokenType.PUNCTUATION);
      expect(tokens[0].value).toBe('(');
      expect(tokens[1].value).toBe(')');
      expect(tokens[2].value).toBe('{');
      expect(tokens[3].value).toBe('}');
      expect(tokens[4].value).toBe('[');
      expect(tokens[5].value).toBe(']');
      expect(tokens[6].value).toBe(';');
      expect(tokens[7].value).toBe(',');
      expect(tokens[8].value).toBe('.');
    });
  });

  describe('Comments', () => {
    test('should tokenize line comments', () => {
      const lexer = new Lexer('// This is a comment\n// Another comment');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(2);
      expect(tokens[0].type).toBe(TokenType.COMMENT);
      expect(tokens[0].value).toBe('// This is a comment');
      expect(tokens[1].type).toBe(TokenType.COMMENT);
      expect(tokens[1].value).toBe('// Another comment');
    });

    test('should tokenize block comments', () => {
      const lexer = new Lexer('/* This is a block comment */');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.COMMENT);
      expect(tokens[0].value).toBe('/* This is a block comment */');
    });

    test('should tokenize multi-line block comments', () => {
      const lexer = new Lexer('/* This is a\n   multi-line\n   comment */');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.COMMENT);
      expect(tokens[0].value).toBe('/* This is a\n   multi-line\n   comment */');
    });
  });

  describe('Whitespace Handling', () => {
    test('should skip whitespace between tokens', () => {
      const lexer = new Lexer('int   x   =   5;');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(5);
      expect(tokens[0].value).toBe('int');
      expect(tokens[1].value).toBe('x');
      expect(tokens[2].value).toBe('=');
      expect(tokens[3].value).toBe('5');
      expect(tokens[4].value).toBe(';');
    });

    test('should handle different types of whitespace', () => {
      const lexer = new Lexer('int\tx\n=\r\n5;');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(5);
      expect(tokens[0].value).toBe('int');
      expect(tokens[1].value).toBe('x');
      expect(tokens[2].value).toBe('=');
      expect(tokens[3].value).toBe('5');
      expect(tokens[4].value).toBe(';');
    });
  });

  describe('Location Tracking', () => {
    test('should track line and column numbers correctly', () => {
      const lexer = new Lexer('int x;\nboolean y;');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(6);
      
      // First line
      expect(tokens[0].location.line).toBe(1);
      expect(tokens[0].location.column).toBe(1);
      expect(tokens[1].location.line).toBe(1);
      expect(tokens[1].location.column).toBe(5);
      expect(tokens[2].location.line).toBe(1);
      expect(tokens[2].location.column).toBe(6);
      
      // Second line
      expect(tokens[3].location.line).toBe(2);
      expect(tokens[3].location.column).toBe(1);
      expect(tokens[4].location.line).toBe(2);
      expect(tokens[4].location.column).toBe(9);
      expect(tokens[5].location.line).toBe(2);
      expect(tokens[5].location.column).toBe(10);
    });
  });

  describe('Complex Java Code', () => {
    test('should tokenize a simple Java method', () => {
      const code = `
        public static void main(String[] args) {
          int x = 5;
          System.out.println("Hello World");
        }
      `;
      
      const lexer = new Lexer(code);
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens.length).toBeGreaterThan(0);
      
      // Check some key tokens
      const tokenValues = tokens.map(t => t.value);
      expect(tokenValues).toContain('public');
      expect(tokenValues).toContain('static');
      expect(tokenValues).toContain('void');
      expect(tokenValues).toContain('main');
      expect(tokenValues).toContain('String');
      expect(tokenValues).toContain('args');
      expect(tokenValues).toContain('int');
      expect(tokenValues).toContain('x');
      expect(tokenValues).toContain('=');
      expect(tokenValues).toContain('5');
      expect(tokenValues).toContain('System');
      expect(tokenValues).toContain('out');
      expect(tokenValues).toContain('println');
      expect(tokenValues).toContain('"Hello World"');
    });

    test('should tokenize Java control structures', () => {
      const code = `
        if (x > 0) {
          for (int i = 0; i < 10; i++) {
            while (condition) {
              // do something
            }
          }
        }
      `;
      
      const lexer = new Lexer(code);
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      
      const tokenValues = tokens.map(t => t.value);
      expect(tokenValues).toContain('if');
      expect(tokenValues).toContain('for');
      expect(tokenValues).toContain('while');
      expect(tokenValues).toContain('++');
      expect(tokenValues).toContain('<');
      expect(tokenValues).toContain('>');
      expect(tokenValues).toContain('// do something');
    });
  });

  describe('Error Handling', () => {
    test('should report error for invalid characters', () => {
      const lexer = new Lexer('int x = 5@;');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.LEXICAL_ERROR);
      expect(errors[0].message).toContain('Unexpected character');
      expect(errors[0].location.line).toBe(1);
      expect(errors[0].location.column).toBe(10);
    });

    test('should report error for unterminated string literal', () => {
      const lexer = new Lexer('"unterminated string');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.LEXICAL_ERROR);
      expect(errors[0].message).toBe('Unterminated string literal. Missing closing quote (") before end of file.');
    });

    test('should report error for unterminated character literal', () => {
      const lexer = new Lexer("'unterminated");
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.LEXICAL_ERROR);
      expect(errors[0].message).toBe('Unterminated character literal. Missing closing single quote (\') or invalid character sequence.');
    });

    test('should continue tokenizing after errors', () => {
      const lexer = new Lexer('int x @ = 5;');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(1);
      expect(tokens.length).toBeGreaterThan(0);
      
      const tokenValues = tokens.map(t => t.value);
      expect(tokenValues).toContain('int');
      expect(tokenValues).toContain('x');
      expect(tokenValues).toContain('=');
      expect(tokenValues).toContain('5');
    });

    test('should handle multiple errors in one input', () => {
      const lexer = new Lexer('int @ x # = 5;');
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(2);
      expect(errors[0].message).toContain('@');
      expect(errors[1].message).toContain('#');
    });
  });
});