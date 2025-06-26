/**
 * IB Pseudocode Emitter
 * Converts Intermediate Representation (IR) to IB Pseudocode format
 */

import {
  IRNode,
  IRKind,
  EmitterOptions,
  EmitError,
  DiagnosticCollection
} from '../types';

// /**
//  * IB Pseudocode keywords and formatting
//  */
// const IB_KEYWORDS = {
//   // Control structures
//   IF: 'IF',
//   THEN: 'THEN',
//   ELSE: 'ELSE',
//   END_IF: 'END IF',
//   WHILE: 'LOOP WHILE',
//   END_WHILE: 'END LOOP',
//   FOR: 'LOOP',
//   FROM: 'FROM',
//   TO: 'TO',
//   END_FOR: 'END LOOP',
//   
//   // I/O operations
//   OUTPUT: 'OUTPUT',
//   INPUT: 'INPUT',
//   
//   // Method definitions
//   METHOD: 'METHOD',
//   END_METHOD: 'END METHOD',
//   RETURN: 'RETURN',
//   
//   // Comments
//   COMMENT_PREFIX: '//'
// } as const;

/**
 * Emitter context for tracking state during emission
 */
interface EmitterContext {
  /** Current indentation level */
  indentLevel: number;
  /** Whether we're inside a method */
  inMethod: boolean;
  /** Current method name */
  currentMethod?: string;
  /** Whether the last emitted line was blank */
  lastLineBlank: boolean;
}

/**
 * Main Emitter class
 */
export class Emitter {
  private options: EmitterOptions;
  private diagnostics: DiagnosticCollection;
  private context: EmitterContext;
  private output: string[];

  constructor(options: EmitterOptions = {}) {
    this.options = {
      includeEndStatements: true,
      uppercaseKeywords: true,
      addBlankLines: true,
      maxLineLength: 80,
      ...options
    };
    this.diagnostics = new DiagnosticCollection();
    this.context = {
      indentLevel: 0,
      inMethod: false,
      lastLineBlank: false
    };
    this.output = [];
  }

  /**
   * Emit IR to IB Pseudocode
   */
  emit(ir: IRNode): { code: string; diagnostics: DiagnosticCollection } {
    this.diagnostics.clear();
    this.output = [];
    this.context = {
      indentLevel: 0,
      inMethod: false,
      lastLineBlank: false
    };

    try {
      this.emitNode(ir);
      const code = this.output.join('\n');
      return { code, diagnostics: this.diagnostics };
    } catch (error) {
      if (error instanceof EmitError) {
        this.diagnostics.addError(error.message, error.code, error.location);
      } else {
        this.diagnostics.addError(
          `Unexpected error during emission: ${error}`,
          'UNEXPECTED_ERROR'
        );
      }
      
      return { code: '', diagnostics: this.diagnostics };
    }
  }

  /**
   * Emit a single IR node
   */
  private emitNode(node: IRNode): void {
    switch (node.kind) {
      case IRKind.PROGRAM:
        this.emitProgram(node);
        break;
      case IRKind.METHOD:
        this.emitMethod(node);
        break;
      case IRKind.ASSIGNMENT:
        this.emitAssignment(node);
        break;
      case IRKind.OUTPUT:
        this.emitOutput(node);
        break;
      case IRKind.INPUT:
        this.emitInput(node);
        break;
      case IRKind.IF:
        this.emitIf(node);
        break;
      case IRKind.WHILE:
        this.emitWhile(node);
        break;
      case IRKind.FOR:
        this.emitFor(node);
        break;
      case IRKind.COMMENT:
        this.emitComment(node);
        break;
      case IRKind.RETURN:
        this.emitReturn(node);
        break;
      case IRKind.BINARY_EXPRESSION:
        return; // Expressions are handled inline
      case IRKind.IDENTIFIER:
        return; // Identifiers are handled inline
      case IRKind.LITERAL:
        return; // Literals are handled inline
      default:
        this.diagnostics.addWarning(
          `Unsupported IR node kind: ${node.kind}`,
          'UNSUPPORTED_NODE',
          node.location
        );
    }
  }

  /**
   * Emit program node
   */
  private emitProgram(node: IRNode): void {
    if (!node.children) return;
    
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      
      // Add blank line between methods
      if (child && i > 0 && child.kind === IRKind.METHOD && this.options.addBlankLines) {
        this.emitBlankLine();
      }
      
      if (child) {
        this.emitNode(child);
      }
    }
  }

  /**
   * Emit method node
   */
  private emitMethod(node: IRNode): void {
    const methodInfo = node.meta?.methodInfo;
    if (!methodInfo) {
      throw new EmitError('Method node missing metadata', node.location);
    }

    this.context.inMethod = true;
    this.context.currentMethod = methodInfo.name;

    // Method signature
    let signature = this.keyword('METHOD') + ' ' + methodInfo.name;
    
    if (methodInfo.parameters.length > 0) {
      const params = methodInfo.parameters.map(p => p.name).join(', ');
      signature += '(' + params + ')';
    }
    
    this.emitLine(signature);
    this.indent();

    // Method body
    if (node.children) {
      for (const child of node.children) {
        if (child) {
        this.emitNode(child);
      }
      }
    }

    this.dedent();
    
    if (this.options.includeEndStatements) {
      this.emitLine(this.keyword('END METHOD'));
    }

    this.context.inMethod = false;
    this.context.currentMethod = '';
  }

  /**
   * Emit assignment statement
   */
  private emitAssignment(node: IRNode): void {
    if (!node.text || !node.children || node.children.length === 0) {
      throw new EmitError('Assignment node missing required data', node.location);
    }

    const variable = node.text.toUpperCase();
    if (node.children && node.children[0]) {
      const value = this.emitExpression(node.children[0]);
      this.emitLine(`${variable} ← ${value}`);
    }
  }

  /**
   * Emit output statement
   */
  private emitOutput(node: IRNode): void {
    if (!node.children || node.children.length === 0) {
      throw new EmitError('Output node missing expression', node.location);
    }

    if (node.children && node.children[0]) {
      const expression = this.emitExpression(node.children[0]);
      this.emitLine(`${this.keyword('OUTPUT')} ${expression}`);
    }
  }

  /**
   * Emit input statement
   */
  private emitInput(node: IRNode): void {
    if (!node.text) {
      throw new EmitError('Input node missing variable name', node.location);
    }

    this.emitLine(`${this.keyword('INPUT')} ${node.text}`);
  }

  /**
   * Emit if statement
   */
  private emitIf(node: IRNode): void {
    const controlInfo = node.meta?.controlInfo;
    if (!controlInfo?.condition) {
      throw new EmitError('If node missing condition', node.location);
    }

    const condition = this.emitExpression(controlInfo.condition);
    this.emitLine(`${this.keyword('IF')} ${condition} ${this.keyword('THEN')}`);
    
    this.indent();
    
    // Emit then block (skip the condition node)
    if (node.children) {
      for (let i = 1; i < node.children.length; i++) {
        const child = node.children[i];
        if (child) {
          this.emitNode(child);
        }
      }
    }
    
    this.dedent();
    
    if (this.options.includeEndStatements) {
      this.emitLine(this.keyword('END IF'));
    }
  }

  /**
   * Emit while loop
   */
  private emitWhile(node: IRNode): void {
    const controlInfo = node.meta?.controlInfo;
    if (!controlInfo?.condition) {
      throw new EmitError('While node missing condition', node.location);
    }

    const condition = this.emitExpression(controlInfo.condition);
    this.emitLine(`${this.keyword('LOOP WHILE')} ${condition}`);
    
    this.indent();
    
    // Emit loop body (skip the condition node)
    if (node.children) {
      for (let i = 1; i < node.children.length; i++) {
        const child = node.children[i];
        if (child) {
          this.emitNode(child);
        }
      }
    }
    
    this.dedent();
    
    if (this.options.includeEndStatements) {
      this.emitLine(this.keyword('END LOOP'));
    }
  }

  /**
   * Emit for loop
   */
  private emitFor(node: IRNode): void {
    const controlInfo = node.meta?.controlInfo;
    if (!controlInfo?.loopVariable || !controlInfo.startValue || !controlInfo.endValue) {
      throw new EmitError('For node missing loop parameters', node.location);
    }

    const variable = controlInfo.loopVariable;
    const start = this.emitExpression(controlInfo.startValue);
    const end = this.emitExpression(controlInfo.endValue);
    
    this.emitLine(`${this.keyword('LOOP')} ${variable} ${this.keyword('FROM')} ${start} ${this.keyword('TO')} ${end}`);
    
    this.indent();
    
    // Emit loop body (skip the start/end/step nodes)
    if (node.children) {
      const skipCount = controlInfo.stepValue ? 3 : 2;
      for (let i = skipCount; i < node.children.length; i++) {
        const child = node.children[i];
        if (child) {
          this.emitNode(child);
        }
      }
    }
    
    this.dedent();
    
    if (this.options.includeEndStatements) {
      this.emitLine(this.keyword('END LOOP'));
    }
  }

  /**
   * Emit comment
   */
  private emitComment(node: IRNode): void {
    if (!node.text) return;
    
    const commentText = node.text.startsWith('//') ? node.text : `// ${node.text}`;
    this.emitLine(commentText);
  }

  /**
   * Emit return statement
   */
  private emitReturn(node: IRNode): void {
    if (node.children && node.children.length > 0 && node.children[0]) {
      const expression = this.emitExpression(node.children[0]);
      this.emitLine(`${this.keyword('RETURN')} ${expression}`);
    } else {
      this.emitLine(this.keyword('RETURN'));
    }
  }

  /**
   * Emit expression (returns string representation)
   */
  private emitExpression(node: IRNode): string {
    switch (node.kind) {
      case IRKind.LITERAL:
        return node.text || '';
      
      case IRKind.IDENTIFIER:
        return (node.text || '').toUpperCase();
      
      case IRKind.BINARY_EXPRESSION:
        const expressionInfo = node.meta?.expressionInfo;
        if (!expressionInfo?.left || !expressionInfo.right || !expressionInfo.operator) {
          throw new EmitError('Binary expression missing required data', node.location);
        }
        
        const left = this.emitExpression(expressionInfo.left);
        const right = this.emitExpression(expressionInfo.right);
        const operator = this.convertOperator(expressionInfo.operator);
        
        return `${left} ${operator} ${right}`;
      
      case IRKind.UNARY_EXPRESSION:
        const unaryInfo = node.meta?.expressionInfo;
        if (!unaryInfo?.operand || !unaryInfo.operator) {
          throw new EmitError('Unary expression missing required data', node.location);
        }
        
        const operand = this.emitExpression(unaryInfo.operand);
        const unaryOperator = this.convertOperator(unaryInfo.operator);
        
        return `${unaryOperator} ${operand}`;
      
      case IRKind.METHOD_CALL:
        // TODO: Implement method call emission
        return node.text || 'METHOD_CALL';
      
      case IRKind.IF:
        return this.emitIfStatement(node);

      case IRKind.WHILE:
        return this.emitWhileLoop(node);

      case IRKind.FOR:
        return this.emitForLoop(node);

      case IRKind.FOR_EACH:
        return this.emitForEachLoop(node);
      
      default:
        this.diagnostics.addWarning(
          `Unsupported expression kind: ${node.kind}`,
          'UNSUPPORTED_EXPRESSION',
          node.location
        );
        return node.text || 'UNKNOWN';
    }
  }

  /**
   * Convert Java operators to IB pseudocode operators
   */
  private convertOperator(operator: string): string {
    const operatorMap: Record<string, string> = {
      '==': '=',
      '!=': '≠',
      '<=': '≤',
      '>=': '≥',
      '&&': 'AND',
      '||': 'OR',
      '!': 'NOT'
    };
    
    return operatorMap[operator] || operator;
  }

  /**
   * Apply keyword formatting
   */
  private keyword(keyword: string): string {
    return this.options.uppercaseKeywords ? keyword.toUpperCase() : keyword;
  }

  /**
   * Emit a line with proper indentation
   */
  private emitLine(content: string): void {
    const indentation = '    '.repeat(this.context.indentLevel);
    this.output.push(indentation + content);
    this.context.lastLineBlank = false;
  }

  /**
   * Emit a blank line
   */
  private emitBlankLine(): void {
    if (!this.context.lastLineBlank) {
      this.output.push('');
      this.context.lastLineBlank = true;
    }
  }

  /**
   * Increase indentation level
   */
  private indent(): void {
    this.context.indentLevel++;
  }

  /**
   * Decrease indentation level
   */
  private dedent(): void {
    if (this.context.indentLevel > 0) {
      this.context.indentLevel--;
    }
  }

  /**
   * Emit if statement: IF condition THEN ... ELSE ... END IF
   */
  private emitIfStatement(node: IRNode): string {
    if (!node.children || node.children.length < 2) {
      throw new Error('If statement must have at least condition and then block');
    }

    const conditionNode = node.children[0];
    if (!conditionNode) {
      throw new Error('If statement condition is missing');
    }
    
    const condition = this.emitExpression(conditionNode);
    const body = node.children.slice(1);

    let result = `IF ${condition} THEN\n`;
    
    // Emit body
    for (const stmt of body) {
      if (stmt) {
        result += this.indentString(this.emitExpression(stmt)) + '\n';
      }
    }

    result += 'END IF';
    return result;
  }

  /**
   * Emit while loop: WHILE condition ... END WHILE
   */
  private emitWhileLoop(node: IRNode): string {
    if (!node.children || node.children.length < 2) {
      throw new Error('While loop must have condition and body');
    }

    const conditionNode = node.children[0];
    if (!conditionNode) {
      throw new Error('While loop condition is missing');
    }
    
    const condition = this.emitExpression(conditionNode);
    const body = node.children.slice(1);

    let result = `WHILE ${condition}\n`;
    
    for (const stmt of body) {
      if (stmt) {
        result += this.indentString(this.emitExpression(stmt)) + '\n';
      }
    }

    result += 'END WHILE';
    return result;
  }

  /**
   * Emit for loop: FOR variable FROM start TO end ... END FOR
   */
  private emitForLoop(node: IRNode): string {
    if (!node.children || node.children.length < 3) {
      throw new Error('For loop must have start, end, and body');
    }

    const startNode = node.children[0];
    const endNode = node.children[1];
    
    if (!startNode || !endNode) {
      throw new Error('For loop start or end is missing');
    }
    
    const variable = node.text || 'i';
    const start = this.emitExpression(startNode);
    const end = this.emitExpression(endNode);
    const body = node.children.slice(2);

    let result = `FOR ${variable} FROM ${start} TO ${end}`;
    
    // Add step if present
    if (node.meta?.controlInfo?.stepValue) {
      const step = this.emitExpression(node.meta.controlInfo.stepValue);
      result += ` STEP ${step}`;
    }
    
    result += '\n';
    
    for (const stmt of body) {
      if (stmt) {
        result += this.indentString(this.emitExpression(stmt)) + '\n';
      }
    }

    result += 'END FOR';
    return result;
  }

  /**
   * Emit for-each loop: FOR EACH variable IN collection ... END FOR
   */
  private emitForEachLoop(node: IRNode): string {
    if (!node.children || node.children.length < 2) {
      throw new Error('For-each loop must have collection and body');
    }

    const collectionNode = node.children[0];
    if (!collectionNode) {
      throw new Error('For-each loop collection is missing');
    }
    
    const variable = node.text || 'item';
    const collection = this.emitExpression(collectionNode);
    const body = node.children.slice(1);

    let result = `FOR EACH ${variable} IN ${collection}\n`;
    
    for (const stmt of body) {
      if (stmt) {
        result += this.indentString(this.emitExpression(stmt)) + '\n';
      }
    }

    result += 'END FOR';
    return result;
  }

  /**
   * Add indentation to a line
   */
  private indentString(line: string): string {
    return '  ' + line;
  }
}

/**
 * Utility function to emit IR to string
 */
export function emitToString(ir: IRNode, options?: EmitterOptions): string {
  const emitter = new Emitter(options);
  const result = emitter.emit(ir);
  
  if (result.diagnostics.hasErrors()) {
    throw new EmitError(
      `Emission failed: ${result.diagnostics.format()}`
    );
  }
  
  return result.code;
}