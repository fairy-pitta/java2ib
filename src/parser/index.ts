/**
 * Java Parser
 * Parses Java source code into Intermediate Representation (IR)
 */

import {
  IRNode,
  IRBuilder,
  ParserOptions,
  ParseError,
  DiagnosticCollection,
  SourceLocation
} from '../types';

/**
 * Token types for lexical analysis
 */
enum TokenType {
  // Literals
  IDENTIFIER = 'identifier',
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',

  // Keywords
  CLASS = 'class',
  PUBLIC = 'public',
  PRIVATE = 'private',
  STATIC = 'static',
  VOID = 'void',
  INT = 'int',
  STRING_TYPE = 'String',
  BOOLEAN_TYPE = 'boolean',
  IF = 'if',
  ELSE = 'else',
  WHILE = 'while',
  FOR = 'for',
  RETURN = 'return',

  // Operators
  ASSIGN = '=',
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
  MODULO = '%',
  EQUALS = '==',
  NOT_EQUALS = '!=',
  LESS_THAN = '<',
  GREATER_THAN = '>',
  LESS_EQUAL = '<=',
  GREATER_EQUAL = '>=',
  AND = '&&',
  OR = '||',
  NOT = '!',
  
  // Compound assignment operators
  PLUS_ASSIGN = '+=',
  MINUS_ASSIGN = '-=',
  MULTIPLY_ASSIGN = '*=',
  DIVIDE_ASSIGN = '/=',
  MODULO_ASSIGN = '%=',
  
  // Increment/Decrement operators
  INCREMENT = '++',
  DECREMENT = '--',

  // Punctuation
  SEMICOLON = ';',
  COMMA = ',',
  DOT = '.',
  LEFT_PAREN = '(',
  RIGHT_PAREN = ')',
  LEFT_BRACE = '{',
  RIGHT_BRACE = '}',
  LEFT_BRACKET = '[',
  RIGHT_BRACKET = ']',

  // Special
  NEWLINE = 'newline',
  WHITESPACE = 'whitespace',
  COMMENT = 'comment',
  EOF = 'eof'
}

/**
 * Token representation
 */
interface Token {
  type: TokenType;
  value: string;
  location: SourceLocation;
}

/**
 * Lexer for tokenizing Java source code
 */
class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private diagnostics: DiagnosticCollection;

  constructor(source: string, diagnostics: DiagnosticCollection) {
    this.source = source;
    this.diagnostics = diagnostics;
  }

  /**
   * Tokenize the entire source
   */
  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (!this.isAtEnd()) {
      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }
    
    tokens.push({
      type: TokenType.EOF,
      value: '',
      location: this.getCurrentLocation()
    });
    
    return tokens;
  }

  /**
   * Get the next token
   */
  private nextToken(): Token | null {
    this.skipWhitespace();
    
    if (this.isAtEnd()) {
      return null;
    }
    
    const start = this.getCurrentLocation();
    const char = this.advance();
    
    // Single character tokens
    switch (char) {
      case '(': return this.makeToken(TokenType.LEFT_PAREN, char, start);
      case ')': return this.makeToken(TokenType.RIGHT_PAREN, char, start);
      case '{': return this.makeToken(TokenType.LEFT_BRACE, char, start);
      case '}': return this.makeToken(TokenType.RIGHT_BRACE, char, start);
      case '[': return this.makeToken(TokenType.LEFT_BRACKET, char, start);
      case ']': return this.makeToken(TokenType.RIGHT_BRACKET, char, start);
      case ';': return this.makeToken(TokenType.SEMICOLON, char, start);
      case ',': return this.makeToken(TokenType.COMMA, char, start);
      case '.': return this.makeToken(TokenType.DOT, char, start);
      case '+':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.PLUS_ASSIGN, '+=', start);
        } else if (this.peek() === '+') {
          this.advance();
          return this.makeToken(TokenType.INCREMENT, '++', start);
        }
        return this.makeToken(TokenType.PLUS, char, start);
      case '-':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.MINUS_ASSIGN, '-=', start);
        } else if (this.peek() === '-') {
          this.advance();
          return this.makeToken(TokenType.DECREMENT, '--', start);
        }
        return this.makeToken(TokenType.MINUS, char, start);
      case '*':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.MULTIPLY_ASSIGN, '*=', start);
        }
        return this.makeToken(TokenType.MULTIPLY, char, start);
      case '/': 
        if (this.peek() === '/') {
          return this.lineComment(start);
        } else if (this.peek() === '*') {
          return this.blockComment(start);
        } else if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.DIVIDE_ASSIGN, '/=', start);
        }
        return this.makeToken(TokenType.DIVIDE, char, start);
      case '%':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.MODULO_ASSIGN, '%=', start);
        }
        return this.makeToken(TokenType.MODULO, char, start);
      case '=':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.EQUALS, '==', start);
        }
        return this.makeToken(TokenType.ASSIGN, char, start);
      case '!':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.NOT_EQUALS, '!=', start);
        }
        return this.makeToken(TokenType.NOT, char, start);
      case '<':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.LESS_EQUAL, '<=', start);
        }
        return this.makeToken(TokenType.LESS_THAN, char, start);
      case '>':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.GREATER_EQUAL, '>=', start);
        }
        return this.makeToken(TokenType.GREATER_THAN, char, start);
      case '&':
        if (this.peek() === '&') {
          this.advance();
          return this.makeToken(TokenType.AND, '&&', start);
        }
        break;
      case '|':
        if (this.peek() === '|') {
          this.advance();
          return this.makeToken(TokenType.OR, '||', start);
        }
        break;
      case '"':
        return this.string(start);
      case '\n':
        return this.makeToken(TokenType.NEWLINE, char, start);
    }
    
    // Numbers
    if (this.isDigit(char)) {
      return this.number(char, start);
    }
    
    // Identifiers and keywords
    if (this.isAlpha(char)) {
      return this.identifier(char, start);
    }
    
    // Unknown character
    this.diagnostics.addError(
      `Unexpected character: ${char}`,
      'UNEXPECTED_CHARACTER',
      start
    );
    
    return null;
  }

  /**
   * Parse a string literal
   */
  private string(start: SourceLocation): Token {
    let value = '"'; // Include opening quote
    
    while (!this.isAtEnd() && this.peek() !== '"') {
      if (this.peek() === '\n') {
        this.diagnostics.addError(
          'Unterminated string literal',
          'UNTERMINATED_STRING',
          start
        );
        break;
      }
      
      if (this.peek() === '\\') {
        this.advance(); // Skip escape character
        const escaped = this.advance();
        switch (escaped) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case '"': value += '"'; break;
          default: value += escaped; break;
        }
      } else {
        value += this.advance();
      }
    }
    
    if (!this.isAtEnd()) {
      value += this.advance(); // Include closing quote
    }
    
    return this.makeToken(TokenType.STRING, value, start);
  }

  /**
   * Parse a number literal
   */
  private number(firstChar: string, start: SourceLocation): Token {
    let value = firstChar;
    
    while (!this.isAtEnd() && this.isDigit(this.peek())) {
      value += this.advance();
    }
    
    // Handle decimal numbers
    if (!this.isAtEnd() && this.peek() === '.' && this.isDigit(this.peekNext())) {
      value += this.advance(); // Consume '.'
      while (!this.isAtEnd() && this.isDigit(this.peek())) {
        value += this.advance();
      }
    }
    
    return this.makeToken(TokenType.NUMBER, value, start);
  }

  /**
   * Parse an identifier or keyword
   */
  private identifier(firstChar: string, start: SourceLocation): Token {
    let value = firstChar;
    
    while (!this.isAtEnd() && (this.isAlphaNumeric(this.peek()) || this.peek() === '_')) {
      value += this.advance();
    }
    
    // Check if it's a keyword
    const tokenType = this.getKeywordType(value) || TokenType.IDENTIFIER;
    
    return this.makeToken(tokenType, value, start);
  }

  /**
   * Parse a line comment
   */
  private lineComment(start: SourceLocation): Token {
    let value = '//';
    this.advance(); // Skip second '/'
    
    while (!this.isAtEnd() && this.peek() !== '\n') {
      value += this.advance();
    }
    
    return this.makeToken(TokenType.COMMENT, value, start);
  }

  /**
   * Parse a block comment
   */
  private blockComment(start: SourceLocation): Token {
    let value = '/*';
    this.advance(); // Skip '*'
    
    while (!this.isAtEnd()) {
      if (this.peek() === '*' && this.peekNext() === '/') {
        value += this.advance(); // '*'
        value += this.advance(); // '/'
        break;
      }
      value += this.advance();
    }
    
    return this.makeToken(TokenType.COMMENT, value, start);
  }

  /**
   * Get keyword token type
   */
  private getKeywordType(value: string): TokenType | null {
    const keywords: Record<string, TokenType> = {
      'class': TokenType.CLASS,
      'public': TokenType.PUBLIC,
      'private': TokenType.PRIVATE,
      'static': TokenType.STATIC,
      'void': TokenType.VOID,
      'int': TokenType.INT,
      'String': TokenType.STRING_TYPE,
      'boolean': TokenType.BOOLEAN_TYPE,
      'if': TokenType.IF,
      'else': TokenType.ELSE,
      'while': TokenType.WHILE,
      'for': TokenType.FOR,
      'return': TokenType.RETURN,
      'true': TokenType.BOOLEAN,
      'false': TokenType.BOOLEAN
    };
    
    return keywords[value] || null;
  }

  /**
   * Helper methods
   */
  private isAtEnd(): boolean {
    return this.position >= this.source.length;
  }

  private advance(): string {
    const char = this.source[this.position++];
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char || '\0';
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source[this.position] || '\0';
  }

  private peekNext(): string {
    if (this.position + 1 >= this.source.length) return '\0';
    return this.source[this.position + 1] || '\0';
  }

  private skipWhitespace(): void {
    while (!this.isAtEnd()) {
      const char = this.peek();
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
      } else {
        break;
      }
    }
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') ||
           (char >= 'A' && char <= 'Z') ||
           char === '_';
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private getCurrentLocation(): SourceLocation {
    return {
      line: this.line,
      column: this.column
    };
  }

  private makeToken(type: TokenType, value: string, location: SourceLocation): Token {
    return { type, value, location };
  }
}

/**
 * Main Parser class
 */
export class Parser {
  private tokens: Token[];
  private current: number = 0;
  private diagnostics: DiagnosticCollection;
  constructor(options: ParserOptions = {}) {
    this.tokens = [];
    this.diagnostics = new DiagnosticCollection();
    // options parameter is available for future use
    void options;
  }

  /**
   * Parse Java source code into IR
   */
  parse(source: string): { ir: IRNode | null; diagnostics: DiagnosticCollection } {
    this.diagnostics.clear();
    
    try {
      // Tokenize
      const lexer = new Lexer(source, this.diagnostics);
      this.tokens = lexer.tokenize();
      this.current = 0;
      
      // Parse
      const ir = this.parseProgram();
      
      return { ir, diagnostics: this.diagnostics };
    } catch (error) {
      if (error instanceof ParseError) {
        this.diagnostics.addError(error.message, error.code, error.location);
      } else {
        this.diagnostics.addError(
          `Unexpected error during parsing: ${error}`,
          'UNEXPECTED_ERROR'
        );
      }
      
      return { ir: null, diagnostics: this.diagnostics };
    }
  }

  /**
   * Parse program (top-level)
   */
  private parseProgram(): IRNode {
    const children: IRNode[] = [];
    
    // Skip initial comments and newlines
    this.skipCommentsAndNewlines();
    
    while (!this.isAtEnd()) {
      const node = this.parseTopLevel();
      if (node) {
        children.push(node);
      }
      this.skipCommentsAndNewlines();
    }
    
    return IRBuilder.program(children);
  }

  /**
   * Parse top-level constructs (classes, methods, statements)
   */
  private parseTopLevel(): IRNode | null {
    // For now, we'll implement a simplified parser that focuses on statements
    // This will be expanded in later phases
    
    if (this.match(TokenType.PUBLIC, TokenType.PRIVATE)) {
      return this.parseMethod();
    }
    
    if (this.match(TokenType.STATIC)) {
      return this.parseMethod();
    }
    
    // Try to parse as a statement (for simple cases like 'int x = 5;')
    const statement = this.parseStatement();
    if (statement) {
      return statement;
    }
    
    // Skip unknown constructs for now
    if (!this.isAtEnd()) {
      this.advance();
    }
    return null;
  }

  /**
   * Parse method declaration (simplified)
   */
  private parseMethod(): IRNode {
    const modifiers: string[] = [];
    
    // Parse modifiers
    while (this.match(TokenType.PUBLIC, TokenType.PRIVATE, TokenType.STATIC)) {
      modifiers.push(this.previous().value);
    }
    
    // Parse return type
    const returnType = this.advance().value;
    
    // Parse method name
    if (!this.check(TokenType.IDENTIFIER)) {
      throw new ParseError(
        'Expected method name',
        this.peek().location
      );
    }
    const methodName = this.advance().value;
    
    // Parse parameters
    this.consume(TokenType.LEFT_PAREN, 'Expected "(" after method name');
    const parameters = this.parseParameters();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after parameters');
    
    // Parse method body
    this.consume(TokenType.LEFT_BRACE, 'Expected "{" before method body');
    const body = this.parseBlock();
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after method body');
    
    return IRBuilder.method(methodName, parameters, returnType, body, modifiers);
  }

  /**
   * Parse method parameters
   */
  private parseParameters(): any[] {
    // Simplified parameter parsing
    // TODO: Implement full parameter parsing
    return [];
  }

  /**
   * Parse block of statements
   */
  private parseBlock(): IRNode[] {
    const statements: IRNode[] = [];
    
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      this.skipCommentsAndNewlines();
      
      if (this.check(TokenType.RIGHT_BRACE)) {
        break;
      }
      
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    return statements;
  }

  /**
   * Parse statement
   */
  private parseStatement(): IRNode | null {
    // Skip whitespace and comments
    this.skipCommentsAndNewlines();
    
    if (this.isAtEnd() || this.check(TokenType.RIGHT_BRACE)) {
      return null;
    }
    
    // Variable declaration with assignment: int x = 5;
    if (this.check(TokenType.INT) || this.check(TokenType.STRING_TYPE) || this.check(TokenType.BOOLEAN_TYPE)) {
      return this.parseVariableDeclaration();
    }
    
    // Assignment statement: x = 5; or compound assignment: x += 5;
     if (this.check(TokenType.IDENTIFIER)) {
       const checkpoint = this.current;
       this.advance(); // Skip identifier to check for assignment
       
       if (this.check(TokenType.ASSIGN) || this.check(TokenType.PLUS_ASSIGN) || 
           this.check(TokenType.MINUS_ASSIGN) || this.check(TokenType.MULTIPLY_ASSIGN) ||
           this.check(TokenType.DIVIDE_ASSIGN) || this.check(TokenType.MODULO_ASSIGN)) {
         this.current = checkpoint; // Reset
         return this.parseAssignment();
       }
       
       // Check for increment/decrement: x++; or x--;
       if (this.check(TokenType.INCREMENT) || this.check(TokenType.DECREMENT)) {
         this.current = checkpoint; // Reset
         return this.parseIncrementDecrement();
       }
       
       this.current = checkpoint; // Reset
     }
    
    // Skip unknown statements for now
    while (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.NEWLINE) && !this.isAtEnd()) {
      this.advance();
    }
    
    if (this.match(TokenType.SEMICOLON)) {
      // Statement consumed
    }
    
    return null;
  }
  
  /**
   * Parse variable declaration: int x = 5;
   */
  private parseVariableDeclaration(): IRNode {
     this.advance(); // Skip type (int, String, boolean) - not used in IR for now
    
    if (!this.check(TokenType.IDENTIFIER)) {
      throw new ParseError('Expected variable name', this.peek().location);
    }
    
    const name = this.advance().value;
    
    if (this.match(TokenType.ASSIGN)) {
      const value = this.parseExpression();
      this.consume(TokenType.SEMICOLON, 'Expected ";" after variable declaration');
      
      return IRBuilder.assignment(name, value);
    }
    
    this.consume(TokenType.SEMICOLON, 'Expected ";" after variable declaration');
    return IRBuilder.assignment(name, IRBuilder.literal('null'));
  }
  
  /**
   * Parse assignment: x = 5; or compound assignment: x += 5;
   */
  private parseAssignment(): IRNode {
    const name = this.advance().value; // variable name
    
    // Check for compound assignment operators
    if (this.match(TokenType.PLUS_ASSIGN, TokenType.MINUS_ASSIGN, TokenType.MULTIPLY_ASSIGN, 
                   TokenType.DIVIDE_ASSIGN, TokenType.MODULO_ASSIGN)) {
      const operator = this.previous().value;
      const rightValue = this.parseExpression();
      this.consume(TokenType.SEMICOLON, 'Expected ";" after assignment');
      
      // Convert compound assignment to regular assignment: x += 5 -> x = x + 5
      const baseOperator = operator.slice(0, -1); // Remove '=' from operator
      const leftSide = IRBuilder.identifier(name);
      const expandedValue = IRBuilder.binaryExpression(baseOperator, leftSide, rightValue);
      
      return IRBuilder.assignment(name, expandedValue);
    }
    
    // Regular assignment
    this.consume(TokenType.ASSIGN, 'Expected "="');
    const value = this.parseExpression();
    this.consume(TokenType.SEMICOLON, 'Expected ";" after assignment');
    
    return IRBuilder.assignment(name, value);
  }
  
  /**
   * Parse increment/decrement: x++; or x--;
   */
  private parseIncrementDecrement(): IRNode {
    const name = this.advance().value; // variable name
    
    if (this.match(TokenType.INCREMENT)) {
      this.consume(TokenType.SEMICOLON, 'Expected ";" after increment');
      // Convert x++ to x = x + 1
       const leftSide = IRBuilder.identifier(name);
       const one = IRBuilder.literal('1');
       const expandedValue = IRBuilder.binaryExpression('+', leftSide, one);
      return IRBuilder.assignment(name, expandedValue);
    }
    
    if (this.match(TokenType.DECREMENT)) {
      this.consume(TokenType.SEMICOLON, 'Expected ";" after decrement');
      // Convert x-- to x = x - 1
       const leftSide = IRBuilder.identifier(name);
       const one = IRBuilder.literal('1');
       const expandedValue = IRBuilder.binaryExpression('-', leftSide, one);
      return IRBuilder.assignment(name, expandedValue);
    }
    
    throw new ParseError('Expected increment or decrement operator', this.peek().location);
  }
  
  /**
   * Parse expression with operator precedence
   */
  private parseExpression(): IRNode {
    return this.parseLogicalOr();
  }
  
  /**
   * Parse logical OR (lowest precedence)
   */
  private parseLogicalOr(): IRNode {
    let expr = this.parseLogicalAnd();
    
    while (this.match(TokenType.OR)) {
      const operator = this.previous().value;
      const right = this.parseLogicalAnd();
      expr = IRBuilder.binaryExpression(operator, expr, right);
    }
    
    return expr;
  }
  
  /**
   * Parse logical AND
   */
  private parseLogicalAnd(): IRNode {
    let expr = this.parseEquality();
    
    while (this.match(TokenType.AND)) {
      const operator = this.previous().value;
      const right = this.parseEquality();
      expr = IRBuilder.binaryExpression(operator, expr, right);
    }
    
    return expr;
  }
  
  /**
   * Parse equality and inequality
   */
  private parseEquality(): IRNode {
    let expr = this.parseComparison();
    
    while (this.match(TokenType.EQUALS, TokenType.NOT_EQUALS)) {
      const operator = this.previous().value;
      const right = this.parseComparison();
      expr = IRBuilder.binaryExpression(operator, expr, right);
    }
    
    return expr;
  }
  
  /**
   * Parse comparison operators
   */
  private parseComparison(): IRNode {
    let expr = this.parseAddition();
    
    while (this.match(TokenType.LESS_THAN, TokenType.GREATER_THAN, TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL)) {
      const operator = this.previous().value;
      const right = this.parseAddition();
      expr = IRBuilder.binaryExpression(operator, expr, right);
    }
    
    return expr;
  }

  /**
   * Parse addition and subtraction (lowest precedence)
   */
  private parseAddition(): IRNode {
    let expr = this.parseMultiplication();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value;
      const right = this.parseMultiplication();
      expr = IRBuilder.binaryExpression(operator, expr, right);
    }

    return expr;
  }

  /**
   * Parse multiplication, division, and modulo (higher precedence)
   */
  private parseMultiplication(): IRNode {
    let expr = this.parseUnary();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expr = IRBuilder.binaryExpression(operator, expr, right);
    }

    return expr;
  }
  
  /**
   * Parse unary operators (NOT, etc.)
   */
  private parseUnary(): IRNode {
    if (this.match(TokenType.NOT)) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      return IRBuilder.unaryExpression(operator, right);
    }
    
    return this.parsePrimary();
  }

  /**
   * Parse primary expressions (literals, identifiers, parentheses)
   */
  private parsePrimary(): IRNode {
    if (this.check(TokenType.NUMBER)) {
      return IRBuilder.literal(this.advance().value);
    }
    
    if (this.check(TokenType.STRING)) {
      return IRBuilder.literal(this.advance().value);
    }
    
    if (this.check(TokenType.BOOLEAN)) {
      return IRBuilder.literal(this.advance().value);
    }
    
    if (this.check(TokenType.IDENTIFIER)) {
      return IRBuilder.identifier(this.advance().value);
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after expression');
      return expr;
    }
    
    throw new ParseError('Expected expression', this.peek().location);
  }

  /**
   * Helper methods
   */
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: TokenType.EOF, value: '', location: { line: 0, column: 0 } };
  }

  private previous(): Token {
    return this.tokens[this.current - 1] || { type: TokenType.EOF, value: '', location: { line: 0, column: 0 } };
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    
    throw new ParseError(message, this.peek().location);
  }

  private skipCommentsAndNewlines(): void {
    while (this.match(TokenType.COMMENT, TokenType.NEWLINE)) {
      // Skip
    }
  }
}