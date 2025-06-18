/**
 * Intermediate Representation (IR) Types
 * Core data structures for representing parsed Java code before conversion to IB Pseudocode
 */

/**
 * Base IR node interface
 */
export interface IRNode {
  /** Type of the IR node */
  kind: IRKind;
  /** Text content or identifier */
  text?: string;
  /** Child nodes for nested structures */
  children?: IRNode[];
  /** Additional metadata */
  meta?: IRMetadata;
  /** Source location information */
  location?: SourceLocation;
}

/**
 * Types of IR nodes
 */
export enum IRKind {
  // Program structure
  PROGRAM = 'program',
  CLASS = 'class',
  METHOD = 'method',
  BLOCK = 'block',

  // Statements
  ASSIGNMENT = 'assignment',
  OUTPUT = 'output',
  INPUT = 'input',
  COMMENT = 'comment',
  EXPRESSION_STATEMENT = 'expression_statement',

  // Control structures
  IF = 'if',
  ELSE_IF = 'else_if',
  ELSE = 'else',
  WHILE = 'while',
  FOR = 'for',
  FOR_EACH = 'for_each',

  // Expressions
  BINARY_EXPRESSION = 'binary_expression',
  UNARY_EXPRESSION = 'unary_expression',
  IDENTIFIER = 'identifier',
  LITERAL = 'literal',
  METHOD_CALL = 'method_call',

  // Special
  RETURN = 'return',
  VARIABLE_DECLARATION = 'variable_declaration'
}

/**
 * Metadata for IR nodes
 */
export interface IRMetadata {
  /** Method information */
  methodInfo?: MethodInfo;
  /** Variable information */
  variableInfo?: VariableInfo;
  /** Expression information */
  expressionInfo?: ExpressionInfo;
  /** Control flow information */
  controlInfo?: ControlInfo;
}

/**
 * Method-specific metadata
 */
export interface MethodInfo {
  /** Method name */
  name: string;
  /** Parameter list */
  parameters: Parameter[];
  /** Return type (void if no return) */
  returnType: string;
  /** Whether method has return statements */
  hasReturn: boolean;
  /** Access modifiers */
  modifiers: string[];
  /** Whether method is static */
  isStatic: boolean;
}

/**
 * Parameter information
 */
export interface Parameter {
  /** Parameter name */
  name: string;
  /** Parameter type */
  type: string;
}

/**
 * Variable-specific metadata
 */
export interface VariableInfo {
  /** Variable name */
  name: string;
  /** Variable type */
  type: string;
  /** Initial value if any */
  initialValue?: string;
}

/**
 * Expression-specific metadata
 */
export interface ExpressionInfo {
  /** Expression type */
  type: string;
  /** Operator for binary/unary expressions */
  operator?: string;
  /** Left operand for binary expressions */
  left?: IRNode;
  /** Right operand for binary expressions */
  right?: IRNode;
  /** Operand for unary expressions */
  operand?: IRNode;
}

/**
 * Control flow metadata
 */
export interface ControlInfo {
  /** Condition expression for if/while */
  condition?: IRNode;
  /** Loop variable for for loops */
  loopVariable?: string;
  /** Start value for for loops */
  startValue?: IRNode;
  /** End value for for loops */
  endValue?: IRNode;
  /** Step value for for loops */
  stepValue?: IRNode | undefined;
  /** Collection for for-each loops */
  collection?: IRNode;
}

/**
 * Source location information
 */
export interface SourceLocation {
  /** Line number (1-based) */
  line: number;
  /** Column number (1-based) */
  column: number;
  /** End line number */
  endLine?: number;
  /** End column number */
  endColumn?: number;
}

/**
 * Utility type for creating IR nodes
 */
export type CreateIRNode = Omit<IRNode, 'kind'> & {
  kind: IRKind;
};

/**
 * Helper functions for creating IR nodes
 */
export class IRBuilder {
  /**
   * Create a program node
   */
  static program(children: IRNode[]): IRNode {
    return {
      kind: IRKind.PROGRAM,
      children
    };
  }

  /**
   * Create a method node
   */
  static method(name: string, parameters: Parameter[], returnType: string, body: IRNode[], modifiers: string[] = []): IRNode {
    return {
      kind: IRKind.METHOD,
      text: name,
      children: body,
      meta: {
        methodInfo: {
          name,
          parameters,
          returnType,
          hasReturn: returnType !== 'void',
          modifiers,
          isStatic: modifiers.includes('static')
        }
      }
    };
  }

  /**
   * Create an assignment node
   */
  static assignment(variable: string, value: IRNode): IRNode {
    return {
      kind: IRKind.ASSIGNMENT,
      text: variable,
      children: [value]
    };
  }

  /**
   * Create an if statement node
   */
  static ifStatement(condition: IRNode, thenBlock: IRNode[], elseBlock?: IRNode[]): IRNode {
    const children = [condition, ...thenBlock];
    if (elseBlock) {
      children.push(...elseBlock);
    }
    
    return {
      kind: IRKind.IF,
      children,
      meta: {
        controlInfo: {
          condition
        }
      }
    };
  }

  /**
   * Create a while loop node
   */
  static whileLoop(condition: IRNode, body: IRNode[]): IRNode {
    return {
      kind: IRKind.WHILE,
      children: [condition, ...body],
      meta: {
        controlInfo: {
          condition
        }
      }
    };
  }

  /**
   * Create a for loop node
   */
  static forLoop(variable: string, start: IRNode, end: IRNode, body: IRNode[], step?: IRNode): IRNode {
    const children = [start, end, ...body];
    if (step) {
      children.splice(2, 0, step);
    }

    return {
      kind: IRKind.FOR,
      text: variable,
      children,
      meta: {
        controlInfo: {
          loopVariable: variable,
          startValue: start,
          endValue: end,
          stepValue: step
        }
      }
    };
  }

  /**
   * Create a literal node
   */
  static literal(value: string, type: string = 'unknown'): IRNode {
    return {
      kind: IRKind.LITERAL,
      text: value,
      meta: {
        expressionInfo: {
          type
        }
      }
    };
  }

  /**
   * Create an identifier node
   */
  static identifier(name: string): IRNode {
    return {
      kind: IRKind.IDENTIFIER,
      text: name
    };
  }

  /**
   * Create a binary expression node
   */
  static binaryExpression(operator: string, left: IRNode, right: IRNode): IRNode {
    return {
      kind: IRKind.BINARY_EXPRESSION,
      text: operator,
      children: [left, right],
      meta: {
        expressionInfo: {
          type: 'binary',
          operator,
          left,
          right
        }
      }
    };
  }
  
  /**
   * Create a unary expression node
   */
  static unaryExpression(operator: string, operand: IRNode): IRNode {
    return {
      kind: IRKind.UNARY_EXPRESSION,
      text: operator,
      children: [operand],
      meta: {
        expressionInfo: {
          type: 'unary',
          operator,
          operand
        }
      }
    };
  }

  /**
   * Create an output statement node
   */
  static output(expression: IRNode): IRNode {
    return {
      kind: IRKind.OUTPUT,
      children: [expression]
    };
  }

  /**
   * Create a comment node
   */
  static comment(text: string): IRNode {
    return {
      kind: IRKind.COMMENT,
      text
    };
  }
}