# Java to IB Pseudocode Conversion Rules

This document explains the detailed conversion rules used by the Java to IB Pseudocode Converter library. Understanding these rules will help you predict how your Java code will be transformed and ensure the output meets IB Computer Science curriculum requirements.

## Table of Contents

1. [Variable Naming Conventions](#variable-naming-conventions)
2. [Data Types](#data-types)
3. [Operators](#operators)
4. [Control Structures](#control-structures)
5. [Methods and Functions](#methods-and-functions)
6. [Arrays](#arrays)
7. [Input and Output](#input-and-output)
8. [Comments](#comments)
9. [Object-Oriented Features](#object-oriented-features)
10. [Special Cases](#special-cases)

## Variable Naming Conventions

### Rule: Java camelCase → IB UPPERCASE

The IB pseudocode specification requires all variable names to be in UPPERCASE format, while Java typically uses camelCase naming.

**Conversion Examples:**
- `userName` → `USERNAME`
- `totalScore` → `TOTALSCORE`
- `isValid` → `ISVALID`
- `maxValue` → `MAXVALUE`
- `itemCount` → `ITEMCOUNT`

**Implementation Details:**
- All letters are converted to uppercase
- Underscores and numbers are preserved
- Special characters are handled appropriately

```java
// Java
int studentAge = 18;
String firstName = "Alice";
boolean hasPermission = true;
```

```
// IB Pseudocode
STUDENTAGE = 18
FIRSTNAME = "Alice"
HASPERMISSION = true
```

## Data Types

### Rule: Remove Explicit Type Declarations

IB pseudocode does not require explicit type declarations for variables. The converter removes Java type information while preserving the assignment.

**Java Types Handled:**
- `int`, `Integer` → No type declaration
- `double`, `Double`, `float`, `Float` → No type declaration
- `boolean`, `Boolean` → No type declaration
- `String` → No type declaration
- `char`, `Character` → No type declaration

```java
// Java
int count = 0;
double price = 19.99;
String message = "Hello";
boolean flag = true;
```

```
// IB Pseudocode
COUNT = 0
PRICE = 19.99
MESSAGE = "Hello"
FLAG = true
```

## Operators

### Arithmetic Operators

Most arithmetic operators remain unchanged, with one important exception:

| Java | IB Pseudocode | Description |
|------|---------------|-------------|
| `+`  | `+`          | Addition |
| `-`  | `-`          | Subtraction |
| `*`  | `*`          | Multiplication |
| `/`  | `/`          | Division |
| `%`  | `mod`        | Modulo operation |

### Comparison Operators

| Java | IB Pseudocode | Description |
|------|---------------|-------------|
| `==` | `=`          | Equality |
| `!=` | `≠`          | Not equal |
| `>`  | `>`          | Greater than |
| `<`  | `<`          | Less than |
| `>=` | `>=`         | Greater than or equal |
| `<=` | `<=`         | Less than or equal |

### Logical Operators

| Java | IB Pseudocode | Description |
|------|---------------|-------------|
| `&&` | `AND`        | Logical AND |
| `||` | `OR`         | Logical OR |
| `!`  | `NOT`        | Logical NOT |

**Examples:**
```java
// Java
if (age >= 18 && hasLicense == true) {
    // code
}
```

```
// IB Pseudocode
if AGE >= 18 AND HASLICENSE = true then
    // code
end if
```

## Control Structures

### If-Else Statements

**Java Format:**
```java
if (condition) {
    // statements
} else if (condition2) {
    // statements
} else {
    // statements
}
```

**IB Pseudocode Format:**
```
if condition then
    // statements
else
    if condition2 then
        // statements
    else
        // statements
    end if
end if
```

**Key Changes:**
- Add `then` after condition
- Replace `else if` with nested `if` statements
- Add `end if` to close each if block
- Remove curly braces

### While Loops

**Java Format:**
```java
while (condition) {
    // statements
}
```

**IB Pseudocode Format:**
```
loop while condition
    // statements
end loop
```

**Key Changes:**
- Replace `while (condition) {` with `loop while condition`
- Replace `}` with `end loop`

### For Loops

**Standard For Loop:**
```java
for (int i = start; i < end; i++) {
    // statements
}
```

```
loop I from start to (end-1)
    // statements
end loop
```

**Enhanced For Loop:**
```java
for (Type item : collection) {
    // statements
}
```

```
loop I from 0 to SIZE(COLLECTION) - 1
    ITEM = COLLECTION[I]
    // statements
end loop
```

**Key Changes:**
- Convert to `loop I from X to Y` format
- Adjust end value (Java's `i < end` becomes `to (end-1)`)
- Enhanced for loops become indexed loops with explicit item access

## Methods and Functions

### Void Methods → Procedures

**Java:**
```java
public void methodName(Type param1, Type param2) {
    // statements
}
```

**IB Pseudocode:**
```
PROCEDURE methodName(PARAM1, PARAM2)
    // statements
end PROCEDURE
```

### Non-Void Methods → Functions

**Java:**
```java
public ReturnType methodName(Type param1, Type param2) {
    return value;
}
```

**IB Pseudocode:**
```
FUNCTION methodName(PARAM1, PARAM2) RETURNS value
    return value
end FUNCTION
```

**Key Changes:**
- Remove access modifiers (`public`, `private`, etc.)
- Remove return type from declaration
- Convert parameter names to UPPERCASE
- Add `RETURNS value` for non-void methods
- Use `PROCEDURE` for void methods, `FUNCTION` for others

### Method Calls

**Java:**
```java
result = methodName(arg1, arg2);
methodName(arg1, arg2);
```

**IB Pseudocode:**
```
RESULT = methodName(ARG1, ARG2)
methodName(ARG1, ARG2)
```

## Arrays

### Array Declaration

**Java:**
```java
int[] array = new int[size];
Type[] array = {value1, value2, value3};
```

**IB Pseudocode:**
```
ARRAY = new array[size]
ARRAY = {value1, value2, value3}
```

### Array Access

**Java:**
```java
array[index] = value;
value = array[index];
```

**IB Pseudocode:**
```
ARRAY[INDEX] = value
VALUE = ARRAY[INDEX]
```

### Array Length

**Java:**
```java
int length = array.length;
```

**IB Pseudocode:**
```
LENGTH = SIZE(ARRAY)
```

**Key Changes:**
- `array.length` becomes `SIZE(ARRAY)`
- Array names converted to UPPERCASE
- Bracket notation preserved

## Input and Output

### Output Statements

**Java:**
```java
System.out.println("message");
System.out.print("message");
```

**IB Pseudocode:**
```
output "message"
output "message"
```

### Input Statements

**Java:**
```java
Scanner scanner = new Scanner(System.in);
int value = scanner.nextInt();
String text = scanner.nextLine();
```

**IB Pseudocode:**
```
INPUT VALUE
INPUT TEXT
```

**Input with Prompts:**
```java
System.out.print("Enter value: ");
int value = scanner.nextInt();
```

```
output "Enter value: "
INPUT VALUE
```

**Key Changes:**
- All `System.out.print/println` become `output`
- Scanner input operations become `INPUT VARIABLE`
- Prompts are separated into distinct output statements

## Comments

### Single-Line Comments

**Java:**
```java
// This is a comment
int x = 5; // End-of-line comment
```

**IB Pseudocode:**
```
// This is a comment
X = 5 // End-of-line comment
```

### Multi-Line Comments

**Java:**
```java
/*
 * Multi-line comment
 * with multiple lines
 */
```

**IB Pseudocode:**
```
/*
 * Multi-line comment
 * with multiple lines
 */
```

**Key Changes:**
- Comments are preserved as-is
- Comment style remains unchanged

## Object-Oriented Features

### Class Declarations

**Java:**
```java
public class ClassName {
    // class content
}
```

**IB Pseudocode:**
- Class declarations are typically omitted
- Methods within classes are extracted and converted individually

### Static Methods

**Java:**
```java
public static void main(String[] args) {
    // main method content
}
```

**IB Pseudocode:**
- Main method content is extracted and converted
- Static modifier is removed
- Method signature is simplified

### Access Modifiers

**Java:**
```java
public void method() { }
private int field;
protected void helper() { }
```

**IB Pseudocode:**
- All access modifiers (`public`, `private`, `protected`) are removed
- Focus is on the logical structure, not access control

## Special Cases

### String Operations

**Java:**
```java
String result = str1 + str2;
boolean equal = str1.equals(str2);
int length = str.length();
```

**IB Pseudocode:**
```
RESULT = STR1 + STR2
EQUAL = (STR1 = STR2)
LENGTH = SIZE(STR)
```

### Increment/Decrement

**Java:**
```java
i++;
++i;
i--;
--i;
i += 5;
i -= 3;
```

**IB Pseudocode:**
```
I = I + 1
I = I + 1
I = I - 1
I = I - 1
I = I + 5
I = I - 3
```

### Boolean Literals

**Java:**
```java
boolean flag = true;
boolean other = false;
```

**IB Pseudocode:**
```
FLAG = true
OTHER = false
```

### Null Values

**Java:**
```java
String value = null;
if (value == null) {
    // handle null
}
```

**IB Pseudocode:**
```
VALUE = null
if VALUE = null then
    // handle null
end if
```

## Conversion Limitations

### Unsupported Features

The following Java features are not directly convertible and may require manual adjustment:

1. **Generic Types**: `List<String>` → Manual conversion needed
2. **Lambda Expressions**: `stream.map(x -> x * 2)` → Not supported
3. **Exception Handling**: `try-catch` blocks → Manual conversion
4. **Interfaces**: Interface declarations → Not directly convertible
5. **Inheritance**: `extends` and `implements` → Simplified conversion
6. **Package Declarations**: `package` statements → Ignored
7. **Import Statements**: `import` statements → Ignored

### Warnings and Error Handling

The converter will generate warnings for:
- Unsupported Java constructs
- Complex expressions that may need manual review
- Potential semantic issues in conversion

## Best Practices for Conversion

1. **Keep Java Code Simple**: Use basic constructs for better conversion
2. **Avoid Complex OOP**: Minimize inheritance and interfaces
3. **Use Standard Libraries Minimally**: Stick to basic I/O operations
4. **Review Output**: Always check converted pseudocode for accuracy
5. **Test Logic**: Ensure the pseudocode maintains the original logic

## Educational Context

These conversion rules are designed to support IB Computer Science education by:

- **Maintaining Logical Equivalence**: The pseudocode performs the same operations as the Java code
- **Following IB Standards**: Output conforms to official IB pseudocode specification
- **Enhancing Readability**: Pseudocode is formatted for educational clarity
- **Supporting Assessment**: Output is suitable for IB examination contexts

Understanding these rules helps teachers and students effectively use the converter while maintaining the educational value of both Java programming and IB pseudocode representation.