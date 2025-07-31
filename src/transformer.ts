/**
 * AST Transformation System for converting Java AST to IB Pseudocode AST
 */

import { 
  ASTNode, 
  NodeType, 
  SourceLocation,
  ConversionError,
  ErrorType,
  ErrorSeverity
} from './types';
import { 
  IBRulesEngine, 
  VariableInfo, 
  MethodInfo 
} from './ib-rules-engine';
import {
  ProgramNode,
  ClassDeclarationNode,
  MethodDeclarationNode,
  VariableDeclarationNode,
  AssignmentNode,
  BinaryExpressionNode,
  MethodCallNode,
  IfStatementNode,
  WhileLoopNode,
  ForLoopNode,
  LiteralNode,
  IdentifierNode,
  ArrayAccessNode
} from './parser';

// Pseudocode AST Node Types
export interface PseudocodeNode {
  type: PseudocodeNodeType;
  content: string;
  indentLevel: number;
  children?: PseudocodeNode[];
  location: SourceLocation;
}

export enum PseudocodeNodeType {
  STATEMENT = 'statement',
  BLOCK = 'block',
  EXPRESSION = 'expression',
  COMMENT = 'comment'
}

// Transformation Context
export interface TransformationContext {
  variables: Map<string, VariableInfo>;
  methods: Map<string, MethodInfo>;
  currentScope: ScopeInfo;
  ibRules: IBRulesEngine;
  indentLevel: number;
}

export interface ScopeInfo {
  name: string;
  type: 'global' | 'class' | 'method' | 'block';
  parent?: ScopeInfo;
}

// Transformation Rule Interface
export interface TransformationRule {
  nodeType: NodeType;
  transform(node: ASTNode, context: TransformationContext): PseudocodeNode[];
}

// Base Transformation Rule Class
export abstract class BaseTransformationRule implements TransformationRule {
  abstract nodeType: NodeType;
  abstract transform(node: ASTNode, context: TransformationContext): PseudocodeNode[];

  protected createPseudocodeNode(
    type: PseudocodeNodeType,
    content: string,
    location: SourceLocation,
    indentLevel: number = 0,
    children?: PseudocodeNode[]
  ): PseudocodeNode {
    return {
      type,
      content,
      indentLevel,
      children,
      location
    };
  }

  protected transformChildren(
    children: ASTNode[] | undefined,
    context: TransformationContext
  ): PseudocodeNode[] {
    if (!children) return [];
    
    const result: PseudocodeNode[] = [];
    for (const child of children) {
      const transformed = context.transformer.transformNode(child, context);
      result.push(...transformed);
    }
    return result;
  }
}

// Variable Declaration Transformation Rule
export class VariableDeclarationRule extends BaseTransformationRule {
  nodeType = NodeType.VARIABLE_DECLARATION;

  transform(node: ASTNode, context: TransformationContext): PseudocodeNode[] {
    const varNode = node as VariableDeclarationNode;
    const pseudocodeName = context.ibRules.convertVariableName(varNode.name);
    
    // Store variable info in context
    const variableInfo: VariableInfo = {
      originalName: varNode.name,
      pseudocodeName,
      type: varNode.dataType,
      scope: context.currentScope.name
    };
    context.variables.set(varNode.name, variableInfo);

    let content: string;
    if (varNode.initializer) {
      // Transform the initializer expression
      const initializerNodes = context.transformer.transformNode(varNode.initializer, context);
      const initializerContent = initializerNodes.map(n => n.content).join('');
      content = `${pseudocodeName} = ${initializerContent}`;
    } else {
      // Just declare the variable (though IB pseudocode typically doesn't have explicit declarations)
      content = `${pseudocodeName}`;
    }

    return [this.createPseudocodeNode(
      PseudocodeNodeType.STATEMENT,
      content,
      node.location,
      context.indentLevel
    )];
  }
}

// Assignment Transformation Rule
export class AssignmentRule extends BaseTransformationRule {
  nodeType = NodeType.ASSIGNMENT;

  transform(node: ASTNode, context: TransformationContext): PseudocodeNode[] {
    const assignNode = node as AssignmentNode;
    
    // Transform left side (variable name)
    const leftNodes = context.transformer.transformNode(assignNode.left, context);
    const leftContent = leftNodes.map(n => n.content).join('');
    
    // Transform right side (expression)
    const rightNodes = context.transformer.transformNode(assignNode.right, context);
    const rightContent = rightNodes.map(n => n.content).join('');
    
    // Convert operator (= stays =, but += becomes = with expanded expression)
    let operator = assignNode.operator;
    let finalRightContent = rightContent;
    
    if (operator !== '=') {
      // Convert compound assignment operators
      const baseOperator = operator.slice(0, -1); // Remove '=' from '+=', '-=', etc.
      const convertedOperator = context.ibRules.convertOperator(baseOperator);
      finalRightContent = `${leftContent} ${convertedOperator} ${rightContent}`;
      operator = '=';
    }

    const content = `${leftContent} ${operator} ${finalRightContent}`;

    return [this.createPseudocodeNode(
      PseudocodeNodeType.STATEMENT,
      content,
      node.location,
      context.indentLevel
    )];
  }
}

// Binary Expression Transformation Rule
export class BinaryExpressionRule extends BaseTransformationRule {
  nodeType = NodeType.BINARY_EXPRESSION;

  transform(node: ASTNode, context: TransformationContext): PseudocodeNode[] {
    const binaryNode = node as BinaryExpressionNode;
    
    // Handle unary expressions (where left operand is empty)
    if (binaryNode.left && (binaryNode.left as LiteralNode).value === '') {
      // This is a unary expression
      const rightNodes = context.transformer.transformNode(binaryNode.right, context);
      const rightContent = rightNodes.map(n => n.content).join('');
      const convertedOperator = context.ibRules.convertOperator(binaryNode.operator);
      
      const content = `${convertedOperator} ${rightContent}`;
      return [this.createPseudocodeNode(
        PseudocodeNodeType.EXPRESSION,
        content,
        node.location
      )];
    }

    // Transform left operand
    const leftNodes = context.transformer.transformNode(binaryNode.left, context);
    const leftContent = leftNodes.map(n => n.content).join('');
    
    // Transform right operand
    const rightNodes = context.transformer.transformNode(binaryNode.right, context);
    const rightContent = rightNodes.map(n => n.content).join('');
    
    // Convert operator using IB rules
    const convertedOperator = context.ibRules.convertOperator(binaryNode.operator);
    
    const content = `${leftContent} ${convertedOperator} ${rightContent}`;

    return [this.createPseudocodeNode(
      PseudocodeNodeType.EXPRESSION,
      content,
      node.location
    )];
  }
}

// Identifier Transformation Rule
export class IdentifierRule extends BaseTransformationRule {
  nodeType = NodeType.IDENTIFIER;

  transform(node: ASTNode, context: TransformationContext): PseudocodeNode[] {
    const identifierNode = node as IdentifierNode;
    
    // Check if this identifier is a known variable
    const variableInfo = context.variables.get(identifierNode.name);
    const pseudocodeName = variableInfo 
      ? variableInfo.pseudocodeName 
      : context.ibRules.convertVariableName(identifierNode.name);

    return [this.createPseudocodeNode(
      PseudocodeNodeType.EXPRESSION,
      pseudocodeName,
      node.location
    )];
  }
}

// Literal Transformation Rule
export class LiteralRule extends BaseTransformationRule {
  nodeType = NodeType.LITERAL;

  transform(node: ASTNode, context: TransformationContext): PseudocodeNode[] {
    const literalNode = node as LiteralNode;
    
    // Literals generally stay the same in IB pseudocode
    let content = literalNode.value;
    
    // Handle boolean literals
    if (literalNode.dataType === 'boolean') {
      content = content.toUpperCase(); // true -> TRUE, false -> FALSE
    }

    return [this.createPseudocodeNode(
      PseudocodeNodeType.EXPRESSION,
      content,
      node.location
    )];
  }
}

// If Statement Transformation Rule
export class IfStatementRule extends BaseTransformationRule {
  nodeType = NodeType.IF_STATEMENT;

  transform(node: ASTNode, context: TransformationContext): PseudocodeNode[] {
    const ifNode = node as IfStatementNode;
    const result: PseudocodeNode[] = [];

    // Transform condition
    const conditionNodes = context.transformer.transformNode(ifNode.condition, context);
    const conditionContent = conditionNodes.map(n => n.content).join('');

    // Create if statement
    result.push(this.createPseudocodeNode(
      PseudocodeNodeType.STATEMENT,
      `if ${conditionContent} then`,
      node.location,
      context.indentLevel
    ));

    // Transform then statement with increased indentation
    const thenContext = { ...context, indentLevel: context.indentLevel + 1 };
    const thenNodes = this.transformStatementBody(ifNode.thenStatement, thenContext);
    result.push(...thenNodes);

    // Transform else statement if present
    if (ifNode.elseStatement) {
      result.push(this.createPseudocodeNode(
        PseudocodeNodeType.STATEMENT,
        'else',
        node.location,
        context.indentLevel
      ));

      const elseContext = { ...context, indentLevel: context.indentLevel + 1 };
      const elseNodes = this.transformStatementBody(ifNode.elseStatement, elseContext);
      result.push(...elseNodes);
    }

    // End if
    result.push(this.createPseudocodeNode(
      PseudocodeNodeType.STATEMENT,
      'end if',
      node.location,
      context.indentLevel
    ));

    return result;
  }

  private transformStatementBody(statement: ASTNode, context: TransformationContext): PseudocodeNode[] {
    // Handle block statements (multiple statements)
    if (statement.type === NodeType.PROGRAM && statement.children) {
      const result: PseudocodeNode[] = [];
      for (const child of statement.children) {
        const childNodes = context.transformer.transformNode(child, context);
        result.push(...childNodes);
      }
      return result;
    }

    // Handle single statement
    return context.transformer.transformNode(statement, context);
  }
}

// While Loop Transformation Rule
export class WhileLoopRule extends BaseTransformationRule {
  nodeType = NodeType.WHILE_LOOP;

  transform(node: ASTNode, context: TransformationContext): PseudocodeNode[] {
    const whileNode = node as WhileLoopNode;
    const result: PseudocodeNode[] = [];

    // Transform condition
    const conditionNodes = context.transformer.transformNode(whileNode.condition, context);
    const conditionContent = conditionNodes.map(n => n.content).join('');

    // Create loop while statement
    result.push(this.createPseudocodeNode(
      PseudocodeNodeType.STATEMENT,
      `loop while ${conditionContent}`,
      node.location,
      context.indentLevel
    ));

    // Transform body with increased indentation
    const bodyContext = { ...context, indentLevel: context.indentLevel + 1 };
    const bodyNodes = this.transformStatementBody(whileNode.body, bodyContext);
    result.push(...bodyNodes);

    // End loop
    result.push(this.createPseudocodeNode(
      PseudocodeNodeType.STATEMENT,
      'end loop',
      node.location,
      context.indentLevel
    ));

    return result;
  }

  private transformStatementBody(statement: ASTNode, context: TransformationContext): PseudocodeNode[] {
    // Handle block statements (multiple statements)
    if (statement.type === NodeType.PROGRAM && statement.children) {
      const result: PseudocodeNode[] = [];
      for (const child of statement.children) {
        const childNodes = context.transformer.transformNode(child, context);
        result.push(...childNodes);
      }
      return result;
    }

    // Handle single statement
    return context.transformer.transformNode(statement, context);
  }
}

// For Loop Transformation Rule
export class ForLoopRule extends BaseTransformationRule {
  nodeType = NodeType.FOR_LOOP;

  transform(node: ASTNode, context: TransformationContext): PseudocodeNode[] {
    const forNode = node as ForLoopNode;
    const result: PseudocodeNode[] = [];

    // Check if this is a simple counting for loop (for(int i = start; i < end; i++))
    if (this.isSimpleCountingLoop(forNode)) {
      const loopInfo = this.extractSimpleLoopInfo(forNode, context);
      if (loopInfo) {
        // Create IB-style counting loop: loop I from X to Y
        result.push(this.createPseudocodeNode(
          PseudocodeNodeType.STATEMENT,
          `loop ${loopInfo.variable} from ${loopInfo.start} to ${loopInfo.end}`,
          node.location,
          context.indentLevel
        ));

        // Transform body with increased indentation
        const bodyContext = { ...context, indentLevel: context.indentLevel + 1 };
        const bodyNodes = this.transformStatementBody(forNode.body, bodyContext);
        result.push(...bodyNodes);

        // End loop
        result.push(this.createPseudocodeNode(
          PseudocodeNodeType.STATEMENT,
          'end loop',
          node.location,
          context.indentLevel
        ));

        return result;
      }
    }

    // For complex for loops, convert to while loop equivalent
    result.push(this.createPseudocodeNode(
      PseudocodeNodeType.COMMENT,
      '// Complex for loop converted to while loop',
      node.location,
      context.indentLevel
    ));

    // Transform initialization if present
    if (forNode.initialization) {
      const initNodes = context.transformer.transformNode(forNode.initialization, context);
      result.push(...initNodes);
    }

    // Create while loop with condition
    if (forNode.condition) {
      const conditionNodes = context.transformer.transformNode(forNode.condition, context);
      const conditionContent = conditionNodes.map(n => n.content).join('');

      result.push(this.createPseudocodeNode(
        PseudocodeNodeType.STATEMENT,
        `loop while ${conditionContent}`,
        node.location,
        context.indentLevel
      ));

      // Transform body with increased indentation
      const bodyContext = { ...context, indentLevel: context.indentLevel + 1 };
      const bodyNodes = this.transformStatementBody(forNode.body, bodyContext);
      result.push(...bodyNodes);

      // Transform update statement if present
      if (forNode.update) {
        const updateNodes = context.transformer.transformNode(forNode.update, bodyContext);
        result.push(...updateNodes);
      }

      // End loop
      result.push(this.createPseudocodeNode(
        PseudocodeNodeType.STATEMENT,
        'end loop',
        node.location,
        context.indentLevel
      ));
    }

    return result;
  }

  private isSimpleCountingLoop(forNode: ForLoopNode): boolean {
    // Check if this matches pattern: for(int i = start; i < end; i++)
    if (!forNode.initialization || !forNode.condition || !forNode.update) {
      return false;
    }

    // Check initialization: int i = start
    if (forNode.initialization.type !== NodeType.VARIABLE_DECLARATION) {
      return false;
    }

    // Check condition: i < end or i <= end
    if (forNode.condition.type !== NodeType.BINARY_EXPRESSION) {
      return false;
    }

    const conditionNode = forNode.condition as BinaryExpressionNode;
    if (!['<', '<='].includes(conditionNode.operator)) {
      return false;
    }

    // Check update: i++ or ++i
    if (forNode.update.type !== NodeType.BINARY_EXPRESSION) {
      return false;
    }

    const updateNode = forNode.update as BinaryExpressionNode;
    if (!['++', '--'].includes(updateNode.operator)) {
      return false;
    }

    return true;
  }

  private extractSimpleLoopInfo(forNode: ForLoopNode, context: TransformationContext): {
    variable: string;
    start: string;
    end: string;
  } | null {
    try {
      // Extract variable name from initialization
      const initNode = forNode.initialization as VariableDeclarationNode;
      const variableName = context.ibRules.convertVariableName(initNode.name);

      // Extract start value
      let startValue = '0';
      if (initNode.initializer) {
        const startNodes = context.transformer.transformNode(initNode.initializer, context);
        startValue = startNodes.map(n => n.content).join('');
      }

      // Extract end value from condition
      const conditionNode = forNode.condition as BinaryExpressionNode;
      const endNodes = context.transformer.transformNode(conditionNode.right, context);
      let endValue = endNodes.map(n => n.content).join('');

      // Adjust end value for <= vs < comparison
      if (conditionNode.operator === '<') {
        // For i < n, the loop goes from start to n-1
        endValue = `${endValue} - 1`;
      }

      return {
        variable: variableName,
        start: startValue,
        end: endValue
      };
    } catch (error) {
      return null;
    }
  }

  private transformStatementBody(statement: ASTNode, context: TransformationContext): PseudocodeNode[] {
    // Handle block statements (multiple statements)
    if (statement.type === NodeType.PROGRAM && statement.children) {
      const result: PseudocodeNode[] = [];
      for (const child of statement.children) {
        const childNodes = context.transformer.transformNode(child, context);
        result.push(...childNodes);
      }
      return result;
    }

    // Handle single statement
    return context.transformer.transformNode(statement, context);
  }
}

// Main AST Transformer Class
export class ASTTransformer {
  private rules: Map<NodeType, TransformationRule>;
  private ibRules: IBRulesEngine;
  private errors: ConversionError[] = [];

  constructor() {
    this.ibRules = new IBRulesEngine();
    this.rules = new Map();
    this.initializeRules();
  }

  private initializeRules(): void {
    const rules: TransformationRule[] = [
      new VariableDeclarationRule(),
      new AssignmentRule(),
      new BinaryExpressionRule(),
      new IdentifierRule(),
      new LiteralRule(),
      new IfStatementRule(),
      new WhileLoopRule(),
      new ForLoopRule()
    ];

    for (const rule of rules) {
      this.rules.set(rule.nodeType, rule);
    }
  }

  /**
   * Transform a Java AST into IB Pseudocode AST
   * @param ast - The Java AST to transform
   * @returns Transformation result with pseudocode AST and any errors
   */
  transform(ast: ASTNode): { pseudocodeAST: PseudocodeNode[], errors: ConversionError[] } {
    this.errors = [];
    
    const context: TransformationContext = {
      variables: new Map(),
      methods: new Map(),
      currentScope: { name: 'global', type: 'global' },
      ibRules: this.ibRules,
      indentLevel: 0,
      transformer: this // Add reference to transformer for recursive calls
    };

    try {
      const pseudocodeAST = this.transformNode(ast, context);
      return { pseudocodeAST, errors: this.errors };
    } catch (error) {
      if (error instanceof Error) {
        this.addError(ErrorType.CONVERSION_ERROR, error.message, ast.location);
      }
      return { pseudocodeAST: [], errors: this.errors };
    }
  }

  /**
   * Transform a single AST node
   * @param node - The AST node to transform
   * @param context - The transformation context
   * @returns Array of pseudocode nodes
   */
  transformNode(node: ASTNode, context: TransformationContext): PseudocodeNode[] {
    const rule = this.rules.get(node.type);
    
    if (!rule) {
      this.addError(
        ErrorType.CONVERSION_ERROR,
        `No transformation rule found for node type: ${node.type}`,
        node.location
      );
      return [];
    }

    try {
      return rule.transform(node, context);
    } catch (error) {
      if (error instanceof Error) {
        this.addError(ErrorType.CONVERSION_ERROR, error.message, node.location);
      }
      return [];
    }
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

// Extend TransformationContext to include transformer reference
declare module './transformer' {
  interface TransformationContext {
    transformer: ASTTransformer;
  }
}