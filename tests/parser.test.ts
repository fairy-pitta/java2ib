/**
 * Unit tests for the Java Parser
 */

import { Parser, ProgramNode, ClassDeclarationNode, MethodDeclarationNode, VariableDeclarationNode, AssignmentNode, BinaryExpressionNode, IfStatementNode, WhileLoopNode, ForLoopNode, LiteralNode, IdentifierNode, MethodCallNode, ArrayAccessNode } from '../src/parser';
import { Lexer } from '../src/lexer';
import { NodeType, ErrorType } from '../src/types';

describe('Parser', () => {
  function parseJavaCode(code: string) {
    const lexer = new Lexer(code);
    const { tokens, errors: lexErrors } = lexer.tokenize();
    expect(lexErrors).toHaveLength(0); // Ensure no lexical errors
    
    const parser = new Parser(tokens);
    return parser.parse();
  }

  describe('Variable Declarations', () => {
    test('should parse simple variable declaration', () => {
      const code = 'int x;';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      expect(ast).not.toBeNull();
      expect(ast!.type).toBe(NodeType.PROGRAM);
      expect(ast!.declarations).toHaveLength(1);
      
      const varDecl = ast!.declarations[0] as VariableDeclarationNode;
      expect(varDecl.type).toBe(NodeType.VARIABLE_DECLARATION);
      expect(varDecl.name).toBe('x');
      expect(varDecl.dataType).toBe('int');
      expect(varDecl.initializer).toBeUndefined();
    });

    test('should parse variable declaration with initialization', () => {
      const code = 'int x = 5;';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      expect(ast).not.toBeNull();
      
      const varDecl = ast!.declarations[0] as VariableDeclarationNode;
      expect(varDecl.type).toBe(NodeType.VARIABLE_DECLARATION);
      expect(varDecl.name).toBe('x');
      expect(varDecl.dataType).toBe('int');
      expect(varDecl.initializer).toBeDefined();
      expect(varDecl.initializer!.type).toBe(NodeType.LITERAL);
      expect((varDecl.initializer as LiteralNode).value).toBe('5');
    });

    test('should parse multiple variable declarations', () => {
      const code = `
        int x = 10;
        double y;
        String name = "test";
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      expect(ast!.declarations).toHaveLength(3);
      
      const intDecl = ast!.declarations[0] as VariableDeclarationNode;
      expect(intDecl.name).toBe('x');
      expect(intDecl.dataType).toBe('int');
      
      const doubleDecl = ast!.declarations[1] as VariableDeclarationNode;
      expect(doubleDecl.name).toBe('y');
      expect(doubleDecl.dataType).toBe('double');
      
      const stringDecl = ast!.declarations[2] as VariableDeclarationNode;
      expect(stringDecl.name).toBe('name');
      expect(stringDecl.dataType).toBe('String');
    });
  });

  describe('Assignments', () => {
    test('should parse simple assignment', () => {
      const code = 'x = 5;';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      expect(ast!.declarations).toHaveLength(1);
      
      const assignment = ast!.declarations[0] as AssignmentNode;
      expect(assignment.type).toBe(NodeType.ASSIGNMENT);
      expect(assignment.operator).toBe('=');
      expect(assignment.left.type).toBe(NodeType.IDENTIFIER);
      expect((assignment.left as IdentifierNode).name).toBe('x');
      expect(assignment.right.type).toBe(NodeType.LITERAL);
      expect((assignment.right as LiteralNode).value).toBe('5');
    });

    test('should parse compound assignments', () => {
      const code = 'x += 10;';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const assignment = ast!.declarations[0] as AssignmentNode;
      expect(assignment.operator).toBe('+=');
    });
  });

  describe('Expressions', () => {
    test('should parse binary expressions', () => {
      const code = 'result = a + b * c;';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const assignment = ast!.declarations[0] as AssignmentNode;
      const rightExpr = assignment.right as BinaryExpressionNode;
      
      expect(rightExpr.type).toBe(NodeType.BINARY_EXPRESSION);
      expect(rightExpr.operator).toBe('+');
      expect((rightExpr.left as IdentifierNode).name).toBe('a');
      
      const multiplyExpr = rightExpr.right as BinaryExpressionNode;
      expect(multiplyExpr.operator).toBe('*');
      expect((multiplyExpr.left as IdentifierNode).name).toBe('b');
      expect((multiplyExpr.right as IdentifierNode).name).toBe('c');
    });

    test('should parse comparison expressions', () => {
      const code = 'result = x == y;';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const assignment = ast!.declarations[0] as AssignmentNode;
      const comparison = assignment.right as BinaryExpressionNode;
      
      expect(comparison.operator).toBe('==');
      expect((comparison.left as IdentifierNode).name).toBe('x');
      expect((comparison.right as IdentifierNode).name).toBe('y');
    });

    test('should parse logical expressions', () => {
      const code = 'result = a && b || c;';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const assignment = ast!.declarations[0] as AssignmentNode;
      const logicalOr = assignment.right as BinaryExpressionNode;
      
      expect(logicalOr.operator).toBe('||');
      const logicalAnd = logicalOr.left as BinaryExpressionNode;
      expect(logicalAnd.operator).toBe('&&');
    });

    test('should parse parenthesized expressions', () => {
      const code = 'result = (a + b) * c;';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const assignment = ast!.declarations[0] as AssignmentNode;
      const multiply = assignment.right as BinaryExpressionNode;
      
      expect(multiply.operator).toBe('*');
      const addition = multiply.left as BinaryExpressionNode;
      expect(addition.operator).toBe('+');
    });
  });

  describe('Method Declarations', () => {
    test('should parse void method with no parameters', () => {
      const code = `
        public void printMessage() {
          System.out.println("Hello");
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const method = ast!.declarations[0] as MethodDeclarationNode;
      
      expect(method.type).toBe(NodeType.METHOD_DECLARATION);
      expect(method.name).toBe('printMessage');
      expect(method.returnType).toBe('void');
      expect(method.isVoid).toBe(true);
      expect(method.isPublic).toBe(true);
      expect(method.parameters).toHaveLength(0);
      expect(method.body).toHaveLength(1);
    });

    test('should parse method with return type and parameters', () => {
      const code = `
        public static int add(int a, int b) {
          return a + b;
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const method = ast!.declarations[0] as MethodDeclarationNode;
      
      expect(method.name).toBe('add');
      expect(method.returnType).toBe('int');
      expect(method.isVoid).toBe(false);
      expect(method.isStatic).toBe(true);
      expect(method.parameters).toHaveLength(2);
      expect(method.parameters[0].name).toBe('a');
      expect(method.parameters[0].paramType).toBe('int');
      expect(method.parameters[1].name).toBe('b');
      expect(method.parameters[1].paramType).toBe('int');
    });

    test('should parse private method', () => {
      const code = `
        private double calculate(double x) {
          return x * 2.0;
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const method = ast!.declarations[0] as MethodDeclarationNode;
      
      expect(method.isPublic).toBe(false);
      expect(method.returnType).toBe('double');
    });
  });

  describe('Control Structures', () => {
    test('should parse if statement', () => {
      const code = `
        if (x > 0) {
          y = 1;
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const ifStmt = ast!.declarations[0] as IfStatementNode;
      
      expect(ifStmt.type).toBe(NodeType.IF_STATEMENT);
      expect(ifStmt.condition.type).toBe(NodeType.BINARY_EXPRESSION);
      expect(ifStmt.thenStatement).toBeDefined();
      expect(ifStmt.elseStatement).toBeUndefined();
    });

    test('should parse if-else statement', () => {
      const code = `
        if (x > 0) {
          y = 1;
        } else {
          y = -1;
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const ifStmt = ast!.declarations[0] as IfStatementNode;
      
      expect(ifStmt.elseStatement).toBeDefined();
    });

    test('should parse while loop', () => {
      const code = `
        while (i < 10) {
          i++;
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const whileLoop = ast!.declarations[0] as WhileLoopNode;
      
      expect(whileLoop.type).toBe(NodeType.WHILE_LOOP);
      expect(whileLoop.condition.type).toBe(NodeType.BINARY_EXPRESSION);
      expect(whileLoop.body).toBeDefined();
    });

    test('should parse for loop', () => {
      const code = `
        for (int i = 0; i < 10; i++) {
          sum += i;
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const forLoop = ast!.declarations[0] as ForLoopNode;
      
      expect(forLoop.type).toBe(NodeType.FOR_LOOP);
      expect(forLoop.initialization).toBeDefined();
      expect(forLoop.condition).toBeDefined();
      expect(forLoop.update).toBeDefined();
      expect(forLoop.body).toBeDefined();
    });

    test('should parse for loop with missing clauses', () => {
      const code = `
        for (;;) {
          break;
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const forLoop = ast!.declarations[0] as ForLoopNode;
      
      expect(forLoop.initialization).toBeUndefined();
      expect(forLoop.condition).toBeUndefined();
      expect(forLoop.update).toBeUndefined();
    });
  });

  describe('Method Calls', () => {
    test('should parse method call with no arguments', () => {
      const code = 'getValue();';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const methodCall = ast!.declarations[0] as MethodCallNode;
      
      expect(methodCall.type).toBe(NodeType.METHOD_CALL);
      expect(methodCall.methodName).toBe('getValue');
      expect(methodCall.object).toBeUndefined();
      expect(methodCall.arguments).toHaveLength(0);
    });

    test('should parse method call with arguments', () => {
      const code = 'Math.max(a, b);';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const methodCall = ast!.declarations[0] as MethodCallNode;
      
      expect(methodCall.methodName).toBe('max');
      expect(methodCall.object).toBeDefined();
      expect((methodCall.object as IdentifierNode).name).toBe('Math');
      expect(methodCall.arguments).toHaveLength(2);
    });

    test('should parse chained method calls', () => {
      const code = 'obj.getValue().toString();';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const outerCall = ast!.declarations[0] as MethodCallNode;
      
      expect(outerCall.methodName).toBe('toString');
      expect(outerCall.object!.type).toBe(NodeType.METHOD_CALL);
      
      const innerCall = outerCall.object as MethodCallNode;
      expect(innerCall.methodName).toBe('getValue');
    });
  });

  describe('Array Operations', () => {
    test('should parse array access', () => {
      const code = 'value = arr[index];';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const assignment = ast!.declarations[0] as AssignmentNode;
      const arrayAccess = assignment.right as ArrayAccessNode;
      
      expect(arrayAccess.type).toBe(NodeType.ARRAY_ACCESS);
      expect((arrayAccess.array as IdentifierNode).name).toBe('arr');
      expect((arrayAccess.index as IdentifierNode).name).toBe('index');
    });

    test('should parse nested array access', () => {
      const code = 'value = matrix[i][j];';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const assignment = ast!.declarations[0] as AssignmentNode;
      const outerAccess = assignment.right as ArrayAccessNode;
      
      expect(outerAccess.type).toBe(NodeType.ARRAY_ACCESS);
      expect(outerAccess.array.type).toBe(NodeType.ARRAY_ACCESS);
      
      const innerAccess = outerAccess.array as ArrayAccessNode;
      expect((innerAccess.array as IdentifierNode).name).toBe('matrix');
    });
  });

  describe('Class Declarations', () => {
    test('should parse simple class', () => {
      const code = `
        class MyClass {
          int field;
          
          public void method() {
            field = 10;
          }
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const classDecl = ast!.declarations[0] as ClassDeclarationNode;
      
      expect(classDecl.type).toBe(NodeType.CLASS_DECLARATION);
      expect(classDecl.name).toBe('MyClass');
      expect(classDecl.fields).toHaveLength(1);
      expect(classDecl.methods).toHaveLength(1);
      expect(classDecl.fields[0].name).toBe('field');
      expect(classDecl.methods[0].name).toBe('method');
    });
  });

  describe('Literals', () => {
    test('should parse different literal types', () => {
      const code = `
        int num = 42;
        double decimal = 3.14;
        String text = "hello";
        char letter = 'a';
        boolean flag = true;
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      expect(ast!.declarations).toHaveLength(5);
      
      const literals = ast!.declarations.map(decl => 
        (decl as VariableDeclarationNode).initializer as LiteralNode
      );
      
      expect(literals[0].dataType).toBe('number');
      expect(literals[1].dataType).toBe('number');
      expect(literals[2].dataType).toBe('string');
      expect(literals[3].dataType).toBe('char');
      expect(literals[4].dataType).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing semicolon', () => {
      const code = 'int x = 5';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.SYNTAX_ERROR);
      expect(errors[0].message).toContain("Expected ';'");
    });

    test('should handle missing closing brace', () => {
      const code = `
        public void method() {
          int x = 5;
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.SYNTAX_ERROR);
      expect(errors[0].message).toContain("Expected '}'");
    });

    test('should handle missing parenthesis in method call', () => {
      const code = 'getValue);';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.SYNTAX_ERROR);
    });

    test('should handle unexpected token', () => {
      const code = 'int x = @;';
      // First need to handle lexical error
      const lexer = new Lexer(code);
      const { tokens, errors: lexErrors } = lexer.tokenize();
      
      expect(lexErrors).toHaveLength(1);
      expect(lexErrors[0].type).toBe(ErrorType.LEXICAL_ERROR);
    });

    test('should handle malformed if statement', () => {
      const code = `
        if x > 0 {
          y = 1;
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.SYNTAX_ERROR);
      expect(errors[0].message).toContain("Expected '('");
    });

    test('should handle malformed for loop', () => {
      const code = `
        for (int i = 0 i < 10; i++) {
          sum += i;
        }
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].type).toBe(ErrorType.SYNTAX_ERROR);
      expect(errors[0].message).toContain("Expected ';'");
    });

    test('should recover from errors and continue parsing', () => {
      const code = `
        int x = 5
        int y = 10;
        int z = 15;
      `;
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(ast!.declarations.length).toBeGreaterThanOrEqual(1); // Should attempt to parse declarations
    });
  });

  describe('Complex Expressions', () => {
    test('should parse complex nested expressions', () => {
      const code = 'result = (a + b) * (c - d) / (e % f);';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const assignment = ast!.declarations[0] as AssignmentNode;
      expect(assignment.right.type).toBe(NodeType.BINARY_EXPRESSION);
    });

    test('should parse method calls in expressions', () => {
      const code = 'result = Math.max(getValue(), getOtherValue()) + 10;';
      const { ast, errors } = parseJavaCode(code);
      
      expect(errors).toHaveLength(0);
      const assignment = ast!.declarations[0] as AssignmentNode;
      const addition = assignment.right as BinaryExpressionNode;
      expect(addition.operator).toBe('+');
      expect(addition.left.type).toBe(NodeType.METHOD_CALL);
    });
  });
});