# Java to IB Pseudocode Converter

A TypeScript library that converts Java code into IB Computer Science pseudocode format according to the official IB specification.

## Features

- Converts Java syntax to IB pseudocode format
- Handles control structures, variables, methods, and arrays
- Provides detailed error reporting
- TypeScript support with full type definitions
- Educational focus for IB Computer Science curriculum

## Installation

```bash
npm install java-to-ib-pseudocode
```

## Usage

```typescript
import { JavaToIBConverter } from 'java-to-ib-pseudocode';

const converter = new JavaToIBConverter();
const result = converter.convert('int x = 5;');

console.log(result.pseudocode);
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build

# Generate documentation
npm run docs
```

## License

MIT