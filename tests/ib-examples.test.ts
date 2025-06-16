import { describe, it, expect } from 'vitest';
import { convertJavaToIB } from '../src/index';

describe('IB Computer Science Examples', () => {
  describe('Algorithm Examples from IB Syllabus', () => {
    it('should convert linear search algorithm', () => {
      const javaCode = `
        public int linearSearch(int[] array, int target) {
            for (int i = 0; i < array.length; i++) {
                if (array[i] == target) {
                    return i;
                }
            }
            return -1;
        }
      `;
      const expected = `FUNCTION linearSearch(array, target)
    FOR i ← 0 TO array.length - 1
        IF array[i] = target THEN
            RETURN i
        ENDIF
    NEXT i
    RETURN -1
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert binary search algorithm', () => {
      const javaCode = `
        public int binarySearch(int[] array, int target) {
            int left = 0;
            int right = array.length - 1;
            
            while (left <= right) {
                int mid = (left + right) / 2;
                
                if (array[mid] == target) {
                    return mid;
                } else if (array[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            return -1;
        }
      `;
      const expected = `FUNCTION binarySearch(array, target)
    left ← 0
    right ← array.length - 1
    
    WHILE left ≤ right
        mid ← (left + right) / 2
        
        IF array[mid] = target THEN
            RETURN mid
        ELSEIF array[mid] < target THEN
            left ← mid + 1
        ELSE
            right ← mid - 1
        ENDIF
    ENDWHILE
    RETURN -1
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert bubble sort algorithm', () => {
      const javaCode = `
        public void bubbleSort(int[] array) {
            int n = array.length;
            for (int i = 0; i < n - 1; i++) {
                for (int j = 0; j < n - i - 1; j++) {
                    if (array[j] > array[j + 1]) {
                        int temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                    }
                }
            }
        }
      `;
      const expected = `PROCEDURE bubbleSort(array)
    n ← array.length
    FOR i ← 0 TO n - 2
        FOR j ← 0 TO n - i - 2
            IF array[j] > array[j + 1] THEN
                temp ← array[j]
                array[j] ← array[j + 1]
                array[j + 1] ← temp
            ENDIF
        NEXT j
    NEXT i
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert selection sort algorithm', () => {
      const javaCode = `
        public void selectionSort(int[] array) {
            int n = array.length;
            
            for (int i = 0; i < n - 1; i++) {
                int minIndex = i;
                for (int j = i + 1; j < n; j++) {
                    if (array[j] < array[minIndex]) {
                        minIndex = j;
                    }
                }
                
                int temp = array[minIndex];
                array[minIndex] = array[i];
                array[i] = temp;
            }
        }
      `;
      const expected = `PROCEDURE selectionSort(array)
    n ← array.length
    
    FOR i ← 0 TO n - 2
        minIndex ← i
        FOR j ← i + 1 TO n - 1
            IF array[j] < array[minIndex] THEN
                minIndex ← j
            ENDIF
        NEXT j
        
        temp ← array[minIndex]
        array[minIndex] ← array[i]
        array[i] ← temp
    NEXT i
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Data Structure Examples', () => {
    it('should convert stack implementation', () => {
      const javaCode = `
        public class Stack {
            private int[] data;
            private int top;
            
            public void push(int value) {
                if (top < data.length - 1) {
                    top++;
                    data[top] = value;
                }
            }
            
            public int pop() {
                if (top >= 0) {
                    int value = data[top];
                    top--;
                    return value;
                }
                return -1;
            }
        }
      `;
      const expected = `CLASS Stack
    PRIVATE data
    PRIVATE top
    
    PROCEDURE push(value)
        IF top < data.length - 1 THEN
            top ← top + 1
            data[top] ← value
        ENDIF
    ENDPROCEDURE
    
    FUNCTION pop()
        IF top ≥ 0 THEN
            value ← data[top]
            top ← top - 1
            RETURN value
        ENDIF
        RETURN -1
    ENDFUNCTION
ENDCLASS`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert queue implementation', () => {
      const javaCode = `
        public class Queue {
            private int[] data;
            private int front;
            private int rear;
            
            public void enqueue(int value) {
                if (rear < data.length - 1) {
                    rear++;
                    data[rear] = value;
                }
            }
            
            public int dequeue() {
                if (front <= rear) {
                    int value = data[front];
                    front++;
                    return value;
                }
                return -1;
            }
        }
      `;
      const expected = `CLASS Queue
    PRIVATE data
    PRIVATE front
    PRIVATE rear
    
    PROCEDURE enqueue(value)
        IF rear < data.length - 1 THEN
            rear ← rear + 1
            data[rear] ← value
        ENDIF
    ENDPROCEDURE
    
    FUNCTION dequeue()
        IF front ≤ rear THEN
            value ← data[front]
            front ← front + 1
            RETURN value
        ENDIF
        RETURN -1
    ENDFUNCTION
ENDCLASS`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Mathematical Examples', () => {
    it('should convert factorial calculation (recursive)', () => {
      const javaCode = `
        public int factorial(int n) {
            if (n <= 1) {
                return 1;
            } else {
                return n * factorial(n - 1);
            }
        }
      `;
      const expected = `FUNCTION factorial(n)
    IF n ≤ 1 THEN
        RETURN 1
    ELSE
        RETURN n * factorial(n - 1)
    ENDIF
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert fibonacci sequence', () => {
      const javaCode = `
        public int fibonacci(int n) {
            if (n <= 1) {
                return n;
            }
            return fibonacci(n - 1) + fibonacci(n - 2);
        }
      `;
      const expected = `FUNCTION fibonacci(n)
    IF n ≤ 1 THEN
        RETURN n
    ENDIF
    RETURN fibonacci(n - 1) + fibonacci(n - 2)
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert greatest common divisor (Euclidean algorithm)', () => {
      const javaCode = `
        public int gcd(int a, int b) {
            while (b != 0) {
                int temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }
      `;
      const expected = `FUNCTION gcd(a, b)
    WHILE b ≠ 0
        temp ← b
        b ← a MOD b
        a ← temp
    ENDWHILE
    RETURN a
ENDFUNCTION`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Input/Output Examples', () => {
    it('should convert simple calculator program', () => {
      const javaCode = `
        public void calculator() {
            Scanner scanner = new Scanner(System.in);
            
            System.out.println("Enter first number:");
            double num1 = scanner.nextDouble();
            
            System.out.println("Enter operator (+, -, *, /):");
            char operator = scanner.next().charAt(0);
            
            System.out.println("Enter second number:");
            double num2 = scanner.nextDouble();
            
            double result = 0;
            
            switch (operator) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '*':
                    result = num1 * num2;
                    break;
                case '/':
                    if (num2 != 0) {
                        result = num1 / num2;
                    } else {
                        System.out.println("Error: Division by zero");
                        return;
                    }
                    break;
                default:
                    System.out.println("Invalid operator");
                    return;
            }
            
            System.out.println("Result: " + result);
        }
      `;
      const expected = `PROCEDURE calculator()
    OUTPUT "Enter first number:"
    INPUT num1
    
    OUTPUT "Enter operator (+, -, *, /):"
    INPUT operator
    
    OUTPUT "Enter second number:"
    INPUT num2
    
    result ← 0
    
    CASE OF operator
        '+': result ← num1 + num2
        '-': result ← num1 - num2
        '*': result ← num1 * num2
        '/': IF num2 ≠ 0 THEN
                result ← num1 / num2
             ELSE
                OUTPUT "Error: Division by zero"
                RETURN
             ENDIF
        OTHERWISE: OUTPUT "Invalid operator"
                  RETURN
    ENDCASE
    
    OUTPUT "Result: " + result
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Array Processing Examples', () => {
    it('should convert array statistics calculation', () => {
      const javaCode = `
        public void arrayStats(int[] numbers) {
            int sum = 0;
            int max = numbers[0];
            int min = numbers[0];
            
            for (int num : numbers) {
                sum += num;
                if (num > max) {
                    max = num;
                }
                if (num < min) {
                    min = num;
                }
            }
            
            double average = (double) sum / numbers.length;
            
            System.out.println("Sum: " + sum);
            System.out.println("Average: " + average);
            System.out.println("Maximum: " + max);
            System.out.println("Minimum: " + min);
        }
      `;
      const expected = `PROCEDURE arrayStats(numbers)
    sum ← 0
    max ← numbers[0]
    min ← numbers[0]
    
    FOR EACH num IN numbers
        sum ← sum + num
        IF num > max THEN
            max ← num
        ENDIF
        IF num < min THEN
            min ← num
        ENDIF
    NEXT num
    
    average ← sum / numbers.length
    
    OUTPUT "Sum: " + sum
    OUTPUT "Average: " + average
    OUTPUT "Maximum: " + max
    OUTPUT "Minimum: " + min
ENDPROCEDURE`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });
});