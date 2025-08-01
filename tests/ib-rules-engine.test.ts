/**
 * Unit tests for IBRulesEngine
 */

import { IBRulesEngine, MethodInfo, ParameterInfo } from '../src/ib-rules-engine';

describe('IBRulesEngine', () => {
  let engine: IBRulesEngine;

  beforeEach(() => {
    engine = new IBRulesEngine();
  });

  describe('convertVariableName', () => {
    test('should convert simple camelCase to UPPERCASE', () => {
      expect(engine.convertVariableName('myVariable')).toBe('MY_VARIABLE');
      expect(engine.convertVariableName('userName')).toBe('USER_NAME');
      expect(engine.convertVariableName('totalCount')).toBe('TOTAL_COUNT');
    });

    test('should handle single word variables', () => {
      expect(engine.convertVariableName('name')).toBe('NAME');
      expect(engine.convertVariableName('count')).toBe('COUNT');
      expect(engine.convertVariableName('x')).toBe('X');
    });

    test('should handle multiple camelCase segments', () => {
      expect(engine.convertVariableName('myVeryLongVariableName')).toBe('MY_VERY_LONG_VARIABLE_NAME');
      expect(engine.convertVariableName('firstNameLastName')).toBe('FIRST_NAME_LAST_NAME');
    });

    test('should handle variables starting with uppercase', () => {
      expect(engine.convertVariableName('MyVariable')).toBe('MY_VARIABLE');
      expect(engine.convertVariableName('UserName')).toBe('USER_NAME');
    });

    test('should handle variables with numbers', () => {
      expect(engine.convertVariableName('value1')).toBe('VALUE1');
      expect(engine.convertVariableName('myValue2')).toBe('MY_VALUE2');
      expect(engine.convertVariableName('test123Variable')).toBe('TEST123_VARIABLE');
    });
  });

  describe('convertOperator', () => {
    test('should convert comparison operators', () => {
      expect(engine.convertOperator('==')).toBe('=');
      expect(engine.convertOperator('!=')).toBe('≠');
      expect(engine.convertOperator('>')).toBe('>');
      expect(engine.convertOperator('<')).toBe('<');
      expect(engine.convertOperator('>=')).toBe('>=');
      expect(engine.convertOperator('<=')).toBe('<=');
    });

    test('should convert logical operators', () => {
      expect(engine.convertOperator('&&')).toBe('AND');
      expect(engine.convertOperator('||')).toBe('OR');
      expect(engine.convertOperator('!')).toBe('NOT');
    });

    test('should convert arithmetic operators', () => {
      expect(engine.convertOperator('%')).toBe('mod');
      expect(engine.convertOperator('/')).toBe('div');
      expect(engine.convertOperator('+')).toBe('+');
      expect(engine.convertOperator('-')).toBe('-');
      expect(engine.convertOperator('*')).toBe('*');
    });

    test('should preserve assignment operator', () => {
      expect(engine.convertOperator('=')).toBe('=');
    });

    test('should return unknown operators unchanged', () => {
      expect(engine.convertOperator('??')).toBe('??');
      expect(engine.convertOperator('+++')).toBe('+++');
    });
  });

  describe('convertControlStructure', () => {
    test('should convert if statements', () => {
      expect(engine.convertControlStructure('if', 'x > 5')).toBe('if x > 5 then');
      expect(engine.convertControlStructure('if')).toBe('if');
      expect(engine.convertControlStructure('else')).toBe('else');
      expect(engine.convertControlStructure('endif')).toBe('end if');
    });

    test('should convert while loops', () => {
      expect(engine.convertControlStructure('while', 'x < 10')).toBe('loop while x < 10');
      expect(engine.convertControlStructure('while')).toBe('loop while');
      expect(engine.convertControlStructure('endwhile')).toBe('end loop');
    });

    test('should convert for loops', () => {
      expect(engine.convertControlStructure('for')).toBe('loop');
      expect(engine.convertControlStructure('endfor')).toBe('end loop');
    });

    test('should convert switch statement structures', () => {
      expect(engine.convertControlStructure('switch', 'VARIABLE')).toBe('case VARIABLE of');
      expect(engine.convertControlStructure('endswitch')).toBe('end case');
      expect(engine.convertControlStructure('case', 'VALUE')).toBe('VALUE:');
      expect(engine.convertControlStructure('default')).toBe('default:');
    });

    test('should handle case insensitive input', () => {
      expect(engine.convertControlStructure('IF', 'x > 5')).toBe('if x > 5 then');
      expect(engine.convertControlStructure('WHILE', 'x < 10')).toBe('loop while x < 10');
      expect(engine.convertControlStructure('ELSE')).toBe('else');
    });

    test('should return unknown control structures unchanged', () => {
      expect(engine.convertControlStructure('unknown')).toBe('unknown');
      expect(engine.convertControlStructure('custom')).toBe('custom');
    });
  });

  describe('convertMethodDeclaration', () => {
    test('should convert void methods to PROCEDURE format', () => {
      const voidMethod: MethodInfo = {
        originalName: 'printMessage',
        pseudocodeName: 'PRINT_MESSAGE',
        returnType: 'void',
        parameters: [],
        isVoid: true,
        isStatic: false
      };

      expect(engine.convertMethodDeclaration(voidMethod)).toBe('PROCEDURE PRINT_MESSAGE');
    });

    test('should convert void methods with parameters to PROCEDURE format', () => {
      const parameters: ParameterInfo[] = [
        { originalName: 'message', pseudocodeName: 'MESSAGE', type: 'String' },
        { originalName: 'count', pseudocodeName: 'COUNT', type: 'int' },
      ];

      const voidMethodWithParams: MethodInfo = {
        originalName: 'printMessageMultiple',
        pseudocodeName: 'PRINT_MESSAGE_MULTIPLE',
        returnType: 'void',
        parameters,
        isVoid: true,
        isStatic: false
      };

      expect(engine.convertMethodDeclaration(voidMethodWithParams)).toBe('PROCEDURE PRINT_MESSAGE_MULTIPLE(MESSAGE, COUNT)');
    });

    test('should convert non-void methods to FUNCTION format', () => {
      const nonVoidMethod: MethodInfo = {
        originalName: 'calculateSum',
        pseudocodeName: 'CALCULATE_SUM',
        returnType: 'int',
        parameters: [],
        isVoid: false,
        isStatic: false
      };

      expect(engine.convertMethodDeclaration(nonVoidMethod)).toBe('FUNCTION CALCULATE_SUM');
    });

    test('should convert non-void methods with parameters to FUNCTION format', () => {
      const parameters: ParameterInfo[] = [
        { originalName: 'firstNumber', pseudocodeName: 'FIRST_NUMBER', type: 'int' },
        { originalName: 'secondNumber', pseudocodeName: 'SECOND_NUMBER', type: 'int' },
      ];

      const nonVoidMethodWithParams: MethodInfo = {
        originalName: 'addNumbers',
        pseudocodeName: 'ADD_NUMBERS',
        returnType: 'int',
        parameters,
        isVoid: false,
        isStatic: false
      };

      expect(engine.convertMethodDeclaration(nonVoidMethodWithParams)).toBe('FUNCTION ADD_NUMBERS(FIRST_NUMBER, SECOND_NUMBER)');
    });
  });

  describe('convertDataType', () => {
    test('should return null for all Java types (types omitted in IB pseudocode)', () => {
      expect(engine.convertDataType('int')).toBeNull();
      expect(engine.convertDataType('double')).toBeNull();
      expect(engine.convertDataType('boolean')).toBeNull();
      expect(engine.convertDataType('String')).toBeNull();
      expect(engine.convertDataType('void')).toBeNull();
      expect(engine.convertDataType('Object')).toBeNull();
    });
  });

  describe('convertForLoop', () => {
    test('should convert basic for loop format', () => {
      expect(engine.convertForLoop('i', '0', '10')).toBe('loop I from 0 to 10');
      expect(engine.convertForLoop('counter', '1', '100')).toBe('loop COUNTER from 1 to 100');
    });

    test('should convert for loop with step', () => {
      expect(engine.convertForLoop('i', '0', '10', '2')).toBe('loop I from 0 to 10 step 2');
      expect(engine.convertForLoop('j', '10', '0', '-1')).toBe('loop J from 10 to 0 step -1');
    });

    test('should omit step when it is 1', () => {
      expect(engine.convertForLoop('i', '0', '10', '1')).toBe('loop I from 0 to 10');
    });

    test('should handle camelCase variable names', () => {
      expect(engine.convertForLoop('loopCounter', '0', '5')).toBe('loop LOOP_COUNTER from 0 to 5');
    });
  });

  describe('convertArrayLength', () => {
    test('should convert array length access', () => {
      expect(engine.convertArrayLength('myArray')).toBe('SIZE(MY_ARRAY)');
      expect(engine.convertArrayLength('numbers')).toBe('SIZE(NUMBERS)');
      expect(engine.convertArrayLength('studentNames')).toBe('SIZE(STUDENT_NAMES)');
    });

    test('should handle single character array names', () => {
      expect(engine.convertArrayLength('a')).toBe('SIZE(A)');
      expect(engine.convertArrayLength('x')).toBe('SIZE(X)');
    });
  });

  describe('convertIOStatement', () => {
    test('should convert output statements', () => {
      expect(engine.convertIOStatement('output', '"Hello World"')).toBe('output "Hello World"');
      expect(engine.convertIOStatement('output', 'myVariable')).toBe('output myVariable');
      expect(engine.convertIOStatement('output', '42')).toBe('output 42');
    });

    test('should convert input statements', () => {
      expect(engine.convertIOStatement('input', 'userName')).toBe('input USER_NAME');
      expect(engine.convertIOStatement('input', 'age')).toBe('input AGE');
      expect(engine.convertIOStatement('input', 'studentScore')).toBe('input STUDENT_SCORE');
    });

    test('should handle single character variable names for input', () => {
      expect(engine.convertIOStatement('input', 'x')).toBe('input X');
      expect(engine.convertIOStatement('input', 'n')).toBe('input N');
    });
  });
});