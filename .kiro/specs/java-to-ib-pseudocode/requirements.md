# Requirements Document

## Introduction

This feature is an npm library written in TypeScript that converts Java code into IB pseudocode style according to the official IB Computer Science pseudocode specification. The library is designed for educational purposes, enabling teachers to automatically convert Java code examples into the standardized pseudocode format used in IB Computer Science curriculum. The converter will handle Java syntax transformations including control structures, data types, operators, method declarations, and naming conventions to produce clean, readable IB-compliant pseudocode.

## Requirements

### Requirement 1

**User Story:** As a teacher, I want to convert Java code to IB pseudocode format, so that I can provide students with standardized pseudocode examples that match the IB curriculum requirements.

#### Acceptance Criteria

1. WHEN a user provides valid Java code as input THEN the system SHALL return equivalent IB pseudocode following the official specification
2. WHEN the conversion is complete THEN the system SHALL preserve the logical structure and functionality of the original Java code
3. WHEN invalid Java code is provided THEN the system SHALL return appropriate error messages indicating the parsing issues

### Requirement 2

**User Story:** As a developer integrating this library, I want a simple API interface, so that I can easily incorporate Java-to-pseudocode conversion into my educational applications.

#### Acceptance Criteria

1. WHEN the library is imported THEN the system SHALL provide a main conversion function that accepts Java code as a string
2. WHEN the conversion function is called THEN the system SHALL return a result object containing the converted pseudocode and any conversion metadata
3. WHEN using the library THEN the system SHALL provide TypeScript type definitions for all public interfaces

### Requirement 3

**User Story:** As a teacher, I want Java variable declarations converted to IB pseudocode format, so that students see consistent variable naming and assignment syntax.

#### Acceptance Criteria

1. WHEN Java variable declarations are encountered THEN the system SHALL convert variable names to UPPERCASE format
2. WHEN Java assignment operators (=) are used THEN the system SHALL preserve them as = in pseudocode
3. WHEN Java primitive types (int, double, boolean, String) are declared THEN the system SHALL remove explicit type declarations in pseudocode

### Requirement 4

**User Story:** As a teacher, I want Java control structures converted to IB pseudocode format, so that students learn the standardized control flow syntax.

#### Acceptance Criteria

1. WHEN Java if-else statements are encountered THEN the system SHALL convert them to "if...then...else...end if" format
2. WHEN Java while loops are encountered THEN the system SHALL convert them to "loop while...end loop" format
3. WHEN Java for loops are encountered THEN the system SHALL convert them to "loop I from X to Y...end loop" format
4. WHEN nested control structures are present THEN the system SHALL maintain proper indentation and nesting

### Requirement 5

**User Story:** As a teacher, I want Java operators converted to IB pseudocode operators, so that students use the correct mathematical and logical notation.

#### Acceptance Criteria

1. WHEN Java comparison operators (==, !=, >, <, >=, <=) are encountered THEN the system SHALL convert them to IB format (=, ≠, >, <, >=, <=)
2. WHEN Java logical operators (&&, ||, !) are encountered THEN the system SHALL convert them to IB format (AND, OR, NOT)
3. WHEN Java modulo operator (%) is encountered THEN the system SHALL convert it to "mod"
4. WHEN Java integer division is detected THEN the system SHALL convert it to "div" where appropriate

### Requirement 6

**User Story:** As a teacher, I want Java method declarations converted to IB function/procedure format, so that students understand the distinction between functions and procedures.

#### Acceptance Criteria

1. WHEN Java methods with void return type are encountered THEN the system SHALL convert them to "PROCEDURE...end PROCEDURE" format
2. WHEN Java methods with non-void return type are encountered THEN the system SHALL convert them to "FUNCTION...RETURNS value...end FUNCTION" format
3. WHEN Java method parameters are present THEN the system SHALL convert parameter names to UPPERCASE
4. WHEN Java return statements are encountered THEN the system SHALL convert them to "return" statements in pseudocode

### Requirement 7

**User Story:** As a teacher, I want Java array operations converted to IB pseudocode format, so that students learn the correct array syntax and indexing.

#### Acceptance Criteria

1. WHEN Java array declarations are encountered THEN the system SHALL convert them to IB array format with UPPERCASE names
2. WHEN Java array access (array[index]) is used THEN the system SHALL preserve the bracket notation
3. WHEN Java array.length is encountered THEN the system SHALL convert it to SIZE(ARRAY) format
4. WHEN Java enhanced for loops over arrays are encountered THEN the system SHALL convert them to appropriate loop structures

### Requirement 8

**User Story:** As a teacher, I want Java input/output statements converted to IB pseudocode format, so that students use the standardized I/O syntax.

#### Acceptance Criteria

1. WHEN Java System.out.print/println statements are encountered THEN the system SHALL convert them to "output" statements
2. WHEN Java Scanner input operations are encountered THEN the system SHALL convert them to "INPUT" statements
3. WHEN Java print statements include prompts THEN the system SHALL separate the prompt output from the input statement

### Requirement 9

**User Story:** As a developer, I want comprehensive error handling and validation, so that I can provide meaningful feedback when conversion fails.

#### Acceptance Criteria

1. WHEN syntactically invalid Java code is provided THEN the system SHALL return detailed error messages with line numbers
2. WHEN unsupported Java constructs are encountered THEN the system SHALL return warnings indicating which features cannot be converted
3. WHEN conversion is successful with warnings THEN the system SHALL return both the converted pseudocode and warning messages

### Requirement 10

**User Story:** As a teacher, I want the library to handle common Java programming patterns, so that I can convert realistic code examples used in computer science education.

#### Acceptance Criteria

1. WHEN Java class definitions with main methods are encountered THEN the system SHALL extract and convert the main method logic
2. WHEN Java static methods are encountered THEN the system SHALL convert them to appropriate function/procedure format
3. WHEN Java comments are present THEN the system SHALL preserve them in the pseudocode output
4. WHEN Java string operations and comparisons are used THEN the system SHALL convert them to IB pseudocode string handling format