/**
 * IB Rules Engine for converting Java constructs to IB pseudocode format
 */

export interface VariableInfo {
  originalName: string;
  pseudocodeName: string;
  type: string;
  scope: string;
}

export interface MethodInfo {
  originalName: string;
  pseudocodeName: string;
  returnType: string;
  parameters: ParameterInfo[];
  isVoid: boolean;
  isStatic: boolean;
}

export interface ParameterInfo {
  originalName: string;
  pseudocodeName: string;
  type: string;
}

/**
 * Engine that encapsulates IB-specific conversion rules
 */
export class IBRulesEngine {
  /**
   * Convert Java camelCase variable names to UPPERCASE format
   * @param javaName - The Java variable name in camelCase
   * @returns The converted UPPERCASE variable name
   */
  convertVariableName(javaName: string): string {
    // Convert camelCase to UPPERCASE with underscores
    // e.g., "myVariable" -> "MY_VARIABLE"
    // Handle transitions: lowercase to uppercase, number to uppercase
    return javaName
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/([0-9])([A-Z])/g, '$1_$2')
      .toUpperCase();
  }

  /**
   * Convert Java operators to IB pseudocode operators
   * @param javaOperator - The Java operator
   * @returns The equivalent IB pseudocode operator
   */
  convertOperator(javaOperator: string): string {
    const operatorMap: Record<string, string> = {
      // Comparison operators
      '==': '=',
      '!=': '≠',
      '>': '>',
      '<': '<',
      '>=': '>=',
      '<=': '<=',
      
      // Logical operators
      '&&': 'AND',
      '||': 'OR',
      '!': 'NOT',
      
      // Arithmetic operators
      '%': 'mod',
      '/': 'div', // For integer division
      
      // Assignment (stays the same)
      '=': '=',
      
      // Other arithmetic operators (stay the same)
      '+': '+',
      '-': '-',
      '*': '*',
    };

    return operatorMap[javaOperator] || javaOperator;
  }

  /**
   * Convert Java control structure to IB pseudocode format
   * @param type - The type of control structure (if, while, for)
   * @param condition - Optional condition for the control structure
   * @returns The IB pseudocode control structure format
   */
  convertControlStructure(type: string, condition?: string): string {
    switch (type.toLowerCase()) {
      case 'if':
        return condition ? `if ${condition} then` : 'if';
      
      case 'else':
        return 'else';
      
      case 'endif':
        return 'end if';
      
      case 'while':
        return condition ? `loop while ${condition}` : 'loop while';
      
      case 'endwhile':
        return 'end loop';
      
      case 'for':
        // For loops will need special handling based on the loop variable and range
        return 'loop';
      
      case 'endfor':
        return 'end loop';
      
      default:
        return type;
    }
  }

  /**
   * Convert Java method declaration to IB function/procedure format
   * @param method - Method information
   * @returns The IB pseudocode method declaration
   */
  convertMethodDeclaration(method: MethodInfo): string {
    const pseudocodeName = this.convertVariableName(method.originalName);
    const parameters = method.parameters
      .map(param => this.convertVariableName(param.originalName))
      .join(', ');

    if (method.isVoid) {
      // Convert to PROCEDURE format
      return parameters 
        ? `PROCEDURE ${pseudocodeName}(${parameters})`
        : `PROCEDURE ${pseudocodeName}`;
    } else {
      // Convert to FUNCTION format
      return parameters
        ? `FUNCTION ${pseudocodeName}(${parameters})`
        : `FUNCTION ${pseudocodeName}`;
    }
  }

  /**
   * Convert Java data type to IB pseudocode format (or null if type should be omitted)
   * @param javaType - The Java data type
   * @returns The IB pseudocode type or null if type should be omitted
   */
  convertDataType(javaType: string): string | null {
    // In IB pseudocode, explicit type declarations are typically omitted
    // This method returns null to indicate the type should not be included
    // in the pseudocode output
    return null;
  }

  /**
   * Convert Java for loop to IB pseudocode loop format
   * @param variable - Loop variable name
   * @param start - Start value
   * @param end - End value
   * @param step - Step value (optional, defaults to 1)
   * @returns The IB pseudocode for loop format
   */
  convertForLoop(variable: string, start: string, end: string, step?: string): string {
    const pseudocodeVar = this.convertVariableName(variable);
    if (step && step !== '1') {
      return `loop ${pseudocodeVar} from ${start} to ${end} step ${step}`;
    }
    return `loop ${pseudocodeVar} from ${start} to ${end}`;
  }

  /**
   * Convert Java array length access to IB pseudocode format
   * @param arrayName - The array variable name
   * @returns The IB pseudocode array size format
   */
  convertArrayLength(arrayName: string): string {
    const pseudocodeArrayName = this.convertVariableName(arrayName);
    return `SIZE(${pseudocodeArrayName})`;
  }

  /**
   * Convert Java I/O statements to IB pseudocode format
   * @param type - The type of I/O operation (output, input)
   * @param content - The content to output or variable to input
   * @returns The IB pseudocode I/O statement
   */
  convertIOStatement(type: 'output' | 'input', content: string): string {
    if (type === 'output') {
      return `output ${content}`;
    } else {
      const pseudocodeVar = this.convertVariableName(content);
      return `input ${pseudocodeVar}`;
    }
  }
}