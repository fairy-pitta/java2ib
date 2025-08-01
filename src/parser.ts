/**
 * Parser for Java source code that builds an Abstract Syntax Tree (AST)
 */

import { 
  Token, 
  TokenType, 
  ASTNode, 
  NodeType, 
  SourceLocation, 
  ConversionError, 
  ErrorType, 
  ErrorSeverity 
} from './types';

// Extended AST node interfaces for specific node types
export interface ProgramNode extends ASTNode {
  type: NodeType.PROGRAM;
  declarations: ASTNode[];
}

export interface ClassDeclarationNode extends ASTNode {
  type: NodeType.CLASS_DECLARATION;
  name: string;
  superClass?: string;
  methods: MethodDeclarationNode[];
  fields: VariableDeclarationNode[];
}

export interface MethodDeclarationNode extends ASTNode {
  type: NodeType.METHOD_DECLARATION;
  name: string;
  returnType: string;
  parameters: ParameterNode[];
  body: ASTNode[];
  isVoid: boolean;
  isStatic: boolean;
  isPublic: boolean;
}

export interface ParameterNode extends ASTNode {
  name: string;
  paramType: string;
}

export interface VariableDeclarationNode extends ASTNode {
  type: NodeType.VARIABLE_DECLARATION;
  name: string;
  dataType: string;
  initializer?: ASTNode;
}

export interface AssignmentNode extends ASTNode {
  type: NodeType.ASSIGNMENT;
  left: ASTNode;
  right: ASTNode;
  operator: string;
}

export interface BinaryExpressionNode extends ASTNode {
  type: NodeType.BINARY_EXPRESSION;
  left: ASTNode;
  right: ASTNode;
  operator: string;
}

export interface MethodCallNode extends ASTNode {
  type: NodeType.METHOD_CALL;
  object?: ASTNode;
  methodName: string;
  arguments: ASTNode[];
}

export interface IfStatementNode extends ASTNode {
  type: NodeType.IF_STATEMENT;
  condition: ASTNode;
  thenStatement: ASTNode;
  elseStatement?: ASTNode;
}

export interface WhileLoopNode extends ASTNode {
  type: NodeType.WHILE_LOOP;
  condition: ASTNode;
  body: ASTNode;
}

export interface ForLoopNode extends ASTNode {
  type: NodeType.FOR_LOOP;
  initialization?: ASTNode;
  condition?: ASTNode;
  update?: ASTNode;
  body: ASTNode;
}

export interface LiteralNode extends ASTNode {
  type: NodeType.LITERAL;
  value: string;
  dataType: 'string' | 'number' | 'boolean' | 'char';
}

export interface IdentifierNode extends ASTNode {
  type: NodeType.IDENTIFIER;
  name: string;
}

export interface ArrayAccessNode extends ASTNode {
  type: NodeType.ARRAY_ACCESS;
  array: ASTNode;
  index: ASTNode;
}

export interface ReturnStatementNode extends ASTNode {
  type: NodeType.RETURN_STATEMENT;
  expression?: ASTNode;
}

export interface SwitchStatementNode extends ASTNode {
  type: NodeType.SWITCH_STATEMENT;
  discriminant: ASTNode;
  cases: (CaseClauseNode | DefaultClauseNode)[];
}

export interface CaseClauseNode extends ASTNode {
  type: NodeType.CASE_CLAUSE;
  test: ASTNode;
  consequent: ASTNode[];
}

export interface DefaultClauseNode extends ASTNode {
  type: NodeType.DEFAULT_CLAUSE;
  consequent: ASTNode[];
}

export interface BreakStatementNode extends ASTNode {
  type: NodeType.BREAK_STATEMENT;
}

export interface ContinueStatementNode extends ASTNode {
  type: NodeType.CONTINUE_STATEMENT;
}

export interface EnhancedForLoopNode extends ASTNode {
  type: NodeType.ENHANCED_FOR_LOOP;
  variable: IdentifierNode;
  iterable: ASTNode;
  body: ASTNode;
}

export interface ArrayInitializationNode extends ASTNode {
  type: NodeType.ARRAY_INITIALIZATION;
  elements: ASTNode[];
}

export class Parser {
  private tokens: Token[];
  private current: number = 0;
  private errors: ConversionError[] = [];

  constructor(tokens: Token[]) {
    // Filter out whitespace tokens for easier parsing
    this.tokens = tokens.filter(token => token.type !== TokenType.WHITESPACE);
  }

  /**
   * Parse tokens into an Abstract Syntax Tree
   * @returns Parse result with AST and any syntax errors
   */
  parse(): { ast: ProgramNode | null, errors: ConversionError[] } {
    this.errors = [];
    this.current = 0;

    try {
      const ast = this.parseProgram();
      return { ast, errors: this.errors };
    } catch (error) {
      // Add any uncaught parsing errors
      if (error instanceof Error) {
        this.addError(ErrorType.SYNTAX_ERROR, error.message, this.getCurrentLocation());
      }
      return { ast: null, errors: this.errors };
    }
  }

  private parseProgram(): ProgramNode {
    const declarations: ASTNode[] = [];
    const location = this.getCurrentLocation();

    while (!this.isAtEnd()) {
      try {
        const declaration = this.parseDeclaration();
        if (declaration) {
          declarations.push(declaration);
        }
      } catch (error) {
        // Synchronize on error - skip to next likely declaration start
        this.synchronize();
      }
    }

    return {
      type: NodeType.PROGRAM,
      location,
      declarations,
      children: declarations
    };
  }

  private parseDeclaration(): ASTNode | null {
    try {
      // Skip comments
      if (this.check(TokenType.COMMENT)) {
        this.advance();
        return null;
      }

      // Check for class declaration (with or without modifiers)
      if (this.match('class')) {
        return this.parseClassDeclaration();
      }

      // Check for declarations with modifiers (class, method, or field)
      if (this.checkModifiers()) {
        const savedPosition = this.current;
        
        // Skip modifiers
        while (this.checkModifiers()) {
          this.advance();
        }
        
        // Check if next token is 'class'
        if (this.check(TokenType.KEYWORD, 'class')) {
          // Reset position and parse as class declaration with modifiers
          this.current = savedPosition;
          return this.parseClassDeclarationWithModifiers();
        }
        
        // Check if this is a method or field declaration
        // Look for: [modifiers] type name ( -> method
        // Look for: [modifiers] type name ; -> field
        if (this.checkDataType() || this.check(TokenType.KEYWORD, 'void') || this.check(TokenType.IDENTIFIER)) {
          this.advance(); // consume type
          
          if (this.check(TokenType.IDENTIFIER)) {
            this.advance(); // consume name
            
            if (this.check(TokenType.PUNCTUATION, '(')) {
              // This is a method declaration
              this.current = savedPosition;
              return this.parseMethodDeclaration();
            } else if (this.check(TokenType.PUNCTUATION, ';') || this.check(TokenType.OPERATOR, '=')) {
              // This is a field declaration
              this.current = savedPosition;
              return this.parseFieldDeclaration();
            }
          }
        }
        
        // Reset position and try as method declaration (fallback)
        this.current = savedPosition;
        return this.parseMethodDeclaration();
      }

      // Check for variable declaration or method declaration
      if (this.checkDataType() || this.check(TokenType.KEYWORD, 'void')) {
        // Look ahead to determine if this is a method or variable
        const savedPosition = this.current;
        
        // Skip modifiers if any
        while (this.checkModifiers()) {
          this.advance();
        }
        
        // Skip return type
        if (this.checkDataType() || this.check(TokenType.KEYWORD, 'void')) {
          this.advance();
        }
        
        // Check if next token is identifier followed by '('
        if (this.check(TokenType.IDENTIFIER)) {
          this.advance();
          if (this.check(TokenType.PUNCTUATION, '(')) {
            // This is a method declaration
            this.current = savedPosition;
            return this.parseMethodDeclaration();
          }
        }
        
        // Reset position and parse as variable declaration
        this.current = savedPosition;
        return this.parseVariableDeclaration();
      }

      // Parse as statement if not a declaration
      return this.parseStatement();
    } catch (error) {
      this.synchronize();
      return null;
    }
  }

  private parseClassDeclaration(): ClassDeclarationNode {
    const location = this.getCurrentLocation();
    
    // 'class' keyword already consumed
    const name = this.consume(TokenType.IDENTIFIER, "Expected class name").value;
    
    // Check for inheritance (extends keyword)
    let superClass: string | undefined;
    if (this.match('extends')) {
      superClass = this.consume(TokenType.IDENTIFIER, "Expected superclass name after 'extends'").value;
    }
    
    this.consume(TokenType.PUNCTUATION, "Expected '{' after class name", '{');

    const methods: MethodDeclarationNode[] = [];
    const fields: VariableDeclarationNode[] = [];

    while (!this.check(TokenType.PUNCTUATION, '}') && !this.isAtEnd()) {
      const declaration = this.parseDeclaration();
      if (declaration) {
        if (declaration.type === NodeType.METHOD_DECLARATION) {
          methods.push(declaration as MethodDeclarationNode);
        } else if (declaration.type === NodeType.VARIABLE_DECLARATION) {
          fields.push(declaration as VariableDeclarationNode);
        }
      }
    }

    this.consume(TokenType.PUNCTUATION, "Expected '}' after class body", '}');

    return {
      type: NodeType.CLASS_DECLARATION,
      location,
      name,
      superClass,
      methods,
      fields,
      children: [...fields, ...methods]
    };
  }

  private parseClassDeclarationWithModifiers(): ClassDeclarationNode {
    const location = this.getCurrentLocation();
    
    // Parse and skip modifiers (we don't use them for class declarations in pseudocode)
    while (this.checkModifiers()) {
      this.advance();
    }
    
    // Consume 'class' keyword
    this.consume(TokenType.KEYWORD, "Expected 'class' keyword", 'class');
    
    // Parse class name
    const name = this.consume(TokenType.IDENTIFIER, "Expected class name").value;
    
    // Check for inheritance (extends keyword)
    let superClass: string | undefined;
    if (this.match('extends')) {
      superClass = this.consume(TokenType.IDENTIFIER, "Expected superclass name after 'extends'").value;
    }
    
    this.consume(TokenType.PUNCTUATION, "Expected '{' after class name", '{');

    const methods: MethodDeclarationNode[] = [];
    const fields: VariableDeclarationNode[] = [];

    while (!this.check(TokenType.PUNCTUATION, '}') && !this.isAtEnd()) {
      const declaration = this.parseDeclaration();
      if (declaration) {
        if (declaration.type === NodeType.METHOD_DECLARATION) {
          methods.push(declaration as MethodDeclarationNode);
        } else if (declaration.type === NodeType.VARIABLE_DECLARATION) {
          fields.push(declaration as VariableDeclarationNode);
        }
      }
    }

    this.consume(TokenType.PUNCTUATION, "Expected '}' after class body", '}');

    return {
      type: NodeType.CLASS_DECLARATION,
      location,
      name,
      superClass,
      methods,
      fields,
      children: [...fields, ...methods]
    };
  }

  private parseMethodDeclaration(): MethodDeclarationNode {
    const location = this.getCurrentLocation();
    let isPublic = false;
    let isStatic = false;

    // Parse modifiers
    while (this.checkModifiers()) {
      const modifier = this.advance().value;
      if (modifier === 'public') isPublic = true;
      if (modifier === 'static') isStatic = true;
    }

    // Parse return type (can be keyword like 'void', 'int' or identifier like 'String')
    let returnType: string;
    if (this.check(TokenType.KEYWORD) || this.check(TokenType.IDENTIFIER)) {
      returnType = this.advance().value;
    } else {
      throw new Error("Expected return type (void, int, double, boolean, String, etc.)");
    }
    const isVoid = returnType === 'void';

    // Parse method name
    const name = this.consume(TokenType.IDENTIFIER, "Expected method name").value;

    // Parse parameters
    this.consume(TokenType.PUNCTUATION, "Expected '(' after method name", '(');
    const parameters: ParameterNode[] = [];

    if (!this.check(TokenType.PUNCTUATION, ')')) {
      do {
        // Parse parameter type (can be keyword like 'int' or identifier like 'String')
        let paramType: string;
        if (this.check(TokenType.KEYWORD) || this.check(TokenType.IDENTIFIER)) {
          paramType = this.advance().value;
        } else {
          throw new Error("Expected parameter type (int, double, boolean, String, etc.)");
        }
        
        // Handle array types (e.g., String[], int[])
        if (this.check(TokenType.PUNCTUATION, '[')) {
          this.advance(); // consume '['
          this.consume(TokenType.PUNCTUATION, "Expected ']' after '['", ']');
          paramType += '[]';
        }
        
        const paramName = this.consume(TokenType.IDENTIFIER, "Expected parameter name").value;
        parameters.push({
          type: NodeType.IDENTIFIER, // Using IDENTIFIER as base type for parameters
          location: this.getCurrentLocation(),
          name: paramName,
          paramType: paramType
        });
      } while (this.match(','));
    }

    this.consume(TokenType.PUNCTUATION, "Expected ')' after parameters", ')');

    // Parse method body
    const body = this.parseBlock();

    return {
      type: NodeType.METHOD_DECLARATION,
      location,
      name,
      returnType,
      parameters,
      body,
      isVoid,
      isStatic,
      isPublic,
      children: body
    };
  }

  private parseVariableDeclaration(): VariableDeclarationNode {
    const varDecl = this.parseVariableDeclarationWithoutSemicolon();
    this.consume(TokenType.PUNCTUATION, "Expected ';' after variable declaration", ';');
    return varDecl;
  }

  private parseFieldDeclaration(): VariableDeclarationNode {
    const location = this.getCurrentLocation();
    
    // Skip modifiers (private, public, static, etc.)
    while (this.checkModifiers()) {
      this.advance();
    }
    
    // Parse data type
    let dataType: string;
    if (this.check(TokenType.KEYWORD) || this.check(TokenType.IDENTIFIER)) {
      dataType = this.advance().value;
    } else {
      throw new Error("Expected field type (int, double, boolean, String, etc.)");
    }
    
    // Handle array types (e.g., int[], String[])
    if (this.check(TokenType.PUNCTUATION, '[')) {
      this.advance(); // consume '['
      this.consume(TokenType.PUNCTUATION, "Expected ']' after '['", ']');
      dataType += '[]';
    }
    
    const name = this.consume(TokenType.IDENTIFIER, "Expected field name").value;

    let initializer: ASTNode | undefined;
    if (this.matchOperator('=')) {
      initializer = this.parseExpression();
    }

    this.consume(TokenType.PUNCTUATION, "Expected ';' after field declaration", ';');

    return {
      type: NodeType.VARIABLE_DECLARATION,
      location,
      name,
      dataType,
      initializer,
      children: initializer ? [initializer] : undefined
    };
  }

  private parseVariableDeclarationWithoutSemicolon(): VariableDeclarationNode {
    const location = this.getCurrentLocation();
    let dataType = this.advance().value;
    
    // Handle array types (e.g., int[], String[])
    if (this.check(TokenType.PUNCTUATION, '[')) {
      this.advance(); // consume '['
      this.consume(TokenType.PUNCTUATION, "Expected ']' after '['", ']');
      dataType += '[]';
    }
    
    const name = this.consume(TokenType.IDENTIFIER, "Expected variable name").value;

    let initializer: ASTNode | undefined;
    if (this.matchOperator('=')) {
      initializer = this.parseExpression();
    }

    return {
      type: NodeType.VARIABLE_DECLARATION,
      location,
      name,
      dataType,
      initializer,
      children: initializer ? [initializer] : undefined
    };
  }

  private parseStatement(): ASTNode {
    // Return statement
    if (this.match('return')) {
      return this.parseReturnStatement();
    }

    // If statement
    if (this.match('if')) {
      return this.parseIfStatement();
    }

    // While loop
    if (this.match('while')) {
      return this.parseWhileLoop();
    }

    // For loop
    if (this.match('for')) {
      return this.parseForLoop();
    }

    // Switch statement
    if (this.match('switch')) {
      return this.parseSwitchStatement();
    }

    // Break statement
    if (this.match('break')) {
      return this.parseBreakStatement();
    }

    // Continue statement
    if (this.match('continue')) {
      return this.parseContinueStatement();
    }

    // Block statement
    if (this.check(TokenType.PUNCTUATION, '{')) {
      return this.parseBlockStatement();
    }

    // Variable declaration (for switch cases and other contexts)
    if (this.checkDataType()) {
      return this.parseVariableDeclaration();
    }

    // Expression statement (assignment, method call, etc.)
    return this.parseExpressionStatement();
  }

  private parseIfStatement(): IfStatementNode {
    const location = this.getCurrentLocation();
    
    this.consume(TokenType.PUNCTUATION, "Expected '(' after 'if'", '(');
    const condition = this.parseExpression();
    this.consume(TokenType.PUNCTUATION, "Expected ')' after if condition", ')');

    const thenStatement = this.parseStatement();
    let elseStatement: ASTNode | undefined;

    if (this.match('else')) {
      elseStatement = this.parseStatement();
    }

    return {
      type: NodeType.IF_STATEMENT,
      location,
      condition,
      thenStatement,
      elseStatement,
      children: elseStatement ? [condition, thenStatement, elseStatement] : [condition, thenStatement]
    };
  }

  private parseWhileLoop(): WhileLoopNode {
    const location = this.getCurrentLocation();
    
    this.consume(TokenType.PUNCTUATION, "Expected '(' after 'while'", '(');
    const condition = this.parseExpression();
    this.consume(TokenType.PUNCTUATION, "Expected ')' after while condition", ')');

    const body = this.parseStatement();

    return {
      type: NodeType.WHILE_LOOP,
      location,
      condition,
      body,
      children: [condition, body]
    };
  }

  private parseForLoop(): ForLoopNode | EnhancedForLoopNode {
    const location = this.getCurrentLocation();
    
    this.consume(TokenType.PUNCTUATION, "Expected '(' after 'for'", '(');

    // Check for enhanced for loop (for-each): for (Type var : iterable)
    // Look ahead to see if this is an enhanced for loop pattern
    const savedPosition = this.current;
    let isEnhancedFor = false;
    
    if (this.checkDataTypeOrIdentifier()) {
      this.advance(); // consume type
      if (this.check(TokenType.IDENTIFIER)) {
        this.advance(); // consume variable name
        if (this.check(TokenType.OPERATOR, ':')) {
          isEnhancedFor = true;
        }
      }
    }
    
    // Reset position
    this.current = savedPosition;
    
    if (isEnhancedFor) {
      // Parse as enhanced for loop
      this.advance(); // consume type
      const variable = this.consume(TokenType.IDENTIFIER, "Expected variable name").value;
      this.consume(TokenType.OPERATOR, "Expected ':' in enhanced for loop", ':');
      
      const iterable = this.parseExpression();
      this.consume(TokenType.PUNCTUATION, "Expected ')' after enhanced for loop", ')');
      const body = this.parseStatement();
      
      const variableNode = {
        type: NodeType.IDENTIFIER,
        location: this.getCurrentLocation(),
        name: variable,
        children: []
      } as IdentifierNode;
      
      return {
        type: NodeType.ENHANCED_FOR_LOOP,
        location,
        variable: variableNode,
        iterable,
        body,
        children: [variableNode, iterable, body]
      };
    }

    // Parse regular for loop
    // Parse initialization (optional)
    let initialization: ASTNode | undefined;
    if (!this.check(TokenType.PUNCTUATION, ';')) {
      if (this.checkDataType()) {
        initialization = this.parseVariableDeclarationWithoutSemicolon();
      } else {
        initialization = this.parseExpression();
      }
    }
    this.consume(TokenType.PUNCTUATION, "Expected ';' after for loop initialization", ';');

    // Parse condition (optional)
    let condition: ASTNode | undefined;
    if (!this.check(TokenType.PUNCTUATION, ';')) {
      condition = this.parseExpression();
    }
    this.consume(TokenType.PUNCTUATION, "Expected ';' after for loop condition", ';');

    // Parse update (optional)
    let update: ASTNode | undefined;
    if (!this.check(TokenType.PUNCTUATION, ')')) {
      update = this.parseExpression();
    }
    this.consume(TokenType.PUNCTUATION, "Expected ')' after for loop clauses", ')');

    const body = this.parseStatement();

    const children: ASTNode[] = [];
    if (initialization) children.push(initialization);
    if (condition) children.push(condition);
    if (update) children.push(update);
    children.push(body);

    return {
      type: NodeType.FOR_LOOP,
      location,
      initialization,
      condition,
      update,
      body,
      children
    };
  }

  private parseReturnStatement(): ReturnStatementNode {
    const location = this.getCurrentLocation();
    
    // 'return' keyword already consumed
    let expression: ASTNode | undefined;
    
    // Check if there's an expression to return
    if (!this.check(TokenType.PUNCTUATION, ';')) {
      expression = this.parseExpression();
    }
    
    this.consume(TokenType.PUNCTUATION, "Expected ';' after return statement", ';');

    return {
      type: NodeType.RETURN_STATEMENT,
      location,
      expression,
      children: expression ? [expression] : []
    };
  }

  private parseSwitchStatement(): SwitchStatementNode {
    const location = this.getCurrentLocation();
    
    this.consume(TokenType.PUNCTUATION, "Expected '(' after 'switch'", '(');
    const discriminant = this.parseExpression();
    this.consume(TokenType.PUNCTUATION, "Expected ')' after switch expression", ')');
    this.consume(TokenType.PUNCTUATION, "Expected '{' after switch", '{');

    const cases: (CaseClauseNode | DefaultClauseNode)[] = [];

    while (!this.check(TokenType.PUNCTUATION, '}') && !this.isAtEnd()) {
      if (this.match('case')) {
        const caseLocation = this.getCurrentLocation();
        const test = this.parseExpression();
        this.consume(TokenType.OPERATOR, "Expected ':' after case value", ':');
        
        const consequent: ASTNode[] = [];
        while (!this.check(TokenType.KEYWORD, 'case') && 
               !this.check(TokenType.KEYWORD, 'default') && 
               !this.check(TokenType.PUNCTUATION, '}') && 
               !this.isAtEnd()) {
          const stmt = this.parseStatement();
          if (stmt) {
            consequent.push(stmt);
          }
        }

        cases.push({
          type: NodeType.CASE_CLAUSE,
          location: caseLocation,
          test,
          consequent,
          children: [test, ...consequent]
        });
      } else if (this.match('default')) {
        const defaultLocation = this.getCurrentLocation();
        this.consume(TokenType.OPERATOR, "Expected ':' after 'default'", ':');
        
        const consequent: ASTNode[] = [];
        while (!this.check(TokenType.KEYWORD, 'case') && 
               !this.check(TokenType.KEYWORD, 'default') && 
               !this.check(TokenType.PUNCTUATION, '}') && 
               !this.isAtEnd()) {
          const stmt = this.parseStatement();
          if (stmt) {
            consequent.push(stmt);
          }
        }

        cases.push({
          type: NodeType.DEFAULT_CLAUSE,
          location: defaultLocation,
          consequent,
          children: consequent
        });
      } else {
        // Skip unexpected tokens
        this.advance();
      }
    }

    this.consume(TokenType.PUNCTUATION, "Expected '}' after switch body", '}');

    return {
      type: NodeType.SWITCH_STATEMENT,
      location,
      discriminant,
      cases,
      children: [discriminant, ...cases]
    };
  }

  private parseBreakStatement(): BreakStatementNode {
    const location = this.getCurrentLocation();
    this.consume(TokenType.PUNCTUATION, "Expected ';' after 'break'", ';');
    
    return {
      type: NodeType.BREAK_STATEMENT,
      location,
      children: []
    };
  }

  private parseContinueStatement(): ContinueStatementNode {
    const location = this.getCurrentLocation();
    this.consume(TokenType.PUNCTUATION, "Expected ';' after 'continue'", ';');
    
    return {
      type: NodeType.CONTINUE_STATEMENT,
      location,
      children: []
    };
  }

  private parseBlockStatement(): ASTNode {
    const statements = this.parseBlock();
    
    // Return a program-like node to represent the block
    return {
      type: NodeType.PROGRAM, // Using PROGRAM type for block statements
      location: this.getCurrentLocation(),
      children: statements
    };
  }

  private parseBlock(): ASTNode[] {
    this.consume(TokenType.PUNCTUATION, "Expected '{'", '{');
    
    const statements: ASTNode[] = [];
    while (!this.check(TokenType.PUNCTUATION, '}') && !this.isAtEnd()) {
      const stmt = this.parseDeclaration();
      if (stmt) {
        statements.push(stmt);
      }
    }

    this.consume(TokenType.PUNCTUATION, "Expected '}'", '}');
    return statements;
  }

  private parseExpressionStatement(): ASTNode {
    const expr = this.parseExpression();
    this.consume(TokenType.PUNCTUATION, "Expected ';' after expression", ';');
    return expr;
  }

  private parseExpression(): ASTNode {
    return this.parseAssignment();
  }

  private parseAssignment(): ASTNode {
    const expr = this.parseLogicalOr();

    if (this.matchOperator('=', '+=', '-=', '*=', '/=', '%=')) {
      const operator = this.previous().value;
      const right = this.parseAssignment();
      
      return {
        type: NodeType.ASSIGNMENT,
        location: expr.location,
        left: expr,
        right,
        operator,
        children: [expr, right]
      } as AssignmentNode;
    }

    return expr;
  }

  private parseLogicalOr(): ASTNode {
    let expr = this.parseLogicalAnd();

    while (this.matchOperator('||')) {
      const operator = this.previous().value;
      const right = this.parseLogicalAnd();
      expr = {
        type: NodeType.BINARY_EXPRESSION,
        location: expr.location,
        left: expr,
        right,
        operator,
        children: [expr, right]
      } as BinaryExpressionNode;
    }

    return expr;
  }

  private parseLogicalAnd(): ASTNode {
    let expr = this.parseEquality();

    while (this.matchOperator('&&')) {
      const operator = this.previous().value;
      const right = this.parseEquality();
      expr = {
        type: NodeType.BINARY_EXPRESSION,
        location: expr.location,
        left: expr,
        right,
        operator,
        children: [expr, right]
      } as BinaryExpressionNode;
    }

    return expr;
  }

  private parseEquality(): ASTNode {
    let expr = this.parseComparison();

    while (this.matchOperator('==', '!=')) {
      const operator = this.previous().value;
      const right = this.parseComparison();
      expr = {
        type: NodeType.BINARY_EXPRESSION,
        location: expr.location,
        left: expr,
        right,
        operator,
        children: [expr, right]
      } as BinaryExpressionNode;
    }

    return expr;
  }

  private parseComparison(): ASTNode {
    let expr = this.parseTerm();

    while (this.matchOperator('>', '>=', '<', '<=')) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      expr = {
        type: NodeType.BINARY_EXPRESSION,
        location: expr.location,
        left: expr,
        right,
        operator,
        children: [expr, right]
      } as BinaryExpressionNode;
    }

    return expr;
  }

  private parseTerm(): ASTNode {
    let expr = this.parseFactor();

    while (this.matchOperator('+', '-')) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      expr = {
        type: NodeType.BINARY_EXPRESSION,
        location: expr.location,
        left: expr,
        right,
        operator,
        children: [expr, right]
      } as BinaryExpressionNode;
    }

    return expr;
  }

  private parseFactor(): ASTNode {
    let expr = this.parseUnary();

    while (this.matchOperator('*', '/', '%')) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expr = {
        type: NodeType.BINARY_EXPRESSION,
        location: expr.location,
        left: expr,
        right,
        operator,
        children: [expr, right]
      } as BinaryExpressionNode;
    }

    return expr;
  }

  private parseUnary(): ASTNode {
    if (this.matchOperator('!', '-', '+', '++', '--')) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      return {
        type: NodeType.BINARY_EXPRESSION, // Using BINARY_EXPRESSION for unary as well
        location: this.getCurrentLocation(),
        left: {
          type: NodeType.LITERAL,
          location: this.getCurrentLocation(),
          value: '',
          children: []
        }, // Empty left operand for unary
        right,
        operator,
        children: [right]
      } as BinaryExpressionNode;
    }

    return this.parsePostfix();
  }

  private parsePostfix(): ASTNode {
    let expr = this.parsePrimary();

    while (true) {
      if (this.matchOperator('++', '--')) {
        // Postfix increment/decrement
        const operator = this.previous().value;
        expr = {
          type: NodeType.BINARY_EXPRESSION,
          location: expr.location,
          left: expr,
          right: {
            type: NodeType.LITERAL,
            location: this.getCurrentLocation(),
            value: '',
            children: []
          },
          operator,
          children: [expr]
        } as BinaryExpressionNode;
      } else if (this.match('[')) {
        // Array access
        const index = this.parseExpression();
        this.consume(TokenType.PUNCTUATION, "Expected ']' after array index", ']');
        expr = {
          type: NodeType.ARRAY_ACCESS,
          location: expr.location,
          array: expr,
          index,
          children: [expr, index]
        } as ArrayAccessNode;
      } else if (this.match('.')) {
        // Method call or field access
        const name = this.consume(TokenType.IDENTIFIER, "Expected method or field name after '.'").value;
        
        if (this.match('(')) {
          // Method call
          const args: ASTNode[] = [];
          if (!this.check(TokenType.PUNCTUATION, ')')) {
            do {
              args.push(this.parseExpression());
            } while (this.match(','));
          }
          this.consume(TokenType.PUNCTUATION, "Expected ')' after method arguments", ')');
          
          expr = {
            type: NodeType.METHOD_CALL,
            location: expr.location,
            object: expr,
            methodName: name,
            arguments: args,
            children: [expr, ...args]
          } as MethodCallNode;
        } else {
          // Field access - treat as identifier for now
          expr = {
            type: NodeType.IDENTIFIER,
            location: expr.location,
            name: `${this.getExpressionName(expr)}.${name}`,
            children: [expr]
          } as IdentifierNode;
        }
      } else if (this.match('(')) {
        // Method call without object
        const args: ASTNode[] = [];
        if (!this.check(TokenType.PUNCTUATION, ')')) {
          do {
            args.push(this.parseExpression());
          } while (this.match(','));
        }
        this.consume(TokenType.PUNCTUATION, "Expected ')' after method arguments", ')');
        
        expr = {
          type: NodeType.METHOD_CALL,
          location: expr.location,
          object: undefined,
          methodName: this.getExpressionName(expr),
          arguments: args,
          children: args
        } as MethodCallNode;
      } else {
        break;
      }
    }

    return expr;
  }

  private parsePrimary(): ASTNode {
    const location = this.getCurrentLocation();

    // Boolean literals (keywords true/false)
    if (this.check(TokenType.KEYWORD, 'true') || this.check(TokenType.KEYWORD, 'false')) {
      const token = this.advance();
      return {
        type: NodeType.LITERAL,
        location,
        value: token.value,
        dataType: 'boolean',
        children: []
      } as LiteralNode;
    }

    // Literals
    if (this.check(TokenType.LITERAL)) {
      const token = this.advance();
      let dataType: 'string' | 'number' | 'boolean' | 'char';
      
      if (token.value.startsWith('"')) {
        dataType = 'string';
      } else if (token.value.startsWith("'")) {
        dataType = 'char';
      } else if (token.value === 'true' || token.value === 'false') {
        dataType = 'boolean';
      } else {
        dataType = 'number';
      }

      return {
        type: NodeType.LITERAL,
        location,
        value: token.value,
        dataType,
        children: []
      } as LiteralNode;
    }

    // Identifiers
    if (this.check(TokenType.IDENTIFIER)) {
      const name = this.advance().value;
      return {
        type: NodeType.IDENTIFIER,
        location,
        name,
        children: []
      } as IdentifierNode;
    }

    // Array initialization: {1, 2, 3}
    if (this.match('{')) {
      const elements: ASTNode[] = [];
      
      if (!this.check(TokenType.PUNCTUATION, '}')) {
        do {
          elements.push(this.parseExpression());
        } while (this.match(','));
      }
      
      this.consume(TokenType.PUNCTUATION, "Expected '}' after array elements", '}');
      
      return {
        type: NodeType.ARRAY_INITIALIZATION,
        location,
        elements,
        children: elements
      } as ArrayInitializationNode;
    }

    // Parenthesized expressions
    if (this.match('(')) {
      const expr = this.parseExpression();
      this.consume(TokenType.PUNCTUATION, "Expected ')' after expression", ')');
      return expr;
    }

    const token = this.peek();
    if (token) {
      throw new Error(`Unexpected token '${token.value}' of type ${token.type}. Expected a literal, identifier, or '(' to start an expression.`);
    } else {
      throw new Error('Unexpected end of file. Expected a literal, identifier, or \'(\' to start an expression.');
    }
  }

  // Helper methods
  private match(...values: string[]): boolean {
    for (const value of values) {
      if (this.check(TokenType.KEYWORD, value) || this.check(TokenType.PUNCTUATION, value)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private matchOperator(...operators: string[]): boolean {
    for (const op of operators) {
      if (this.check(TokenType.OPERATOR, op)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    return token.type === type && (value === undefined || token.value === value);
  }

  private checkModifiers(): boolean {
    return this.check(TokenType.KEYWORD, 'public') || 
           this.check(TokenType.KEYWORD, 'private') || 
           this.check(TokenType.KEYWORD, 'static');
  }

  private checkReturnType(): boolean {
    return this.check(TokenType.KEYWORD, 'void') || this.checkDataType();
  }

  private checkDataType(): boolean {
    // Check for basic data types (including array types)
    const isBasicType = this.check(TokenType.KEYWORD, 'int') ||
           this.check(TokenType.KEYWORD, 'double') ||
           this.check(TokenType.KEYWORD, 'boolean') ||
           this.check(TokenType.KEYWORD, 'String') ||
           this.check(TokenType.IDENTIFIER, 'String') ||
           this.check(TokenType.KEYWORD, 'char') ||
           this.check(TokenType.KEYWORD, 'float') ||
           this.check(TokenType.KEYWORD, 'long') ||
           this.check(TokenType.KEYWORD, 'short') ||
           this.check(TokenType.KEYWORD, 'byte');
    
    return isBasicType;
  }

  private checkDataTypeOrIdentifier(): boolean {
    // Check for basic data types or any identifier (for custom classes)
    return this.checkDataType() || this.check(TokenType.IDENTIFIER);
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string, value?: string): Token {
    if (this.check(type, value)) {
      return this.advance();
    }

    const currentToken = this.peek();
    const location = currentToken ? currentToken.location : this.getCurrentLocation();
    this.addError(ErrorType.SYNTAX_ERROR, message, location);
    throw new Error(message);
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.PUNCTUATION && this.previous().value === ';') {
        return;
      }

      const current = this.peek();
      if (current.type === TokenType.KEYWORD) {
        const keyword = current.value;
        if (['class', 'public', 'private', 'static', 'if', 'while', 'for', 'return'].includes(keyword)) {
          return;
        }
      }

      this.advance();
    }
  }

  private getCurrentLocation(): SourceLocation {
    if (this.isAtEnd() && this.tokens.length > 0) {
      return this.tokens[this.tokens.length - 1].location;
    }
    return this.peek()?.location || { line: 1, column: 1 };
  }

  private addError(type: ErrorType, message: string, location: SourceLocation): void {
    this.errors.push({
      type,
      message,
      location,
      severity: ErrorSeverity.ERROR
    });
  }

  private getExpressionName(expr: ASTNode): string {
    if (expr.type === NodeType.IDENTIFIER) {
      return (expr as IdentifierNode).name;
    }
    return 'unknown';
  }
}