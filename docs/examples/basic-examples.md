# Basic Java to IB Pseudocode Examples

This document provides comprehensive examples of Java code and their corresponding IB pseudocode conversions.

## Variables and Data Types

### Example 1: Variable Declarations

**Java:**
```java
int age = 25;
double price = 19.99;
String name = "John";
boolean isStudent = true;
```

**IB Pseudocode:**
```
AGE = 25
PRICE = 19.99
NAME = "John"
ISSTUDENT = true
```

### Example 2: Variable Assignments

**Java:**
```java
int x = 10;
int y = 20;
int sum = x + y;
```

**IB Pseudocode:**
```
X = 10
Y = 20
SUM = X + Y
```

## Operators

### Example 3: Arithmetic Operators

**Java:**
```java
int a = 15;
int b = 4;
int sum = a + b;
int difference = a - b;
int product = a * b;
int quotient = a / b;
int remainder = a % b;
```

**IB Pseudocode:**
```
A = 15
B = 4
SUM = A + B
DIFFERENCE = A - B
PRODUCT = A * B
QUOTIENT = A / B
REMAINDER = A mod B
```

### Example 4: Comparison Operators

**Java:**
```java
int x = 10;
int y = 20;
boolean equal = (x == y);
boolean notEqual = (x != y);
boolean greater = (x > y);
boolean less = (x < y);
```

**IB Pseudocode:**
```
X = 10
Y = 20
EQUAL = (X = Y)
NOTEQUAL = (X ≠ Y)
GREATER = (X > Y)
LESS = (X < Y)
```

### Example 5: Logical Operators

**Java:**
```java
boolean a = true;
boolean b = false;
boolean andResult = a && b;
boolean orResult = a || b;
boolean notResult = !a;
```

**IB Pseudocode:**
```
A = true
B = false
ANDRESULT = A AND B
ORRESULT = A OR B
NOTRESULT = NOT A
```

## Control Structures

### Example 6: If-Else Statements

**Java:**
```java
int score = 85;
if (score >= 90) {
    System.out.println("Grade A");
} else if (score >= 80) {
    System.out.println("Grade B");
} else if (score >= 70) {
    System.out.println("Grade C");
} else {
    System.out.println("Grade F");
}
```

**IB Pseudocode:**
```
SCORE = 85
if SCORE >= 90 then
    output "Grade A"
else
    if SCORE >= 80 then
        output "Grade B"
    else
        if SCORE >= 70 then
            output "Grade C"
        else
            output "Grade F"
        end if
    end if
end if
```

### Example 7: While Loops

**Java:**
```java
int count = 1;
while (count <= 5) {
    System.out.println("Count: " + count);
    count++;
}
```

**IB Pseudocode:**
```
COUNT = 1
loop while COUNT <= 5
    output "Count: " + COUNT
    COUNT = COUNT + 1
end loop
```

### Example 8: For Loops

**Java:**
```java
for (int i = 0; i < 10; i++) {
    System.out.println("Number: " + i);
}
```

**IB Pseudocode:**
```
loop I from 0 to 9
    output "Number: " + I
end loop
```

### Example 9: Nested Loops

**Java:**
```java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        System.out.println(i + " x " + j + " = " + (i * j));
    }
}
```

**IB Pseudocode:**
```
loop I from 1 to 3
    loop J from 1 to 3
        output I + " x " + J + " = " + (I * J)
    end loop
end loop
```

## Methods and Functions

### Example 10: Void Methods (Procedures)

**Java:**
```java
public void greetUser(String name) {
    System.out.println("Hello, " + name + "!");
}
```

**IB Pseudocode:**
```
PROCEDURE greetUser(NAME)
    output "Hello, " + NAME + "!"
end PROCEDURE
```

### Example 11: Methods with Return Values (Functions)

**Java:**
```java
public int calculateArea(int length, int width) {
    return length * width;
}
```

**IB Pseudocode:**
```
FUNCTION calculateArea(LENGTH, WIDTH) RETURNS value
    return LENGTH * WIDTH
end FUNCTION
```

### Example 12: Method with Multiple Parameters

**Java:**
```java
public double calculateGrade(int totalPoints, int maxPoints) {
    double percentage = (double) totalPoints / maxPoints * 100;
    return percentage;
}
```

**IB Pseudocode:**
```
FUNCTION calculateGrade(TOTALPOINTS, MAXPOINTS) RETURNS value
    PERCENTAGE = TOTALPOINTS / MAXPOINTS * 100
    return PERCENTAGE
end FUNCTION
```

## Arrays

### Example 13: Array Declaration and Access

**Java:**
```java
int[] numbers = new int[5];
numbers[0] = 10;
numbers[1] = 20;
int firstNumber = numbers[0];
int arrayLength = numbers.length;
```

**IB Pseudocode:**
```
NUMBERS = new array[5]
NUMBERS[0] = 10
NUMBERS[1] = 20
FIRSTNUMBER = NUMBERS[0]
ARRAYLENGTH = SIZE(NUMBERS)
```

### Example 14: Array Processing with Loops

**Java:**
```java
int[] scores = {85, 92, 78, 96, 88};
int total = 0;
for (int i = 0; i < scores.length; i++) {
    total += scores[i];
}
double average = (double) total / scores.length;
```

**IB Pseudocode:**
```
SCORES = {85, 92, 78, 96, 88}
TOTAL = 0
loop I from 0 to SIZE(SCORES) - 1
    TOTAL = TOTAL + SCORES[I]
end loop
AVERAGE = TOTAL / SIZE(SCORES)
```

### Example 15: Enhanced For Loop with Arrays

**Java:**
```java
String[] names = {"Alice", "Bob", "Charlie"};
for (String name : names) {
    System.out.println("Hello, " + name);
}
```

**IB Pseudocode:**
```
NAMES = {"Alice", "Bob", "Charlie"}
loop I from 0 to SIZE(NAMES) - 1
    NAME = NAMES[I]
    output "Hello, " + NAME
end loop
```

## Input and Output

### Example 16: Output Statements

**Java:**
```java
System.out.println("Welcome to the program!");
System.out.print("Enter your name: ");
```

**IB Pseudocode:**
```
output "Welcome to the program!"
output "Enter your name: "
```

### Example 17: Input with Scanner

**Java:**
```java
Scanner scanner = new Scanner(System.in);
System.out.print("Enter your age: ");
int age = scanner.nextInt();
System.out.print("Enter your name: ");
String name = scanner.nextLine();
```

**IB Pseudocode:**
```
output "Enter your age: "
INPUT AGE
output "Enter your name: "
INPUT NAME
```

## Complex Examples

### Example 18: Complete Program - Number Guessing Game

**Java:**
```java
import java.util.Scanner;
import java.util.Random;

public class NumberGuessingGame {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        
        int secretNumber = random.nextInt(100) + 1;
        int guess = 0;
        int attempts = 0;
        
        System.out.println("Welcome to the Number Guessing Game!");
        System.out.println("I'm thinking of a number between 1 and 100.");
        
        while (guess != secretNumber) {
            System.out.print("Enter your guess: ");
            guess = scanner.nextInt();
            attempts++;
            
            if (guess < secretNumber) {
                System.out.println("Too low! Try again.");
            } else if (guess > secretNumber) {
                System.out.println("Too high! Try again.");
            } else {
                System.out.println("Congratulations! You guessed it in " + attempts + " attempts.");
            }
        }
    }
}
```

**IB Pseudocode:**
```
SECRETNUMBER = random(1, 100)
GUESS = 0
ATTEMPTS = 0

output "Welcome to the Number Guessing Game!"
output "I'm thinking of a number between 1 and 100."

loop while GUESS ≠ SECRETNUMBER
    output "Enter your guess: "
    INPUT GUESS
    ATTEMPTS = ATTEMPTS + 1
    
    if GUESS < SECRETNUMBER then
        output "Too low! Try again."
    else
        if GUESS > SECRETNUMBER then
            output "Too high! Try again."
        else
            output "Congratulations! You guessed it in " + ATTEMPTS + " attempts."
        end if
    end if
end loop
```

### Example 19: Array Search Algorithm

**Java:**
```java
public static int linearSearch(int[] array, int target) {
    for (int i = 0; i < array.length; i++) {
        if (array[i] == target) {
            return i;
        }
    }
    return -1;
}
```

**IB Pseudocode:**
```
FUNCTION linearSearch(ARRAY, TARGET) RETURNS value
    loop I from 0 to SIZE(ARRAY) - 1
        if ARRAY[I] = TARGET then
            return I
        end if
    end loop
    return -1
end FUNCTION
```

### Example 20: Class with Methods

**Java:**
```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public int subtract(int a, int b) {
        return a - b;
    }
    
    public void displayResult(int result) {
        System.out.println("Result: " + result);
    }
}
```

**IB Pseudocode:**
```
FUNCTION add(A, B) RETURNS value
    return A + B
end FUNCTION

FUNCTION subtract(A, B) RETURNS value
    return A - B
end FUNCTION

PROCEDURE displayResult(RESULT)
    output "Result: " + RESULT
end PROCEDURE
```