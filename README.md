# java2ib

A TypeScript library that converts Java code into IB Computer Science pseudocode format according to the official IB specification. This library is designed for educational purposes, enabling teachers and students to automatically convert Java code examples into the standardized pseudocode format used in the IB Computer Science curriculum.

## Features

- **Complete Java Syntax Support**: Variables, control structures, methods, arrays, and object-oriented constructs
- **Advanced Java Constructs**: Switch statements, enhanced for loops, array initialization, break/continue
- **IB Specification Compliance**: Follows official IB pseudocode rules and formatting
- **Intelligent Transformations**: Converts Java naming conventions, operators, and syntax to IB format
- **Performance Optimized**: Efficient processing for large Java files with caching and pooling
- **Comprehensive Error Handling**: Enhanced error messages with context and suggestions
- **TypeScript Support**: Full type definitions for enhanced development experience
- **Educational Focus**: Designed specifically for IB Computer Science curriculum needs

## Installation

```bash
npm install java2ib
```

## Quick Start

```typescript
import { JavaToIBConverter } from 'java2ib';

const converter = new JavaToIBConverter();

// Simple variable conversion
const result = converter.convert('int x = 5;');
console.log(result.pseudocode); // Output: X = 5

// Method conversion
const methodResult = converter.convert(`
public int add(int a, int b) {
    return a + b;
}
`);
console.log(methodResult.pseudocode);
// Output:
// FUNCTION ADD(A, B) RETURNS value
//     return A + B
// end FUNCTION

// Complex program conversion
const complexResult = converter.convert(`
public class Calculator {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50};
        int sum = 0;
        
        for (int num : numbers) {
            sum += num;
        }
        
        switch (sum) {
            case 150:
                System.out.println("Perfect sum!");
                break;
            default:
                System.out.println("Sum is: " + sum);
        }
    }
}
`);

console.log(complexResult.pseudocode);
// Output:
// NUMBERS = [10, 20, 30, 40, 50]
// SUM = 0
// loop NUM in NUMBERS
//     SUM = SUM + NUM
// end loop
// case SUM of
//     150:
//         output "Perfect sum!"
//     default:
//         output "Sum is: " + SUM
// end case
```

## Conversion Examples

### Variables and Assignments

**Java:**
```java
int count = 0;
String name = "Alice";
boolean isValid = true;
```

**IB Pseudocode:**
```
COUNT = 0
NAME = "Alice"
ISVALID = true
```

### Control Structures

**Java:**
```java
if (x > 5) {
    System.out.println("Greater than 5");
} else {
    System.out.println("Less than or equal to 5");
}
```

**IB Pseudocode:**
```
if X > 5 then
    output "Greater than 5"
else
    output "Less than or equal to 5"
end if
```

### Loops

**Java:**
```java
// Traditional for loop
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// Enhanced for loop (for-each)
for (String name : names) {
    System.out.println(name);
}

// While loop
while (count < 100) {
    count++;
}
```

**IB Pseudocode:**
```
loop I from 0 to 9
    output I
end loop

loop NAME in NAMES
    output NAME
end loop

loop while COUNT < 100
    COUNT = COUNT + 1
end loop
```

### Methods and Functions

**Java:**
```java
public void greet(String name) {
    System.out.println("Hello " + name);
}

public int multiply(int a, int b) {
    return a * b;
}
```

**IB Pseudocode:**
```
PROCEDURE greet(NAME)
    output "Hello " + NAME
end PROCEDURE

FUNCTION multiply(A, B) RETURNS value
    return A * B
end FUNCTION
```

### Arrays

**Java:**
```java
// Array declaration and initialization
int[] numbers = new int[10];
int[] values = {1, 2, 3, 4, 5};
String[] colors = {"red", "green", "blue"};

// Array access and operations
numbers[0] = 42;
int length = numbers.length;
```

**IB Pseudocode:**
```
NUMBERS = new array[10]
VALUES = [1, 2, 3, 4, 5]
COLORS = ["red", "green", "blue"]

NUMBERS[0] = 42
LENGTH = SIZE(NUMBERS)
```

### Switch Statements

**Java:**
```java
switch (grade) {
    case 'A':
        System.out.println("Excellent");
        break;
    case 'B':
        System.out.println("Good");
        break;
    default:
        System.out.println("Try harder");
}
```

**IB Pseudocode:**
```
case GRADE of
    'A':
        output "Excellent"
    'B':
        output "Good"
    default:
        output "Try harder"
end case
```

### Break and Continue Statements

**Java:**
```java
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;
    }
    if (i % 2 == 0) {
        continue;
    }
    System.out.println(i);
}
```

**IB Pseudocode:**
```
loop I from 0 to 9
    if I = 5 then
        // break statement (exit loop)
    end if
    if I mod 2 = 0 then
        // continue statement (skip to next iteration)
    end if
    output I
end loop
```

## API Reference

### JavaToIBConverter

The main converter class that handles Java to IB pseudocode conversion.

#### Constructor

```typescript
const converter = new JavaToIBConverter();
```

#### Methods

##### convert(javaCode: string, options?: ConversionOptions): ConversionResult

Converts Java source code to IB pseudocode format.

**Parameters:**
- `javaCode` (string): The Java source code to convert
- `options` (ConversionOptions, optional): Conversion configuration options

**Returns:** `ConversionResult` - The conversion result with pseudocode and metadata

### ConversionOptions

Configuration options for the conversion process.

```typescript
interface ConversionOptions {
  preserveComments?: boolean;  // Whether to preserve comments (default: true)
  strictMode?: boolean;        // Enable strict conversion mode (default: false)
  indentSize?: number;         // Number of spaces for indentation (default: 4)
}
```

### ConversionResult

The result of a conversion operation.

```typescript
interface ConversionResult {
  pseudocode: string;           // The converted pseudocode
  success: boolean;             // Whether conversion was successful
  errors: ConversionError[];    // Any errors encountered
  warnings: ConversionWarning[]; // Any warnings generated
  metadata: ConversionMetadata; // Conversion metadata
}
```

### Error Handling

The library provides comprehensive error reporting with detailed messages and location information.

```typescript
// Example error handling
const result = converter.convert(javaCode);

if (!result.success) {
  result.errors.forEach(error => {
    console.error(`${error.type} at line ${error.location.line}: ${error.message}`);
  });
}

// Handle warnings
result.warnings.forEach(warning => {
  console.warn(`Warning: ${warning.message}`);
});
```

## Conversion Rules

The library follows the official IB Computer Science pseudocode specification:

### Variable Names
- Java camelCase → IB UPPERCASE
- `userName` → `USERNAME`
- `itemCount` → `ITEMCOUNT`

### Operators
- `==` → `=`
- `!=` → `≠`
- `&&` → `AND`
- `||` → `OR`
- `!` → `NOT`
- `%` → `mod`

### Control Structures
- `if-else` → `if...then...else...end if`
- `while` → `loop while...end loop`
- `for` → `loop I from X to Y...end loop`
- `for-each` → `loop ITEM in COLLECTION...end loop`
- `switch-case` → `case VARIABLE of...end case`
- `break/continue` → Comments indicating control flow

### Methods
- `void` methods → `PROCEDURE...end PROCEDURE`
- Non-void methods → `FUNCTION...RETURNS value...end FUNCTION`

### Input/Output
- `System.out.println()` → `output`
- `System.out.print()` → `output`
- `Scanner.nextInt()` → `INPUT`
- `Scanner.nextLine()` → `INPUT`
- `Scanner.nextDouble()` → `INPUT`

### Arrays and Collections
- `array.length` → `SIZE(ARRAY)`
- `{1, 2, 3}` → `[1, 2, 3]`
- `new int[size]` → `new array[SIZE]`

For complete conversion rules, see the [IB Rules Documentation](docs/ib-rules.md).

## Educational Use Cases

This library is particularly useful for:

- **Teachers**: Convert Java examples to IB pseudocode for curriculum materials
- **Students**: Understand the relationship between Java and IB pseudocode
- **Curriculum Development**: Create consistent pseudocode examples from Java code
- **Assessment Preparation**: Practice converting between Java and pseudocode formats

## Advanced Usage

### Batch Conversion

```typescript
const converter = new JavaToIBConverter();
const javaFiles = ['example1.java', 'example2.java'];

javaFiles.forEach(file => {
  const javaCode = fs.readFileSync(file, 'utf8');
  const result = converter.convert(javaCode);
  
  if (result.success) {
    fs.writeFileSync(file.replace('.java', '.pseudo'), result.pseudocode);
  }
});
```

### Custom Options

```typescript
const options: ConversionOptions = {
  preserveComments: true,
  strictMode: false,
  indentSize: 2
};

const result = converter.convert(javaCode, options);
```

### Performance Monitoring

The library provides detailed performance metrics for optimization:

```typescript
const result = converter.convert(javaCode);

console.log('Processing time:', result.metadata.processingTime, 'ms');
console.log('Performance breakdown:', result.metadata.performanceBreakdown);
console.log('Statistics:', result.metadata.statistics);

// Example output:
// Processing time: 15.2 ms
// Performance breakdown: {
//   lexingTime: 3.1,
//   parsingTime: 5.8,
//   transformationTime: 4.2,
//   codeGenerationTime: 2.1
// }
// Statistics: {
//   tokenCount: 156,
//   astNodeCount: 89,
//   inputSize: 1024,
//   outputSize: 892
// }
```

### Large File Handling

The library is optimized for large Java files with built-in performance enhancements:

- **Lexer Pooling**: Reuses lexer instances to reduce object creation overhead
- **Generator Caching**: Caches pseudocode generators for repeated conversions
- **Memory Management**: Efficient memory usage with size limits and cleanup
- **Early Exit**: Handles files larger than 1MB with appropriate error messages

```typescript
// The converter automatically handles large files efficiently
const largeJavaCode = fs.readFileSync('large-program.java', 'utf8');
const result = converter.convert(largeJavaCode);

if (result.success) {
  console.log(`Converted ${result.metadata.originalLines} lines in ${result.metadata.processingTime}ms`);
}
```

## Development

### Setup

```bash
# Clone the repository
git java2ib

# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build

# Generate documentation
npm run docs
```

### Testing

The library includes comprehensive test suites:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Supported Java Features

### ✅ Fully Supported
- **Variables**: All primitive types, arrays, strings
- **Control Structures**: if/else, while, for, enhanced for, switch/case
- **Methods**: Functions, procedures, parameters, return values
- **Arrays**: Declaration, initialization, access, length operations
- **Operators**: Arithmetic, comparison, logical, assignment
- **I/O Operations**: System.out.print/println, Scanner input methods
- **Object-Oriented**: Classes, methods, fields, inheritance basics
- **Advanced Constructs**: Break/continue, array initialization, nested structures

### ⚠️ Partially Supported
- **Complex OOP**: Advanced inheritance patterns may need manual review
- **Exception Handling**: Try-catch blocks are parsed but simplified
- **Generics**: Type parameters are simplified in pseudocode output
- **Lambda Expressions**: Basic lambdas supported, complex ones may need review

### ❌ Not Supported
- **Java 8+ Streams**: Stream API calls are not converted
- **Annotations**: Annotation syntax is ignored
- **Reflection**: Dynamic code execution features
- **External Libraries**: Only standard Java and Scanner are supported

## Limitations

- **File Size**: Maximum input file size is 1MB for performance reasons
- **Memory Usage**: Large files with deeply nested structures may require more memory
- **Custom Classes**: User-defined class types are supported in enhanced for loops
- **Error Recovery**: Parser attempts to recover from syntax errors but may skip sections

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/fairy-pitta/java2ib).

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### Version 1.0.0 (Latest)
- ✅ **New Features**:
  - Switch statement conversion (`switch-case` → `case...of...end case`)
  - Enhanced for loop support (`for (Type item : collection)` → `loop ITEM in COLLECTION`)
  - Array initialization syntax (`{1, 2, 3}` → `[1, 2, 3]`)
  - Break and continue statement handling with explanatory comments
  - Custom class type support in enhanced for loops
- ✅ **Performance Improvements**:
  - Lexer object pooling for better memory efficiency
  - Generator caching system for repeated conversions
  - Optimized line counting and string processing
  - Enhanced error messages with context and suggestions
- ✅ **Quality Improvements**:
  - 308 comprehensive test cases covering all features
  - Detailed performance monitoring and metrics
  - Improved error handling with recovery mechanisms
  - Enhanced TypeScript type definitions

### Version 0.9.0
- Initial release with basic Java to IB pseudocode conversion
- Support for variables, control structures, methods, and arrays
- Basic error handling and TypeScript support

## Acknowledgments

- Based on the official IB Computer Science pseudocode specification
- Designed for educational use in IB Computer Science programs
- Inspired by the need for consistent pseudocode formatting in curriculum materials
- Developed with performance and reliability in mind for classroom use