/**
 * Java to IB Pseudocode Converter
 * Main entry point for the conversion library
 */

export interface ConversionOptions {
  // Basic conversion options only
}

/**
 * Convert Java code to IB Pseudocode
 * @param javaCode - The Java source code to convert
 * @param options - Conversion options
 * @returns The converted IB Pseudocode
 */
export function convertJavaToIB(javaCode: string, options: ConversionOptions = {}): string {

  // Remove leading/trailing whitespace and normalize line endings
  const normalizedCode = javaCode.trim().replace(/\r\n/g, '\n');
  
  if (!normalizedCode) {
    return '';
  }

  // Parse and convert the code structure
  return parseAndConvert(normalizedCode, options);
}

/**
 * Parse and convert Java code with proper structure handling
 */
function parseAndConvert(code: string, options: ConversionOptions): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let i = 0;
  let indentLevel = 0;
  let inMultiLineComment = false;

  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Handle multi-line comments
    if (line.includes('/*')) {
      inMultiLineComment = true;
    }
    if (line.includes('*/')) {
      inMultiLineComment = false;
    }

    // Preserve comments
    if (options.preserveComments && (line.startsWith('//') || line.startsWith('/*') || inMultiLineComment || line.includes('*/'))) {
      result.push(lines[i]); // Keep original spacing
      i++;
      continue;
    }

    // Parse control structures
    const parseResult = parseControlStructure(lines, i, indentLevel);
    if (parseResult) {
      result.push(...parseResult.lines);
      i = parseResult.nextIndex;
      continue;
    }

    // Convert single line
    const converted = convertLine(line);
    if (converted && converted.trim()) {
      const indent = ' '.repeat(indentLevel * 4);
      result.push(indent + converted.trim());
    }
    i++;
  }

  return result.join('\n');
}

/**
 * Parse control structures (IF, WHILE, FOR, etc.)
 */
function parseControlStructure(lines: string[], startIndex: number, currentIndent: number): { lines: string[], nextIndex: number } | null {
  const line = lines[startIndex].trim();
  const indentStr = ' '.repeat(currentIndent * 4);
  const innerIndentStr = ' '.repeat((currentIndent + 1) * 4);

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
  const innerIndentStr = ' '.repeat((currentIndent + 1) * 4);
  let i = startIndex;

  // Parse IF condition
  const ifLine = lines[i].trim();
  const conditionMatch = ifLine.match(/^if \((.+)\)\s*\{?$/);
  if (conditionMatch) {
    const condition = convertExpression(conditionMatch[1]);
    result.push(`${indentStr}IF ${condition} THEN`);
    i++;

    // Parse IF body
    i = parseBlock(lines, i, currentIndent + 1, result);

    // Parse ELSE IF and ELSE
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      
      if (nextLine.startsWith('} else if (')) {
        const elseIfMatch = nextLine.match(/^\}\s*else\s+if\s*\((.+)\)\s*\{?$/);
        if (elseIfMatch) {
          const elseIfCondition = convertExpression(elseIfMatch[1]);
          result.push(`${indentStr}ELSEIF ${elseIfCondition} THEN`);
          i++;
          i = parseBlock(lines, i, currentIndent + 1, result);
        }
      } else if (nextLine.startsWith('} else {') || nextLine === '} else') {
        result.push(`${indentStr}ELSE`);
        i++;
        // Skip the opening brace if it's on the next line
        if (i < lines.length && lines[i].trim() === '{') {
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
  }

  return { lines: result, nextIndex: i };
}

/**
 * Parse WHILE loop
 */
function parseWhileLoop(lines: string[], startIndex: number, currentIndent: number): { lines: string[], nextIndex: number } {
  const result: string[] = [];
  const indentStr = ' '.repeat(currentIndent * 4);
  let i = startIndex;

  const whileLine = lines[i].trim();
  const conditionMatch = whileLine.match(/^while \((.+)\)\s*\{?$/);
  if (conditionMatch) {
    const condition = convertExpression(conditionMatch[1]);
    result.push(`${indentStr}WHILE ${condition}`);
    i++;

    // Parse WHILE body
    i = parseBlock(lines, i, currentIndent + 1, result);
    result.push(`${indentStr}ENDWHILE`);
  }

  return { lines: result, nextIndex: i };
}

/**
 * Parse FOR loop
 */
function parseForLoop(lines: string[], startIndex: number, currentIndent: number): { lines: string[], nextIndex: number } {
  const result: string[] = [];
  const indentStr = ' '.repeat(currentIndent * 4);
  let i = startIndex;

  const forLine = lines[i].trim();
  
  // Enhanced FOR loop (for-each)
  const forEachMatch = forLine.match(/^for \(\s*(\w+)\s+(\w+)\s*:\s*(\w+)\s*\)\s*\{?$/);
  if (forEachMatch) {
    const [, type, variable, collection] = forEachMatch;
    result.push(`${indentStr}FOR EACH ${variable} IN ${collection}`);
    i++;
    i = parseBlock(lines, i, currentIndent + 1, result);
    result.push(`${indentStr}NEXT ${variable}`);
    return { lines: result, nextIndex: i };
  }

  // Traditional FOR loop
  const forMatch = forLine.match(/^for \((.+)\)\s*\{?$/);
  if (forMatch) {
    const forContent = forMatch[1];
    const parts = forContent.split(';').map(p => p.trim());
    
    if (parts.length === 3) {
      const [init, condition, increment] = parts;
      
      // Parse initialization: int i = 0
      const initMatch = init.match(/^\w+\s+(\w+)\s*=\s*(\d+)$/);
      if (initMatch) {
        const [, variable, startValue] = initMatch;
        
        // Parse condition: i < 10 or i <= 10
        const condMatch = condition.match(/^(\w+)\s*([<>]=?)\s*(\d+)$/);
        if (condMatch) {
          const [, condVar, operator, endValue] = condMatch;
          
          // Calculate end value based on operator
          let actualEndValue = parseInt(endValue);
          if (operator === '<') {
            actualEndValue -= 1;
          }
          
          // Parse increment: i++ or i += step
          let step = 1;
          const stepMatch = increment.match(/^\w+\s*\+=\s*(\d+)$/);
          if (stepMatch) {
            step = parseInt(stepMatch[1]);
          }
          
          let forStatement = `${indentStr}FOR ${variable} ← ${startValue} TO ${actualEndValue}`;
          if (step !== 1) {
            forStatement += ` STEP ${step}`;
          }
          result.push(forStatement);
          
          i++;
          i = parseBlock(lines, i, currentIndent + 1, result);
          result.push(`${indentStr}NEXT ${variable}`);
        }
      }
    }
  }

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
    const whileLine = lines[i].trim();
    const whileMatch = whileLine.match(/^\}\s*while\s*\((.+)\);?$/);
    if (whileMatch) {
      const condition = convertExpression(whileMatch[1]);
      result.push(`${indentStr}UNTIL NOT (${condition})`);
      i++;
    }
  }

  return { lines: result, nextIndex: i };
}

/**
 * Parse a block of code (between braces)
 */
function parseBlock(lines: string[], startIndex: number, indentLevel: number, result: string[]): number {
  let i = startIndex;
  let braceCount = 0;
  let foundOpenBrace = false;

  while (i < lines.length) {
    const line = lines[i].trim();
    
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
        break;
      } else {
        break;
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
      result.push(...parseResult.lines);
      i = parseResult.nextIndex;
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

  return i;
}

/**
 * Convert a single line of Java code to IB Pseudocode
 */
function convertLine(line: string): string {
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
  if (line.match(/^\w+\s*[+\-*/%]=\s*.+/)) {
    return convertCompoundAssignment(line);
  }

  // Increment/Decrement (x++, x--)
  if (line.match(/^\w+\+\+$/) || line.match(/^\w+--$/)) {
    return convertIncrementDecrement(line);
  }

  // Simple assignment (x = value)
  if (line.match(/^\w+\s*=\s*.+/)) {
    return convertAssignment(line);
  }

  // System.out.println/print
  if (line.includes('System.out.println') || line.includes('System.out.print')) {
    return convertOutput(line);
  }

  return line;
}

/**
 * Convert variable declaration: int x = 5 -> x ← 5
 */
function convertVariableDeclaration(line: string): string {
  const match = line.match(/^(int|String|boolean|double|float)\s+(\w+)\s*=\s*(.+)/);
  if (match) {
    const [, , varName, value] = match;
    if (varName && value) {
      const convertedValue = convertExpression(value);
      return `${varName} ← ${convertedValue}`;
    }
  }
  return line;
}

/**
 * Convert simple assignment: x = value -> x ← value
 */
function convertAssignment(line: string): string {
  const match = line.match(/^(\w+)\s*=\s*(.+)/);
  if (match) {
    const [, varName, value] = match;
    if (varName && value) {
      const convertedValue = convertExpression(value);
      return `${varName} ← ${convertedValue}`;
    }
  }
  return line;
}

/**
 * Convert compound assignment: x += 5 -> x ← x + 5
 */
function convertCompoundAssignment(line: string): string {
  const match = line.match(/^(\w+)\s*([+\-*/%])=\s*(.+)/);
  if (match) {
    const [, varName, operator, value] = match;
    if (varName && operator && value) {
      const convertedValue = convertExpression(value);
      return `${varName} ← ${varName} ${operator} ${convertedValue}`;
    }
  }
  return line;
}

/**
 * Convert increment/decrement: x++ -> x ← x + 1
 */
function convertIncrementDecrement(line: string): string {
  const incrementMatch = line.match(/^(\w+)\+\+$/);
  if (incrementMatch) {
    const varName = incrementMatch[1];
    if (varName) {
      return `${varName} ← ${varName} + 1`;
    }
  }

  const decrementMatch = line.match(/^(\w+)--$/);
  if (decrementMatch) {
    const varName = decrementMatch[1];
    if (varName) {
      return `${varName} ← ${varName} - 1`;
    }
  }

  return line;
}

/**
 * Convert output statements: System.out.println("Hello") -> OUTPUT "Hello"
 */
function convertOutput(line: string): string {
  const match = line.match(/System\.out\.(println|print)\((.+)\)/);
  if (match) {
    const [, , content] = match;
    if (content) {
      const convertedContent = convertExpression(content);
      return `OUTPUT ${convertedContent}`;
    }
  }
  return line;
}

/**
 * Convert input statements: int x = scanner.nextInt() -> INPUT x
 */
function convertInput(line: string): string {
  const match = line.match(/^(int|String|boolean|double|float)\s+(\w+)\s*=\s*scanner\.(next\w+)\(\)/);
  if (match) {
    const [, , varName] = match;
    if (varName) {
      return `INPUT ${varName}`;
    }
  }
  return line;
}

/**
 * Convert expressions (variables, operators, etc.)
 */
function convertExpression(expr: string): string {
  let converted = expr.trim();

  // Convert comparison operators first (before logical operators)
  converted = converted.replace(/!=/g, '≠');
  converted = converted.replace(/==/g, '=');
  converted = converted.replace(/>=/g, '>=');

  // Convert logical operators
  converted = converted.replace(/&&/g, ' AND ');
  converted = converted.replace(/\|\|/g, ' OR ');
  converted = converted.replace(/!/g, 'NOT ');

  // Keep variable names as lowercase (IB pseudocode convention)
  // No need to convert variable names to uppercase

  // Clean up extra spaces
  converted = converted.replace(/\s+/g, ' ').trim();

  return converted;
}

export { convertLine, convertExpression };