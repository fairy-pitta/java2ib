# Complete Java to IB Pseudocode Examples

This document provides comprehensive, real-world examples of using the Java to IB Pseudocode Converter library. These examples demonstrate practical usage scenarios and show how to handle various conversion situations.

## Table of Contents

1. [Basic Library Usage](#basic-library-usage)
2. [Error Handling](#error-handling)
3. [Configuration Options](#configuration-options)
4. [Educational Examples](#educational-examples)
5. [Batch Processing](#batch-processing)
6. [Integration Examples](#integration-examples)

## Basic Library Usage

### Simple Variable Conversion

```typescript
import { JavaToIBConverter } from 'java-to-ib-pseudocode';

const converter = new JavaToIBConverter();

// Convert simple variable declarations
const javaCode = `
int studentAge = 18;
String studentName = "Alice";
boolean isEnrolled = true;
`;

const result = converter.convert(javaCode);

if (result.success) {
  console.log('Converted pseudocode:');
  console.log(result.pseudocode);
  /*
  Output:
  STUDENTAGE = 18
  STUDENTNAME = "Alice"
  ISENROLLED = true
  */
} else {
  console.error('Conversion failed:', result.errors);
}
```

### Method Conversion

```typescript
const methodCode = `
public int calculateGrade(int totalPoints, int maxPoints) {
    double percentage = (double) totalPoints / maxPoints * 100;
    if (percentage >= 90) {
        return 4;
    } else if (percentage >= 80) {
        return 3;
    } else if (percentage >= 70) {
        return 2;
    } else if (percentage >= 60) {
        return 1;
    } else {
        return 0;
    }
}
`;

const result = converter.convert(methodCode);
console.log(result.pseudocode);
/*
Output:
FUNCTION calculateGrade(TOTALPOINTS, MAXPOINTS) RETURNS value
    PERCENTAGE = TOTALPOINTS / MAXPOINTS * 100
    if PERCENTAGE >= 90 then
        return 4
    else
        if PERCENTAGE >= 80 then
            return 3
        else
            if PERCENTAGE >= 70 then
                return 2
            else
                if PERCENTAGE >= 60 then
                    return 1
                else
                    return 0
                end if
            end if
        end if
    end if
end FUNCTION
*/
```

## Error Handling

### Handling Syntax Errors

```typescript
const invalidJavaCode = `
int x = 5
String name = "Alice" // Missing semicolon
if (x > 3 {  // Missing closing parenthesis
    System.out.println("Greater");
}
`;

const result = converter.convert(invalidJavaCode);

if (!result.success) {
  console.log('Conversion failed with errors:');
  result.errors.forEach((error, index) => {
    console.log(`Error ${index + 1}:`);
    console.log(`  Type: ${error.type}`);
    console.log(`  Message: ${error.message}`);
    console.log(`  Location: Line ${error.location.line}, Column ${error.location.column}`);
    console.log(`  Severity: ${error.severity}`);
  });
}

// Handle warnings
if (result.warnings.length > 0) {
  console.log('Warnings:');
  result.warnings.forEach((warning, index) => {
    console.log(`Warning ${index + 1}: ${warning.message}`);
  });
}
```

### Graceful Error Recovery

```typescript
function convertWithFallback(javaCode: string): string {
  const converter = new JavaToIBConverter();
  const result = converter.convert(javaCode);
  
  if (result.success) {
    return result.pseudocode;
  } else {
    // Log errors for debugging
    console.error('Conversion errors:', result.errors);
    
    // Return a helpful error message
    return `// Conversion failed: ${result.errors[0]?.message || 'Unknown error'}
// Original Java code:
${javaCode.split('\n').map(line => `// ${line}`).join('\n')}`;
  }
}

// Usage
const problematicCode = 'int x = ;'; // Invalid syntax
const output = convertWithFallback(problematicCode);
console.log(output);
```

## Configuration Options

### Using Conversion Options

```typescript
import { JavaToIBConverter, ConversionOptions } from 'java-to-ib-pseudocode';

const converter = new JavaToIBConverter();

// Configure conversion options
const options: ConversionOptions = {
  preserveComments: true,
  strictMode: false,
  indentSize: 2
};

const javaCode = `
// Calculate the factorial of a number
public int factorial(int n) {
    if (n <= 1) {
        return 1; // Base case
    } else {
        return n * factorial(n - 1); // Recursive case
    }
}
`;

const result = converter.convert(javaCode, options);
console.log(result.pseudocode);
/*
Output (with 2-space indentation and preserved comments):
// Calculate the factorial of a number
FUNCTION factorial(N) RETURNS value
  if N <= 1 then
    return 1 // Base case
  else
    return N * factorial(N - 1) // Recursive case
  end if
end FUNCTION
*/
```

### Comparing Different Options

```typescript
const javaCode = `
public void greetUser(String name) {
    // Print greeting message
    System.out.println("Hello, " + name + "!");
}
`;

// Default options
const defaultResult = converter.convert(javaCode);

// Custom options
const customOptions: ConversionOptions = {
  preserveComments: false,
  indentSize: 8
};
const customResult = converter.convert(javaCode, customOptions);

console.log('Default conversion:');
console.log(defaultResult.pseudocode);
console.log('\nCustom conversion (no comments, 8-space indent):');
console.log(customResult.pseudocode);
```

## Educational Examples

### Complete Class Example

```typescript
const classExample = `
public class StudentGradeCalculator {
    private String studentName;
    private int[] scores;
    
    public StudentGradeCalculator(String name, int[] studentScores) {
        this.studentName = name;
        this.scores = studentScores;
    }
    
    public double calculateAverage() {
        int total = 0;
        for (int i = 0; i < scores.length; i++) {
            total += scores[i];
        }
        return (double) total / scores.length;
    }
    
    public char getLetterGrade() {
        double average = calculateAverage();
        if (average >= 90) {
            return 'A';
        } else if (average >= 80) {
            return 'B';
        } else if (average >= 70) {
            return 'C';
        } else if (average >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    }
    
    public void printReport() {
        System.out.println("Student: " + studentName);
        System.out.println("Average: " + calculateAverage());
        System.out.println("Grade: " + getLetterGrade());
    }
}
`;

const result = converter.convert(classExample);
console.log('Converted class to pseudocode:');
console.log(result.pseudocode);
```

### Algorithm Examples

```typescript
// Binary search algorithm
const binarySearchCode = `
public int binarySearch(int[] array, int target) {
    int left = 0;
    int right = array.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (array[mid] == target) {
            return mid;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}
`;

const binarySearchResult = converter.convert(binarySearchCode);
console.log('Binary Search in IB Pseudocode:');
console.log(binarySearchResult.pseudocode);

// Bubble sort algorithm
const bubbleSortCode = `
public void bubbleSort(int[] array) {
    int n = array.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                // Swap elements
                int temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
}
`;

const bubbleSortResult = converter.convert(bubbleSortCode);
console.log('Bubble Sort in IB Pseudocode:');
console.log(bubbleSortResult.pseudocode);
```

## Batch Processing

### Converting Multiple Files

```typescript
import * as fs from 'fs';
import * as path from 'path';

interface ConversionJob {
  inputFile: string;
  outputFile: string;
  javaCode: string;
}

class BatchConverter {
  private converter: JavaToIBConverter;
  
  constructor() {
    this.converter = new JavaToIBConverter();
  }
  
  async convertFiles(inputDirectory: string, outputDirectory: string): Promise<void> {
    // Ensure output directory exists
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }
    
    // Find all Java files
    const javaFiles = fs.readdirSync(inputDirectory)
      .filter(file => file.endsWith('.java'))
      .map(file => path.join(inputDirectory, file));
    
    const jobs: ConversionJob[] = javaFiles.map(inputFile => ({
      inputFile,
      outputFile: path.join(outputDirectory, 
        path.basename(inputFile, '.java') + '.pseudo'),
      javaCode: fs.readFileSync(inputFile, 'utf8')
    }));
    
    // Process each file
    const results = await Promise.all(
      jobs.map(job => this.convertSingleFile(job))
    );
    
    // Report results
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    console.log(`Conversion complete: ${successful} successful, ${failed} failed`);
    
    // Log any failures
    results.forEach((result, index) => {
      if (!result.success) {
        console.error(`Failed to convert ${jobs[index].inputFile}:`);
        result.errors.forEach(error => console.error(`  ${error.message}`));
      }
    });
  }
  
  private async convertSingleFile(job: ConversionJob): Promise<{success: boolean, errors: any[]}> {
    try {
      const result = this.converter.convert(job.javaCode);
      
      if (result.success) {
        fs.writeFileSync(job.outputFile, result.pseudocode);
        console.log(`✓ Converted ${path.basename(job.inputFile)}`);
        return { success: true, errors: [] };
      } else {
        return { success: false, errors: result.errors };
      }
    } catch (error) {
      return { 
        success: false, 
        errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }] 
      };
    }
  }
}

// Usage
const batchConverter = new BatchConverter();
batchConverter.convertFiles('./java-examples', './pseudocode-output');
```

### Processing with Statistics

```typescript
interface ConversionStats {
  totalFiles: number;
  successful: number;
  failed: number;
  totalLines: number;
  convertedLines: number;
  averageProcessingTime: number;
  errors: Array<{file: string, error: string}>;
}

function convertWithStats(javaFiles: string[]): ConversionStats {
  const converter = new JavaToIBConverter();
  const stats: ConversionStats = {
    totalFiles: javaFiles.length,
    successful: 0,
    failed: 0,
    totalLines: 0,
    convertedLines: 0,
    averageProcessingTime: 0,
    errors: []
  };
  
  let totalProcessingTime = 0;
  
  javaFiles.forEach(file => {
    try {
      const javaCode = fs.readFileSync(file, 'utf8');
      const result = converter.convert(javaCode);
      
      stats.totalLines += result.metadata.originalLines;
      totalProcessingTime += result.metadata.processingTime;
      
      if (result.success) {
        stats.successful++;
        stats.convertedLines += result.metadata.convertedLines;
      } else {
        stats.failed++;
        stats.errors.push({
          file,
          error: result.errors[0]?.message || 'Unknown error'
        });
      }
    } catch (error) {
      stats.failed++;
      stats.errors.push({
        file,
        error: error instanceof Error ? error.message : 'File read error'
      });
    }
  });
  
  stats.averageProcessingTime = totalProcessingTime / javaFiles.length;
  
  return stats;
}

// Usage
const javaFiles = ['example1.java', 'example2.java', 'example3.java'];
const stats = convertWithStats(javaFiles);

console.log('Conversion Statistics:');
console.log(`Total files: ${stats.totalFiles}`);
console.log(`Successful: ${stats.successful}`);
console.log(`Failed: ${stats.failed}`);
console.log(`Success rate: ${(stats.successful / stats.totalFiles * 100).toFixed(1)}%`);
console.log(`Average processing time: ${stats.averageProcessingTime.toFixed(2)}ms`);
console.log(`Total lines processed: ${stats.totalLines}`);
console.log(`Lines converted: ${stats.convertedLines}`);
```

## Integration Examples

### Web Application Integration

```typescript
// Express.js API endpoint
import express from 'express';
import { JavaToIBConverter } from 'java-to-ib-pseudocode';

const app = express();
const converter = new JavaToIBConverter();

app.use(express.json());

app.post('/api/convert', (req, res) => {
  try {
    const { javaCode, options } = req.body;
    
    if (!javaCode) {
      return res.status(400).json({
        error: 'Java code is required'
      });
    }
    
    const result = converter.convert(javaCode, options);
    
    res.json({
      success: result.success,
      pseudocode: result.pseudocode,
      errors: result.errors,
      warnings: result.warnings,
      metadata: result.metadata
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(3000, () => {
  console.log('Java to IB Pseudocode API running on port 3000');
});
```

### Command Line Tool

```typescript
#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { program } from 'commander';
import { JavaToIBConverter, ConversionOptions } from 'java-to-ib-pseudocode';

program
  .name('java2ib')
  .description('Convert Java code to IB pseudocode format')
  .version('1.0.0');

program
  .command('convert')
  .description('Convert a Java file to IB pseudocode')
  .argument('<input>', 'Input Java file')
  .option('-o, --output <file>', 'Output file (default: input.pseudo)')
  .option('--no-comments', 'Remove comments from output')
  .option('--indent <size>', 'Indentation size', '4')
  .option('--strict', 'Enable strict mode')
  .action((input, options) => {
    try {
      // Read input file
      const javaCode = fs.readFileSync(input, 'utf8');
      
      // Prepare conversion options
      const conversionOptions: ConversionOptions = {
        preserveComments: options.comments !== false,
        indentSize: parseInt(options.indent),
        strictMode: options.strict || false
      };
      
      // Convert
      const converter = new JavaToIBConverter();
      const result = converter.convert(javaCode, conversionOptions);
      
      // Determine output file
      const outputFile = options.output || 
        path.join(path.dirname(input), 
          path.basename(input, '.java') + '.pseudo');
      
      if (result.success) {
        fs.writeFileSync(outputFile, result.pseudocode);
        console.log(`✓ Converted ${input} to ${outputFile}`);
        
        if (result.warnings.length > 0) {
          console.log('Warnings:');
          result.warnings.forEach(warning => {
            console.log(`  ${warning.message}`);
          });
        }
      } else {
        console.error('Conversion failed:');
        result.errors.forEach(error => {
          console.error(`  ${error.message} (line ${error.location.line})`);
        });
        process.exit(1);
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program.parse();
```

### Testing Integration

```typescript
// Jest test helper
import { JavaToIBConverter } from 'java-to-ib-pseudocode';

export class TestHelper {
  private converter: JavaToIBConverter;
  
  constructor() {
    this.converter = new JavaToIBConverter();
  }
  
  expectSuccessfulConversion(javaCode: string, expectedPseudocode?: string): void {
    const result = this.converter.convert(javaCode);
    
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    if (expectedPseudocode) {
      expect(result.pseudocode.trim()).toBe(expectedPseudocode.trim());
    }
  }
  
  expectConversionError(javaCode: string, expectedErrorType?: string): void {
    const result = this.converter.convert(javaCode);
    
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    
    if (expectedErrorType) {
      expect(result.errors[0].type).toBe(expectedErrorType);
    }
  }
  
  expectConversionWarning(javaCode: string, expectedWarningCount?: number): void {
    const result = this.converter.convert(javaCode);
    
    expect(result.warnings.length).toBeGreaterThan(0);
    
    if (expectedWarningCount) {
      expect(result.warnings).toHaveLength(expectedWarningCount);
    }
  }
}

// Usage in tests
describe('Java to IB Converter', () => {
  const helper = new TestHelper();
  
  test('converts simple variable declaration', () => {
    helper.expectSuccessfulConversion(
      'int x = 5;',
      'X = 5'
    );
  });
  
  test('handles syntax errors gracefully', () => {
    helper.expectConversionError(
      'int x = ;',
      'syntax'
    );
  });
});
```

## Performance Considerations

### Large File Handling

```typescript
function convertLargeFile(filePath: string): void {
  const converter = new JavaToIBConverter();
  
  console.log('Reading file...');
  const startTime = Date.now();
  
  const javaCode = fs.readFileSync(filePath, 'utf8');
  const fileSize = Buffer.byteLength(javaCode, 'utf8');
  
  console.log(`File size: ${(fileSize / 1024).toFixed(2)} KB`);
  
  console.log('Converting...');
  const result = converter.convert(javaCode);
  
  const endTime = Date.now();
  const processingTime = endTime - startTime;
  
  console.log(`Processing time: ${processingTime}ms`);
  console.log(`Lines processed: ${result.metadata.originalLines}`);
  console.log(`Processing rate: ${(result.metadata.originalLines / processingTime * 1000).toFixed(2)} lines/second`);
  
  if (result.success) {
    console.log('Conversion successful!');
  } else {
    console.log(`Conversion failed with ${result.errors.length} errors`);
  }
}
```

This comprehensive example collection demonstrates the versatility and practical applications of the Java to IB Pseudocode Converter library in various educational and development contexts.