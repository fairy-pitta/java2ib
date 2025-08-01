# Java to IB Pseudocode Converter

A TypeScript library that converts Java code into IB Computer Science pseudocode format according to the official IB specification. This library is designed for educational purposes, enabling teachers and students to automatically convert Java code examples into the standardized pseudocode format used in the IB Computer Science curriculum.

## Features

- **Complete Java Syntax Support**: Variables, control structures, methods, arrays, and object-oriented constructs
- **IB Specification Compliance**: Follows official IB pseudocode rules and formatting
- **Intelligent Transformations**: Converts Java naming conventions, operators, and syntax to IB format
- **Comprehensive Error Handling**: Detailed error messages with line numbers for debugging
- **TypeScript Support**: Full type definitions for enhanced development experience
- **Educational Focus**: Designed specifically for IB Computer Science curriculum needs

## Installation

```bash
npm install java-to-ib-pseudocode
```

## Quick Start

```typescript
import { JavaToIBConverter } from 'java-to-ib-pseudocode';

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
// FUNCTION add(A, B) RETURNS value
//     return A + B
// end FUNCTION
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
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

while (count < 100) {
    count++;
}
```

**IB Pseudocode:**
```
loop I from 0 to 9
    output I
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
int[] numbers = new int[10];
numbers[0] = 42;
int length = numbers.length;
```

**IB Pseudocode:**
```
NUMBERS = new array[10]
NUMBERS[0] = 42
LENGTH = SIZE(NUMBERS)
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

### Methods
- `void` methods → `PROCEDURE...end PROCEDURE`
- Non-void methods → `FUNCTION...RETURNS value...end FUNCTION`

### Input/Output
- `System.out.println()` → `output`
- `Scanner.nextInt()` → `INPUT`

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

## Development

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd java-to-ib-pseudocode

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

## Limitations

- **Java Version**: Supports Java 8+ syntax features commonly used in education
- **Complex OOP**: Advanced object-oriented features may require manual review
- **Libraries**: External library calls are not converted (Scanner is supported)
- **Generics**: Generic type parameters are simplified in conversion

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/your-username/java-to-ib-pseudocode).

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the official IB Computer Science pseudocode specification
- Designed for educational use in IB Computer Science programs
- Inspired by the need for consistent pseudocode formatting in curriculum materials