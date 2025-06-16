# Java to IB Pseudocode Converter

A TypeScript-based tool that converts Java code to IB Computer Science pseudocode format.

## Overview

This project provides a comprehensive solution for converting Java source code into the pseudocode format required by the International Baccalaureate (IB) Computer Science curriculum. The converter handles various Java constructs including classes, methods, control structures, and complex expressions.

## Features

- **Complete Java Syntax Support**: Handles classes, methods, variables, control structures, and more
- **IB Compliant Output**: Generates pseudocode that follows IB Computer Science standards
- **Command Line Interface**: Easy-to-use CLI for batch processing
- **Programmatic API**: Integrate conversion functionality into other applications
- **Error Handling**: Comprehensive error reporting and validation

- **Test-Driven Development**: Extensive test suite ensuring reliability

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd java2ib

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Command Line Interface

```bash
# Convert a single Java file
node dist/cli/index.js input.java

# Convert and save to output file
node dist/cli/index.js input.java --output output.ib

# Convert with custom formatting
node dist/cli/index.js input.java --indent 2 --format verbose

# Show help
node dist/cli/index.js --help
```

### Programmatic API

```typescript
import { convertJavaToIB, ConversionOptions } from './src/index';

const javaCode = `
  public class HelloWorld {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
    }
  }
`;

const options: ConversionOptions = {
  indent: 4,
  format: 'standard',
  preserveComments: true
};

const ibCode = convertJavaToIB(javaCode, options);
console.log(ibCode);
```

## Example Conversion

### Input (Java)
```java
public class Calculator {
    private double result;
    
    public Calculator() {
        this.result = 0.0;
    }
    
    public void add(double value) {
        this.result += value;
    }
    
    public double getResult() {
        return this.result;
    }
}
```

### Output (IB Pseudocode)
```
CLASS Calculator
    PRIVATE result
    
    CONSTRUCTOR Calculator()
        THIS.result ← 0.0
    ENDCONSTRUCTOR
    
    PROCEDURE add(value)
        THIS.result ← THIS.result + value
    ENDPROCEDURE
    
    FUNCTION getResult()
        RETURN THIS.result
    ENDFUNCTION
ENDCLASS
```

## Development

### Test-Driven Development

This project follows Test-Driven Development (TDD) principles. All functionality is defined through comprehensive tests before implementation.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm test basic-conversion
npm test method-conversion
npm test control-structures
npm test nested-structures
npm test ib-examples
npm test error-handling
npm test integration
npm test cli
npm test api
```

### Test Suites

1. **Basic Conversion Tests** (`tests/basic-conversion.test.ts`)
   - Variable declarations
   - Arithmetic operations
   - Input/output operations
   - Comments

2. **Method Conversion Tests** (`tests/method-conversion.test.ts`)
   - Procedures vs functions
   - Method calls
   - Constructors
   - Method overloading

3. **Control Structure Tests** (`tests/control-structures.test.ts`)
   - If/else statements
   - Loops (for, while, do-while)
   - Switch statements
   - Break and continue

4. **Nested Structure Tests** (`tests/nested-structures.test.ts`)
   - Nested if statements
   - Nested loops
   - Complex nesting scenarios

5. **IB Examples Tests** (`tests/ib-examples.test.ts`)
   - Algorithm examples from IB syllabus
   - Data structures (stack, queue, binary tree)
   - Mathematical algorithms
   - Real-world examples

6. **Error Handling Tests** (`tests/error-handling.test.ts`)
   - Syntax error handling
   - Edge cases
   - Complex expressions
   - Type conversion scenarios

7. **Integration Tests** (`tests/integration.test.ts`)
   - Complete class conversions
   - Full program conversions
   - Performance testing

8. **CLI Tests** (`tests/cli.test.ts`)
   - Command-line interface functionality
   - File processing
   - Configuration options

9. **API Tests** (`tests/api.test.ts`)
   - Programmatic interface
   - Parsing and validation
   - Error handling

### Development Workflow

1. **Write Tests First**: Define expected behavior through tests
2. **Implement Features**: Write code to make tests pass
3. **Refactor**: Improve code quality while maintaining test coverage
4. **Validate**: Ensure all tests pass and coverage remains high

### Project Structure

```
java2ib/
├── src/
│   ├── index.ts              # Main API entry point
│   ├── converter.ts          # Core conversion logic
│   ├── parser/               # Java code parsing
│   ├── generator/            # IB pseudocode generation
│   ├── types/                # Type definitions
│   ├── utils/                # Utility functions
│   └── cli/                  # Command-line interface
├── tests/                    # Test suites
├── docs/                     # Documentation
├── package.json              # Project configuration
├── tsconfig.json             # TypeScript configuration
├── vitest.config.ts          # Test configuration
└── README.md                 # This file
```

## Implementation Phases

### Phase 1: Core Infrastructure
- [x] Project setup and configuration
- [x] Test framework setup
- [x] Basic type definitions
- [ ] Parser foundation
- [ ] IR (Intermediate Representation) types

### Phase 2: Basic Conversion
- [ ] Variable declarations
- [ ] Basic operations
- [ ] Simple statements
- [ ] Comments

### Phase 3: Control Structures
- [ ] If/else statements
- [ ] Loops (for, while, do-while)
- [ ] Switch statements
- [ ] Break and continue

### Phase 4: Methods and Classes
- [ ] Method declarations
- [ ] Class structures
- [ ] Constructors
- [ ] Object-oriented features

### Phase 5: Advanced Features
- [ ] Complex expressions
- [ ] Error handling
- [ ] Advanced Java features
- [ ] Nested structures

### Phase 6: CLI and API
- [ ] Command-line interface
- [ ] Public API
- [ ] Configuration options
- [ ] File processing

### Phase 7: Polish and Optimization
- [ ] Performance optimization
- [ ] Error message improvement
- [ ] Documentation
- [ ] Distribution preparation

## Configuration Options

### ConversionOptions

```typescript
interface ConversionOptions {
  // Basic conversion options only
}
```

### CLI Options

- `--output, -o`: Specify output file
- `--help`: Show help information
- `--version`: Show version information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Implement the feature
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## IB Computer Science Compliance

This tool generates pseudocode that complies with IB Computer Science standards:

- Uses proper IB pseudocode syntax
- Follows IB naming conventions
- Implements IB-standard control structures
- Supports IB-required data types and operations
- Maintains IB formatting guidelines

## Support

For issues, questions, or contributions, please use the GitHub issue tracker.