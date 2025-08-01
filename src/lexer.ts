/**
 * Lexical analyzer for Java source code
 */

import { Token, TokenType, SourceLocation, ConversionError, ErrorType, ErrorSeverity } from './types';

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private errors: ConversionError[] = [];

  // Java keywords
  private static readonly KEYWORDS = new Set([
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
    'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
    'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'null',
    'package', 'private', 'protected', 'public', 'return', 'short', 'static',
    'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
    'transient', 'try', 'void', 'volatile', 'while', 'true', 'false'
  ]);

  // Java operators (multi-character first for proper matching)
  private static readonly OPERATORS = [
    '==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=',
    '<<', '>>', '>>>', '&=', '|=', '^=', '<<=', '>>=', '>>>=',
    '=', '+', '-', '*', '/', '%', '<', '>', '!', '&', '|', '^', '~', '?', ':'
  ];

  // Java punctuation
  private static readonly PUNCTUATION = new Set([
    '(', ')', '{', '}', '[', ']', ';', ',', '.'
  ]);

  constructor(input: string) {
    this.input = input;
  }

  /**
   * Tokenize the input Java code
   * @returns Array of tokens and any lexical errors
   */
  tokenize(): { tokens: Token[], errors: ConversionError[] } {
    // Performance optimization: Use regular array with push for simplicity and reliability
    const tokens: Token[] = [];
    this.errors = [];

    while (!this.isAtEnd()) {
      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }

    return { tokens, errors: this.errors };
  }

  private nextToken(): Token | null {
    this.skipWhitespace();
    
    if (this.isAtEnd()) {
      return null;
    }

    const start = this.getCurrentLocation();
    const char = this.peek();

    // Comments
    if (char === '/' && this.peekNext() === '/') {
      return this.readLineComment(start);
    }
    if (char === '/' && this.peekNext() === '*') {
      return this.readBlockComment(start);
    }

    // String literals
    if (char === '"') {
      return this.readStringLiteral(start);
    }

    // Character literals
    if (char === "'") {
      return this.readCharLiteral(start);
    }

    // Numeric literals
    if (this.isDigit(char)) {
      return this.readNumericLiteral(start);
    }

    // Identifiers and keywords
    if (this.isAlpha(char) || char === '_' || char === '$') {
      return this.readIdentifierOrKeyword(start);
    }

    // Operators (check multi-character first)
    const operator = this.readOperator();
    if (operator) {
      return {
        type: TokenType.OPERATOR,
        value: operator,
        location: start
      };
    }

    // Punctuation
    if (Lexer.PUNCTUATION.has(char)) {
      this.advance();
      return {
        type: TokenType.PUNCTUATION,
        value: char,
        location: start
      };
    }

    // Invalid character
    this.addError(
      ErrorType.LEXICAL_ERROR, 
      `Unexpected character '${char}' (Unicode: ${char.charCodeAt(0)}). Only valid Java characters are allowed.`, 
      start
    );
    this.advance(); // Skip invalid character
    return null;
  }

  private readLineComment(start: SourceLocation): Token {
    let value = '';
    
    // Skip the //
    this.advance();
    this.advance();
    
    while (!this.isAtEnd() && this.peek() !== '\n') {
      value += this.advance();
    }
    
    return {
      type: TokenType.COMMENT,
      value: '//' + value,
      location: start
    };
  }

  private readBlockComment(start: SourceLocation): Token {
    let value = '';
    
    // Skip the /*
    this.advance();
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.peek() === '*' && this.peekNext() === '/') {
        this.advance(); // *
        this.advance(); // /
        break;
      }
      value += this.advance();
    }
    
    return {
      type: TokenType.COMMENT,
      value: '/*' + value + '*/',
      location: start
    };
  }

  private readStringLiteral(start: SourceLocation): Token {
    let value = '';
    
    // Skip opening quote
    this.advance();
    
    while (!this.isAtEnd() && this.peek() !== '"') {
      if (this.peek() === '\\') {
        // Handle escape sequences
        this.advance(); // Skip backslash
        if (!this.isAtEnd()) {
          const escaped = this.advance();
          value += '\\' + escaped;
        }
      } else {
        value += this.advance();
      }
    }
    
    if (this.isAtEnd()) {
      this.addError(
        ErrorType.LEXICAL_ERROR, 
        'Unterminated string literal. Missing closing quote (") before end of file.', 
        start
      );
    } else {
      this.advance(); // Skip closing quote
    }
    
    return {
      type: TokenType.LITERAL,
      value: '"' + value + '"',
      location: start
    };
  }

  private readCharLiteral(start: SourceLocation): Token {
    let value = '';
    
    // Skip opening quote
    this.advance();
    
    if (!this.isAtEnd() && this.peek() !== "'") {
      if (this.peek() === '\\') {
        // Handle escape sequences
        this.advance(); // Skip backslash
        if (!this.isAtEnd()) {
          const escaped = this.advance();
          value += '\\' + escaped;
        }
      } else {
        value += this.advance();
      }
    }
    
    if (this.isAtEnd() || this.peek() !== "'") {
      this.addError(
        ErrorType.LEXICAL_ERROR, 
        'Unterminated character literal. Missing closing single quote (\') or invalid character sequence.', 
        start
      );
    } else {
      this.advance(); // Skip closing quote
    }
    
    return {
      type: TokenType.LITERAL,
      value: "'" + value + "'",
      location: start
    };
  }

  private readNumericLiteral(start: SourceLocation): Token {
    let value = '';
    
    // Read integer part
    while (!this.isAtEnd() && this.isDigit(this.peek())) {
      value += this.advance();
    }
    
    // Check for decimal point
    if (!this.isAtEnd() && this.peek() === '.' && this.isDigit(this.peekNext())) {
      value += this.advance(); // Add decimal point
      
      // Read fractional part
      while (!this.isAtEnd() && this.isDigit(this.peek())) {
        value += this.advance();
      }
    }
    
    // Check for scientific notation
    if (!this.isAtEnd() && (this.peek() === 'e' || this.peek() === 'E')) {
      value += this.advance();
      
      if (!this.isAtEnd() && (this.peek() === '+' || this.peek() === '-')) {
        value += this.advance();
      }
      
      while (!this.isAtEnd() && this.isDigit(this.peek())) {
        value += this.advance();
      }
    }
    
    // Check for type suffixes (f, F, d, D, l, L)
    if (!this.isAtEnd() && /[fFdDlL]/.test(this.peek())) {
      value += this.advance();
    }
    
    return {
      type: TokenType.LITERAL,
      value,
      location: start
    };
  }

  private readIdentifierOrKeyword(start: SourceLocation): Token {
    let value = '';
    
    while (!this.isAtEnd() && (this.isAlphaNumeric(this.peek()) || this.peek() === '_' || this.peek() === '$')) {
      value += this.advance();
    }
    
    const type = Lexer.KEYWORDS.has(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
    
    return {
      type,
      value,
      location: start
    };
  }

  private readOperator(): string | null {
    // Check multi-character operators first
    for (const op of Lexer.OPERATORS) {
      if (this.matchString(op)) {
        for (let i = 0; i < op.length; i++) {
          this.advance();
        }
        return op;
      }
    }
    
    return null;
  }

  private matchString(str: string): boolean {
    for (let i = 0; i < str.length; i++) {
      if (this.position + i >= this.input.length || 
          this.input[this.position + i] !== str[i]) {
        return false;
      }
    }
    return true;
  }

  private skipWhitespace(): void {
    while (!this.isAtEnd() && this.isWhitespace(this.peek())) {
      this.advance();
    }
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  private isDigit(char: string): boolean {
    return /\d/.test(char);
  }

  private isAlpha(char: string): boolean {
    return /[a-zA-Z]/.test(char);
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.input[this.position];
  }

  private peekNext(): string {
    if (this.position + 1 >= this.input.length) return '\0';
    return this.input[this.position + 1];
  }

  private advance(): string {
    if (this.isAtEnd()) return '\0';
    
    const char = this.input[this.position];
    this.position++;
    
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    
    return char;
  }

  private isAtEnd(): boolean {
    return this.position >= this.input.length;
  }

  private getCurrentLocation(): SourceLocation {
    return {
      line: this.line,
      column: this.column
    };
  }

  private addError(type: ErrorType, message: string, location: SourceLocation): void {
    this.errors.push({
      type,
      message,
      location,
      severity: ErrorSeverity.ERROR
    });
  }
}