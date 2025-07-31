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
      new LiteralRule()
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