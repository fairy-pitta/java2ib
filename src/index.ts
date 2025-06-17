/**
 * Java to IB Pseudocode Converter
 * Main entry point for the conversion process
 */

import { Parser } from './parser/index';
import { Emitter } from './emitter/index';
import {
  ConversionOptions,
  mergeConfig,
  ConfigValidator,
  ParseError,
  EmitError,
  ConfigError
} from './types';

/**
 * Convert Java code to IB Pseudocode format
 * @param javaCode - The Java source code to convert
 * @param options - Optional conversion settings
 * @returns The converted IB pseudocode
 */
export function convertJavaToIB(javaCode: string, options?: ConversionOptions): string {
  try {
    // Validate and merge configuration
    const config = mergeConfig(options);
    const configErrors = ConfigValidator.validate(config);
    
    if (configErrors.length > 0) {
      throw new ConfigError(
        `Configuration errors: ${configErrors.join(', ')}`
      );
    }

    // Phase 1: Parse Java code into intermediate representation
    const parser = new Parser(config.parserOptions);
    const parseResult = parser.parse(javaCode);
    
    if (parseResult.diagnostics.hasErrors()) {
      throw new ParseError(
        `Parse errors: ${parseResult.diagnostics.format()}`
      );
    }
    
    if (!parseResult.ir) {
      throw new ParseError(
        'Failed to parse Java code - no IR generated'
      );
    }

    // Phase 2: Emit IR to IB pseudocode
    const emitter = new Emitter(config.emitterOptions);
    const emitResult = emitter.emit(parseResult.ir);
    
    if (emitResult.diagnostics.hasErrors()) {
      throw new EmitError(
        `Emit errors: ${emitResult.diagnostics.format()}`
      );
    }
    
    return emitResult.code;
  } catch (error) {
    if (error instanceof ParseError || error instanceof EmitError || error instanceof ConfigError) {
      throw error;
    }
    throw new ParseError(
      `Unexpected conversion error: ${error}`
    );
  }
}

/**
 * Parse and convert Java code with proper structure handling
 * (This function is currently unused but kept for future reference)
 */
// function parseAndConvert(code: string, options: ConversionOptions): string {
//   const lines = code.split('\n');
//   const result: string[] = [];
//   let i = 0;
//   let indentLevel = 0;
//   let inMultiLineComment = false;

  // while (i < lines.length) {
  //   const line = lines[i]?.trim() || '';
  //   
  //   // Skip empty lines
  //   if (!line) {
  //     i++;
  //     continue;
  //   }

  //   // Preserve comments
  //   const originalLine = lines[i] || '';
  //   const trimmedLine = originalLine.trim();
  //   
  //   // Handle multi-line comments
  //   if (trimmedLine.includes('/*')) {
  //     inMultiLineComment = true;
  //   }
  //   
  //   // Check if this line should be preserved as a comment
  //   const isComment = trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || inMultiLineComment || trimmedLine.includes('*/');
  //   
  //   if (options.preserveComments && isComment) {
  //     // Preserve the original line including whitespace for all comments
  //     result.push(originalLine); // Keep original spacing and indentation
  //     i++;
  //     
  //     // Update multi-line comment state after processing the line
  //     if (trimmedLine.includes('*/')) {
  //       inMultiLineComment = false;
  //     }
  //     continue;
  //   }
  //   
  //   // Update multi-line comment state for non-comment lines
  //   if (trimmedLine.includes('*/')) {
  //     inMultiLineComment = false;
  //   }

  //   // Parse control structures
  //   const parseResult = parseControlStructure(lines, i, indentLevel);
  //   if (parseResult) {
  //     result.push(...parseResult.lines);
  //     i = parseResult.nextIndex;
  //     
  //     // Check if the next non-empty line is another method definition
  //     let nextIndex = i;
  //     while (nextIndex < lines.length && !lines[nextIndex]?.trim()) {
  //       nextIndex++;
  //     }
  //     
  //     if (nextIndex < lines.length) {
  //       const nextLine = lines[nextIndex]?.trim() || '';
  //       // If next line is another method or constructor, add empty line
  //       if (nextLine.match(/^(public|private|protected)\s+(static\s+)?(void|int|String|boolean|double|float|\w+)\s+\w+\s*\(/) ||
  //           nextLine.match(/^(public|private|protected)\s+\w+\s*\(/)) {
  //         result.push('');
  //       }
  //     }
  //     
  //     continue;
  //   }

  //   // Convert single line
  //   const converted = convertLine(line);
  //   if (converted && converted.trim()) {
  //     const indent = ' '.repeat(indentLevel * 4);
  //     result.push(indent + converted.trim());
  //   }
  //   i++;
  // }

  // return result.join('\n');
// }

/**
 * Parse control structures (IF, WHILE, FOR, etc.)
 */
function parseControlStructure(lines: string[], startIndex: number, currentIndent: number): { lines: string[], nextIndex: number } | null {
  const line = lines[startIndex]?.trim() || '';

  // Method definition
  if (line.match(/^(public|private|protected)\s+(static\s+)?(void|int|String|boolean|double|float)\s+\w+\s*\(/)) {
    return parseMethodDefinition(lines, startIndex, currentIndent);
  }

  // Constructor definition
  if (line.match(/^(public|private|protected)\s+\w+\s*\(/)) {
    return parseMethodDefinition(lines, startIndex, currentIndent);
  }

  // IF statement
  if (line.startsWith('if (')) {
    return parseIfStatement(lines, startIndex, currentIndent);
  }

  // WHILE loop
  if (line.startsWith('while (')) {
    return parseWhileLoop(lines, startIndex, currentIndent);
  }

  // FOR loop
  if (line.startsWith('for (')) {
    return parseForLoop(lines, startIndex, currentIndent);
  }

  // DO-WHILE loop
  if (line.startsWith('do {')) {
    return parseDoWhileLoop(lines, startIndex, currentIndent);
  }

  return null;
}

/**
 * Parse IF statement
 */
function parseIfStatement(lines: string[], startIndex: number, currentIndent: number): { lines: string[], nextIndex: number } {
  const result: string[] = [];
  const indentStr = ' '.repeat(currentIndent * 4);
  let i = startIndex;

  // Parse IF condition
  const ifLine = lines[i]?.trim() || '';
  const conditionMatch = ifLine.match(/^if \((.+)\)\s*\{?$/);
  if (conditionMatch && conditionMatch[1]) {
    const condition = convertExpression(conditionMatch[1], true); // Preserve case for conditions
    result.push(`${indentStr}IF ${condition} THEN`);
    i++;

    // Parse IF body
    i = parseBlock(lines, i, currentIndent + 1, result);

    // Parse ELSE IF and ELSE
    while (i < lines.length) {
      const nextLine = lines[i]?.trim() || '';
      
      if (nextLine.startsWith('} else if (')) {
        const elseIfMatch = nextLine.match(/^\}\s*else\s+if\s*\((.+)\)\s*\{?$/);
        if (elseIfMatch && elseIfMatch[1]) {
          const elseIfCondition = convertExpression(elseIfMatch[1], true); // Preserve case for conditions
          result.push(`${indentStr}ELSEIF ${elseIfCondition} THEN`);
          i++;
          i = parseBlock(lines, i, currentIndent + 1, result);
        } else {
          break;
        }
      } else if (nextLine.startsWith('} else {') || nextLine === '} else') {
        result.push(`${indentStr}ELSE`);
        i++;
        // Skip the opening brace if it's on the next line
        if (i < lines.length && lines[i]?.trim() === '{') {
          i++;
        }
        i = parseBlock(lines, i, currentIndent + 1, result);
      } else if (nextLine === '}') {
        i++;
        break;
      } else {
        break;
      }
    }

    result.push(`${indentStr}ENDIF`);
    return { lines: result, nextIndex: i };
  }

  // If we couldn't parse the IF statement, advance by 1 to prevent infinite loop
  i++;
  return { lines: result, nextIndex: i };
}

/**
 * Parse WHILE loop
 */
function parseWhileLoop(lines: string[], startIndex: number, currentIndent: number): { lines: string[], nextIndex: number } {
  const result: string[] = [];
  const indentStr = ' '.repeat(currentIndent * 4);
  let i = startIndex;

  const whileLine = lines[i]?.trim() || '';
  const conditionMatch = whileLine.match(/^while \((.+)\)\s*\{?$/);
  if (conditionMatch && conditionMatch[1]) {
    const condition = convertExpression(conditionMatch[1], true); // Preserve case for conditions
    result.push(`${indentStr}WHILE ${condition}`);
    i++;

    // Parse WHILE body
    i = parseBlock(lines, i, currentIndent + 1, result);
    result.push(`${indentStr}ENDWHILE`);
    return { lines: result, nextIndex: i };
  }

  // If we couldn't parse the WHILE loop, advance by 1 to prevent infinite loop
  i++;
  return { lines: result, nextIndex: i };
}

/**
 * Parse FOR loop
 */
function parseForLoop(lines: string[], startIndex: number, currentIndent: number): { lines: string[], nextIndex: number } {
  const result: string[] = [];
  const indentStr = ' '.repeat(currentIndent * 4);
  let i = startIndex;

  const forLine = lines[i]?.trim() || '';
  
  // Enhanced FOR loop (for-each)
  const forEachMatch = forLine.match(/^for \(\s*(\w+)\s+(\w+)\s*:\s*(\w+)\s*\)\s*\{?$/);
  if (forEachMatch && forEachMatch[1] && forEachMatch[2] && forEachMatch[3]) {
    const [, , variable, collection] = forEachMatch;
    result.push(`${indentStr}FOR EACH ${variable} IN ${collection}`);
    i++;
    i = parseBlock(lines, i, currentIndent + 1, result);
    result.push(`${indentStr}NEXT ${variable}`);
    return { lines: result, nextIndex: i };
  }

  // Traditional FOR loop
  const forMatch = forLine.match(/^for \((.+)\)\s*\{?$/);
  if (forMatch && forMatch[1]) {
    const forContent = forMatch[1];
    const parts = forContent.split(';').map(p => p.trim());
    
    if (parts.length === 3) {
      const [init, condition, increment] = parts;
      
      // Parse initialization: int i = 0
      if (init && condition) {
        const initMatch = init.match(/^\w+\s+(\w+)\s*=\s*(\d+)$/);
        if (initMatch && initMatch[1] && initMatch[2]) {
          const [, variable, startValue] = initMatch;
          
          // Parse condition: i < 10 or i <= 10
          const condMatch = condition.match(/^(\w+)\s*([<>]=?)\s*(\d+)$/);
          if (condMatch && condMatch[1] && condMatch[2] && condMatch[3]) {
            const [, , operator, endValue] = condMatch;
            
            // Calculate end value based on operator
            let actualEndValue = parseInt(endValue);
            if (operator === '<') {
              actualEndValue -= 1;
            }
            
            // Parse increment: i++ or i += step
            let step = 1;
            if (increment) {
              const stepMatch = increment.match(/^\w+\s*\+=\s*(\d+)$/);
              if (stepMatch && stepMatch[1]) {
                step = parseInt(stepMatch[1]);
              }
            }
            
            let forStatement = `${indentStr}FOR ${variable} ← ${startValue} TO ${actualEndValue}`;
            if (step !== 1) {
              forStatement += ` STEP ${step}`;
            }
            result.push(forStatement);
            
            i++;
            i = parseBlock(lines, i, currentIndent + 1, result);
            result.push(`${indentStr}NEXT ${variable}`);
            return { lines: result, nextIndex: i };
          }
        }
      }
    }
  }

  // If we couldn't parse the FOR loop, advance by 1 to prevent infinite loop
  i++;
  return { lines: result, nextIndex: i };
}

/**
 * Parse DO-WHILE loop
 */
function parseDoWhileLoop(lines: string[], startIndex: number, currentIndent: number): { lines: string[], nextIndex: number } {
  const result: string[] = [];
  const indentStr = ' '.repeat(currentIndent * 4);
  let i = startIndex;

  result.push(`${indentStr}REPEAT`);
  i++; // Skip 'do {'

  // Parse body
  i = parseBlock(lines, i, currentIndent + 1, result);

  // Parse while condition
  if (i < lines.length) {
    const whileLine = lines[i]?.trim() || '';
    const whileMatch = whileLine.match(/^\}\s*while\s*\((.+)\);?$/);
    if (whileMatch && whileMatch[1]) {
      const condition = convertExpression(whileMatch[1], true); // Preserve case for conditions
      result.push(`${indentStr}UNTIL NOT (${condition})`);
      i++;
      return { lines: result, nextIndex: i };
    }
  }

  // If we couldn't parse the DO-WHILE loop properly, advance by 1 to prevent infinite loop
  i++;
  return { lines: result, nextIndex: i };
}

/**
 * Parse method definition
 */
function parseMethodDefinition(lines: string[], startIndex: number, currentIndent: number): { lines: string[], nextIndex: number } {
  const result: string[] = [];
  const indentStr = ' '.repeat(currentIndent * 4);
  let i = startIndex;

  const methodLine = lines[i]?.trim() || '';
  
  // Parse method signature (including constructors)
  let methodMatch = methodLine.match(/^(public|private|protected)\s+(static\s+)?(void|int|String|boolean|double|float|\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{?$/);
  let isConstructor = false;
  let returnType = '';
  let methodName = '';
  let params = '';
  
  if (methodMatch && methodMatch[3] && methodMatch[4]) {
    // Regular method
    returnType = methodMatch[3];
    methodName = methodMatch[4];
    params = methodMatch[5] || '';
  } else {
    // Try constructor pattern (no return type)
    const constructorMatch = methodLine.match(/^(public|private|protected)\s+(\w+)\s*\(([^)]*)\)\s*\{?$/);
    if (constructorMatch && constructorMatch[2]) {
      isConstructor = true;
      returnType = 'void'; // Constructors are treated as procedures
      methodName = constructorMatch[2];
      params = constructorMatch[3] || '';
    }
  }
  
  if (methodName) {
    // Parse parameters
    const paramList = params && params.trim() ? params.split(',').map(p => {
      const paramMatch = p.trim().match(/^(\w+(?:\[\])?)\s+(\w+)$/);
      return paramMatch && paramMatch[2] ? paramMatch[2] : p.trim();
    }).join(', ') : '';
    
    // Determine if it's a procedure or function
    const isVoid = returnType === 'void' || isConstructor;
    const keyword = isVoid ? 'PROCEDURE' : 'FUNCTION';
    const endKeyword = isVoid ? 'ENDPROCEDURE' : 'ENDFUNCTION';
    
    result.push(`${indentStr}${keyword} ${methodName}(${paramList})`);
    
    // Check if opening brace is on the same line as method signature
    let braceCount = 0;
    if (methodLine.includes('{')) {
      braceCount = 1;
      i++; // Move to next line
    } else {
      // Skip to opening brace if not on same line
      i++;
      while (i < lines.length && !lines[i]?.includes('{')) {
        i++;
      }
      if (i < lines.length && lines[i]?.includes('{')) {
        braceCount = 1;
        i++; // Skip opening brace line
      }
    }
    
    // Parse method body
    if (braceCount > 0) {
      
      while (i < lines.length && braceCount > 0) {
        const line = lines[i]?.trim() || '';
        
        if (!line) {
          i++;
          continue;
        }
        
        // Count braces
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;
        
        // If we hit the closing brace, stop
        if (braceCount === 0) {
          break;
        }
        
        // Skip lines that are just braces
        if (line === '{' || line === '}') {
          i++;
          continue;
        }
        
        // Parse nested control structures
        const parseResult = parseControlStructure(lines, i, currentIndent + 1);
        if (parseResult) {
          result.push(...parseResult.lines);
          i = parseResult.nextIndex;
          continue;
        }
        
        // Convert regular line
        const converted = convertLine(line, true); // Pass inMethod=true
        if (converted && converted.trim()) {
          const indent = ' '.repeat((currentIndent + 1) * 4);
          result.push(indent + converted.trim());
        }
        i++;
      }
    }
    
    result.push(`${indentStr}${endKeyword}`);
  }

  return { lines: result, nextIndex: i + 1 };
}

/**
 * Parse block of code within braces
 */
function parseBlock(lines: string[], startIndex: number, indentLevel: number, result: string[]): number {
  let i = startIndex;
  let braceCount = 0;
  let foundOpenBrace = false;
  let iterationCount = 0;
  const maxIterations = lines.length * 2; // Safety limit

  while (i < lines.length && iterationCount < maxIterations) {
    iterationCount++;
    const line = lines[i]?.trim() || '';
    
    if (!line) {
      i++;
      continue;
    }

    // Count braces
    if (line.includes('{')) {
      braceCount += (line.match(/\{/g) || []).length;
      foundOpenBrace = true;
    }
    if (line.includes('}')) {
      braceCount -= (line.match(/\}/g) || []).length;
    }

    // If we found closing brace and count is 0, we're done with this block
    // But don't break if it's an else clause
    if (foundOpenBrace && braceCount <= 0 && line.includes('}')) {
      if (line.includes('else')) {
        // Don't increment i here, let the parent handle the else clause
        return i;
      } else {
        return i + 1;
      }
    }

    // Skip lines that are just braces
    if (line === '{' || line === '}') {
      i++;
      continue;
    }

    // Parse nested control structures
    const parseResult = parseControlStructure(lines, i, indentLevel);
    if (parseResult) {
      // Safety check: ensure we're making progress
      if (parseResult.nextIndex <= i) {
        console.warn(`Warning: parseControlStructure not advancing at line ${i}: "${line}"`);
        i++; // Force advancement to prevent infinite loop
      } else {
        result.push(...parseResult.lines);
        i = parseResult.nextIndex;
      }
      continue;
    }

    // Convert regular line
    const converted = convertLine(line);
    if (converted && converted.trim()) {
      const indent = ' '.repeat(indentLevel * 4);
      result.push(indent + converted.trim());
    }
    i++;
  }

  if (iterationCount >= maxIterations) {
    console.error(`Error: parseBlock exceeded maximum iterations at startIndex ${startIndex}`);
  }

  return i;
}

/**
 * Convert a single line of Java code to IB Pseudocode
 */
function convertLine(line: string, inMethod: boolean = false): string {
  // Don't process comment lines
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.includes('*/') || trimmed === '') {
    return line;
  }

  // Remove semicolon at the end
  line = line.replace(/;$/, '');

  // Scanner input (check before variable declarations)
  if (line.match(/^(int|String|boolean|double|float)\s+\w+\s*=\s*scanner\.(next\w+)\(\)/)) {
    return convertInput(line);
  }

  // Variable declarations with assignment
  if (line.match(/^(int|String|boolean|double|float)\s+\w+\s*=\s*.+/)) {
    return convertVariableDeclaration(line);
  }

  // Compound assignment (x += 5)
  if (line.match(/^[\w.]+\s*[+\-*/%]=\s*.+/)) {
    return convertCompoundAssignment(line);
  }

  // Increment/Decrement (x++, x--)
  if (line.match(/^[\w.]+\+\+$/) || line.match(/^[\w.]+--$/)) {
    return convertIncrementDecrement(line);
  }

  // Simple assignment (x = value)
  if (line.match(/^[\w.]+\s*=\s*.+/)) {
    return convertAssignment(line);
  }

  // Return statements
  if (line.startsWith('return ')) {
    return convertReturnStatement(line);
  }

  // System.out.println/print
  if (line.includes('System.out.println') || line.includes('System.out.print')) {
    return convertOutput(line, inMethod);
  }

  // Method calls (including static method calls like Math.max)
  if (line.match(/^\w+\s*\([^)]*\)$/) || line.match(/^\w+\.\w+\s*\([^)]*\)$/)) {
    return convertMethodCall(line);
  }

  // Method calls in assignment
  if (line.match(/^\w+\s*=\s*\w+\s*\([^)]*\)$/) || line.match(/^\w+\s*=\s*\w+\.\w+\s*\([^)]*\)$/)) {
    return convertMethodCallAssignment(line);
  }

  // Handle expressions (logical operators, comparisons, arithmetic, etc.)
  if (line.match(/&&|\|\||!|==|!=|<=|>=|<|>|\+|\-|\*|\/|\(|\)|\b[a-z][a-zA-Z0-9_]*\b/)) {
    return convertExpression(line, inMethod);
  }

  return line;
}

/**
 * Convert variable declaration: int x = 5 -> x ← 5
 */
function convertVariableDeclaration(line: string): string {
  const match = line.match(/^(int|String|boolean|double|float)\s+(\w+)\s*=\s*(.+)/);
  if (match && match[2] && match[3]) {
    const [, , varName, value] = match;
    const convertedValue = convertExpression(value, false); // Convert variables to uppercase
    return `${varName.toUpperCase()} ← ${convertedValue}`;
  }
  return line;
}

/**
 * Convert simple assignment: x = value -> x ← value
 */
function convertAssignment(line: string): string {
  const match = line.match(/^([\w.]+)\s*=\s*(.+)/);
  if (match && match[1] && match[2]) {
    const [, varName, value] = match;
    const convertedValue = convertExpression(value, false); // Convert variables to uppercase
    return `${varName.toUpperCase()} ← ${convertedValue}`;
  }
  return line;
}

/**
 * Convert compound assignment: x += 5 -> x ← x + 5
 */
function convertCompoundAssignment(line: string): string {
  const match = line.match(/^([\w.]+)\s*([+\-*/%])=\s*(.+)/);
  if (match && match[1] && match[2] && match[3]) {
    const [, varName, operator, value] = match;
    const convertedValue = convertExpression(value, false); // Convert variables to uppercase
    const upperVarName = varName.toUpperCase();
    return `${upperVarName} ← ${upperVarName} ${operator} ${convertedValue}`;
  }
  return line;
}

/**
 * Convert increment/decrement: x++ -> x ← x + 1
 */
function convertIncrementDecrement(line: string): string {
  const incrementMatch = line.match(/^([\w.]+)\+\+$/);
  if (incrementMatch && incrementMatch[1]) {
    const varName = incrementMatch[1].toUpperCase();
    return `${varName} ← ${varName} + 1`;
  }

  const decrementMatch = line.match(/^([\w.]+)--$/);
  if (decrementMatch && decrementMatch[1]) {
    const varName = decrementMatch[1].toUpperCase();
    return `${varName} ← ${varName} - 1`;
  }

  return line;
}

/**
 * Convert output statements: System.out.println("Hello") -> OUTPUT "Hello"
 */
function convertOutput(line: string, inMethod: boolean = false): string {
  const match = line.match(/System\.out\.(println|print)\((.+)\)/);
  if (match && match[2]) {
    const [, , content] = match;
    const convertedContent = convertExpression(content, inMethod);
    return `output ${convertedContent}`;
  }
  return line;
}

/**
 * Convert input statements: int x = scanner.nextInt() -> input X
 */
function convertInput(line: string): string {
  const match = line.match(/^(int|String|boolean|double|float)\s+(\w+)\s*=\s*scanner\.(next\w+)\(\)/);
  if (match && match[2]) {
    const [, , varName] = match;
    return `input ${varName.toUpperCase()}`;
  }
  return line;
}

/**
 * Convert expressions (variables, operators, etc.)
 */
function convertExpression(expr: string, preserveCase: boolean = false): string {
  // Convert comparison operators first (to avoid conflicts with ! operator)
  expr = expr.replace(/!=/g, ' ≠ ');
  expr = expr.replace(/==/g, ' = ');
  expr = expr.replace(/<=/g, ' ≤ ');
  expr = expr.replace(/>=/g, ' >= '); // Keep >= as is per test expectation
  
  // Convert boolean operators
  expr = expr.replace(/&&/g, ' AND ');
  expr = expr.replace(/\|\|/g, ' OR ');
  expr = expr.replace(/!/g, 'NOT ');
  
  // Clean up multiple spaces
  expr = expr.replace(/\s+/g, ' ').trim();
  
  // Convert variable names to uppercase (but preserve strings, comments, and keywords) unless preserveCase is true
  if (!preserveCase) {
    expr = expr.replace(/\b[a-z][a-zA-Z0-9_]*\b/g, (match, offset) => {
      // Don't convert if it's inside quotes or is a keyword
      if (match === 'true' || match === 'false' || match === 'null') {
        return match;
      }
      
      // Don't convert if it's inside a string literal
      const beforeMatch = expr.substring(0, offset);
      const quoteCount = (beforeMatch.match(/"/g) || []).length;
      if (quoteCount % 2 === 1) {
        return match; // Inside a string
      }
      
      // Don't convert if it's inside a comment
      if (beforeMatch.includes('//') || beforeMatch.includes('/*')) {
        return match; // Inside a comment
      }
      
      // Don't convert if it's part of a method call (preceded by . or followed by .)
      const afterMatch = expr.substring(offset + match.length);
      if (beforeMatch.endsWith('.') || afterMatch.startsWith('.')) {
        return match; // Part of method call like Math.max or obj.method
      }
      
      return match.toUpperCase();
    });
  }
  
  return expr;
}

/**
 * Convert return statement: return x -> RETURN x
 */
function convertReturnStatement(line: string): string {
  const match = line.match(/^return\s+(.+)$/);
  if (match && match[1]) {
    const expr = convertExpression(match[1], true); // Preserve case for return statements
    return `RETURN ${expr}`;
  }
  return line;
}

/**
 * Convert method call: methodName(args) -> methodName(args)
 */
function convertMethodCall(line: string): string {
  // For void method calls, keep as is
  return line;
}

/**
 * Convert method call assignment: x = methodName(args) -> x ← methodName(args)
 */
function convertMethodCallAssignment(line: string): string {
  const match = line.match(/^(\w+)\s*=\s*(.+)$/);
  if (match && match[1] && match[2]) {
    return `${match[1]} ← ${match[2]}`;
  }
  return line;
}

/**
 * Parse Java code and return intermediate representation with diagnostics
 * @param javaCode - The Java source code
 * @param options - Parsing options
 * @returns Parse result with IR and diagnostics
 */
export function parseJavaCode(javaCode: string, options?: ConversionOptions) {
  const config = mergeConfig(options);
  const parser = new Parser(config.parserOptions);
  return parser.parse(javaCode);
}

/**
 * Emit intermediate representation to IB pseudocode
 * @param ir - The intermediate representation
 * @param options - Emission options
 * @returns Emission result with code and diagnostics
 */
export function emitPseudocode(ir: any, options?: ConversionOptions) {
  const config = mergeConfig(options);
  const emitter = new Emitter(config.emitterOptions);
  return emitter.emit(ir);
}

/**
 * Validate conversion options
 * @param options - Options to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateOptions(options: ConversionOptions): string[] {
  return ConfigValidator.validate(options);
}

// Re-export types for external use
export * from './types';
export { Parser } from './parser';
export { Emitter } from './emitter';
export { convertLine, convertExpression };