import { describe, it, expect } from 'vitest';
import { convertJavaToIB } from '../src/index';

describe('Integration Tests', () => {
  describe('Complete Class Conversion', () => {
    it('should convert a complete simple class', () => {
      const javaCode = `
        public class Calculator {
            private double result;
            
            public Calculator() {
                this.result = 0.0;
            }
            
            public void add(double value) {
                this.result += value;
            }
            
            public void subtract(double value) {
                this.result -= value;
            }
            
            public double getResult() {
                return this.result;
            }
            
            public void clear() {
                this.result = 0.0;
            }
        }
      `;
      const expected = `CLASS Calculator
    PRIVATE result
    
    CONSTRUCTOR Calculator()
        THIS.result ← 0.0
    ENDCONSTRUCTOR
    
    PROCEDURE add(value)
        THIS.result ← THIS.result + value
    ENDPROCEDURE
    
    PROCEDURE subtract(value)
        THIS.result ← THIS.result - value
    ENDPROCEDURE
    
    FUNCTION getResult()
        RETURN THIS.result
    ENDFUNCTION
    
    PROCEDURE clear()
        THIS.result ← 0.0
    ENDPROCEDURE
ENDCLASS`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });

    it('should convert a class with inheritance', () => {
      const javaCode = `
        public class Animal {
            protected String name;
            
            public Animal(String name) {
                this.name = name;
            }
            
            public void speak() {
                System.out.println(name + " makes a sound");
            }
        }
        
        public class Dog extends Animal {
            private String breed;
            
            public Dog(String name, String breed) {
                super(name);
                this.breed = breed;
            }
            
            @Override
            public void speak() {
                System.out.println(name + " barks");
            }
            
            public void wagTail() {
                System.out.println(name + " wags tail");
            }
        }
      `;
      const expected = `CLASS Animal
    PROTECTED name
    
    CONSTRUCTOR Animal(name)
        THIS.name ← name
    ENDCONSTRUCTOR
    
    PROCEDURE speak()
        OUTPUT name + " makes a sound"
    ENDPROCEDURE
ENDCLASS

CLASS Dog INHERITS Animal
    PRIVATE breed
    
    CONSTRUCTOR Dog(name, breed)
        SUPER(name)
        THIS.breed ← breed
    ENDCONSTRUCTOR
    
    PROCEDURE speak()
        OUTPUT name + " barks"
    ENDPROCEDURE
    
    PROCEDURE wagTail()
        OUTPUT name + " wags tail"
    ENDPROCEDURE
ENDCLASS`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Complete Program Conversion', () => {
    it('should convert a complete student management program', () => {
      const javaCode = `
        import java.util.ArrayList;
        import java.util.Scanner;
        
        public class StudentManager {
            private ArrayList<Student> students;
            
            public StudentManager() {
                this.students = new ArrayList<>();
            }
            
            public void addStudent(String name, int age, double grade) {
                Student student = new Student(name, age, grade);
                students.add(student);
                System.out.println("Student added: " + name);
            }
            
            public void displayAllStudents() {
                if (students.isEmpty()) {
                    System.out.println("No students found");
                    return;
                }
                
                System.out.println("All Students:");
                for (int i = 0; i < students.size(); i++) {
                    Student student = students.get(i);
                    System.out.println((i + 1) + ". " + student.toString());
                }
            }
            
            public double calculateAverageGrade() {
                if (students.isEmpty()) {
                    return 0.0;
                }
                
                double sum = 0.0;
                for (Student student : students) {
                    sum += student.getGrade();
                }
                
                return sum / students.size();
            }
            
            public Student findTopStudent() {
                if (students.isEmpty()) {
                    return null;
                }
                
                Student topStudent = students.get(0);
                for (int i = 1; i < students.size(); i++) {
                    if (students.get(i).getGrade() > topStudent.getGrade()) {
                        topStudent = students.get(i);
                    }
                }
                
                return topStudent;
            }
        }
        
        class Student {
            private String name;
            private int age;
            private double grade;
            
            public Student(String name, int age, double grade) {
                this.name = name;
                this.age = age;
                this.grade = grade;
            }
            
            public String getName() {
                return name;
            }
            
            public int getAge() {
                return age;
            }
            
            public double getGrade() {
                return grade;
            }
            
            public void setGrade(double grade) {
                this.grade = grade;
            }
            
            @Override
            public String toString() {
                return name + " (Age: " + age + ", Grade: " + grade + ")";
            }
        }
      `;
      const expected = `CLASS StudentManager
    PRIVATE students
    
    CONSTRUCTOR StudentManager()
        THIS.students ← NEW ARRAYLIST
    ENDCONSTRUCTOR
    
    PROCEDURE addStudent(name, age, grade)
        student ← NEW Student(name, age, grade)
        students.add(student)
        OUTPUT "Student added: " + name
    ENDPROCEDURE
    
    PROCEDURE displayAllStudents()
        IF students.isEmpty() THEN
            OUTPUT "No students found"
            RETURN
        ENDIF
        
        OUTPUT "All Students:"
        FOR i ← 0 TO students.size() - 1
            student ← students.get(i)
            OUTPUT (i + 1) + ". " + student.toString()
        NEXT i
    ENDPROCEDURE
    
    FUNCTION calculateAverageGrade()
        IF students.isEmpty() THEN
            RETURN 0.0
        ENDIF
        
        sum ← 0.0
        FOR EACH student IN students
            sum ← sum + student.getGrade()
        NEXT student
        
        RETURN sum / students.size()
    ENDFUNCTION
    
    FUNCTION findTopStudent()
        IF students.isEmpty() THEN
            RETURN NULL
        ENDIF
        
        topStudent ← students.get(0)
        FOR i ← 1 TO students.size() - 1
            IF students.get(i).getGrade() > topStudent.getGrade() THEN
                topStudent ← students.get(i)
            ENDIF
        NEXT i
        
        RETURN topStudent
    ENDFUNCTION
ENDCLASS

CLASS Student
    PRIVATE name
    PRIVATE age
    PRIVATE grade
    
    CONSTRUCTOR Student(name, age, grade)
        THIS.name ← name
        THIS.age ← age
        THIS.grade ← grade
    ENDCONSTRUCTOR
    
    FUNCTION getName()
        RETURN name
    ENDFUNCTION
    
    FUNCTION getAge()
        RETURN age
    ENDFUNCTION
    
    FUNCTION getGrade()
        RETURN grade
    ENDFUNCTION
    
    PROCEDURE setGrade(grade)
        THIS.grade ← grade
    ENDPROCEDURE
    
    FUNCTION toString()
        RETURN name + " (Age: " + age + ", Grade: " + grade + ")"
    ENDFUNCTION
ENDCLASS`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Real-world Algorithm Examples', () => {
    it('should convert a complete binary tree implementation', () => {
      const javaCode = `
        public class BinaryTree {
            private Node root;
            
            private class Node {
                int data;
                Node left;
                Node right;
                
                Node(int data) {
                    this.data = data;
                    this.left = null;
                    this.right = null;
                }
            }
            
            public void insert(int data) {
                root = insertRec(root, data);
            }
            
            private Node insertRec(Node root, int data) {
                if (root == null) {
                    root = new Node(data);
                    return root;
                }
                
                if (data < root.data) {
                    root.left = insertRec(root.left, data);
                } else if (data > root.data) {
                    root.right = insertRec(root.right, data);
                }
                
                return root;
            }
            
            public void inorderTraversal() {
                inorderRec(root);
            }
            
            private void inorderRec(Node root) {
                if (root != null) {
                    inorderRec(root.left);
                    System.out.print(root.data + " ");
                    inorderRec(root.right);
                }
            }
            
            public boolean search(int data) {
                return searchRec(root, data);
            }
            
            private boolean searchRec(Node root, int data) {
                if (root == null) {
                    return false;
                }
                
                if (root.data == data) {
                    return true;
                }
                
                if (data < root.data) {
                    return searchRec(root.left, data);
                } else {
                    return searchRec(root.right, data);
                }
            }
        }
      `;
      const expected = `CLASS BinaryTree
    PRIVATE root
    
    CLASS Node
        data
        left
        right
        
        CONSTRUCTOR Node(data)
            THIS.data ← data
            THIS.left ← NULL
            THIS.right ← NULL
        ENDCONSTRUCTOR
    ENDCLASS
    
    PROCEDURE insert(data)
        root ← insertRec(root, data)
    ENDPROCEDURE
    
    PRIVATE FUNCTION insertRec(root, data)
        IF root = NULL THEN
            root ← NEW Node(data)
            RETURN root
        ENDIF
        
        IF data < root.data THEN
            root.left ← insertRec(root.left, data)
        ELSEIF data > root.data THEN
            root.right ← insertRec(root.right, data)
        ENDIF
        
        RETURN root
    ENDFUNCTION
    
    PROCEDURE inorderTraversal()
        inorderRec(root)
    ENDPROCEDURE
    
    PRIVATE PROCEDURE inorderRec(root)
        IF root ≠ NULL THEN
            inorderRec(root.left)
            OUTPUT root.data + " "
            inorderRec(root.right)
        ENDIF
    ENDPROCEDURE
    
    FUNCTION search(data)
        RETURN searchRec(root, data)
    ENDFUNCTION
    
    PRIVATE FUNCTION searchRec(root, data)
        IF root = NULL THEN
            RETURN FALSE
        ENDIF
        
        IF root.data = data THEN
            RETURN TRUE
        ENDIF
        
        IF data < root.data THEN
            RETURN searchRec(root.left, data)
        ELSE
            RETURN searchRec(root.right, data)
        ENDIF
    ENDFUNCTION
ENDCLASS`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('File Processing Examples', () => {
    it('should convert file reading and processing', () => {
      const javaCode = `
        import java.io.*;
        import java.util.*;
        
        public class FileProcessor {
            public void processFile(String filename) {
                try {
                    Scanner scanner = new Scanner(new File(filename));
                    int lineCount = 0;
                    int wordCount = 0;
                    
                    while (scanner.hasNextLine()) {
                        String line = scanner.nextLine();
                        lineCount++;
                        
                        String[] words = line.split("\\s+");
                        wordCount += words.length;
                        
                        System.out.println("Line " + lineCount + ": " + line);
                    }
                    
                    scanner.close();
                    
                    System.out.println("Total lines: " + lineCount);
                    System.out.println("Total words: " + wordCount);
                    
                } catch (FileNotFoundException e) {
                    System.out.println("File not found: " + filename);
                } catch (Exception e) {
                    System.out.println("Error processing file: " + e.getMessage());
                }
            }
        }
      `;
      const expected = `CLASS FileProcessor
    PROCEDURE processFile(filename)
        TRY
            scanner ← NEW Scanner(NEW File(filename))
            lineCount ← 0
            wordCount ← 0
            
            WHILE scanner.hasNextLine()
                line ← scanner.nextLine()
                lineCount ← lineCount + 1
                
                words ← line.split("\\s+")
                wordCount ← wordCount + words.length
                
                OUTPUT "Line " + lineCount + ": " + line
            ENDWHILE
            
            scanner.close()
            
            OUTPUT "Total lines: " + lineCount
            OUTPUT "Total words: " + wordCount
            
        CATCH FileNotFoundException
            OUTPUT "File not found: " + filename
        CATCH Exception
            OUTPUT "Error processing file: " + e.getMessage()
        ENDTRY
    ENDPROCEDURE
ENDCLASS`;
      expect(convertJavaToIB(javaCode)).toBe(expected);
    });
  });

  describe('Performance and Memory Tests', () => {
    it('should handle large code blocks efficiently', () => {
      // Generate a large Java class with many methods
      let javaCode = 'public class LargeClass {\n';
      let expected = 'CLASS LargeClass\n';
      
      for (let i = 0; i < 50; i++) {
        javaCode += `
            public void method${i}() {
                int value${i} = ${i};
                System.out.println("Method ${i}: " + value${i});
            }
        `;
        expected += `
    PROCEDURE method${i}()
        value${i} ← ${i}
        OUTPUT "Method ${i}: " + value${i}
    ENDPROCEDURE`;
      }
      
      javaCode += '\n}';
      expected += '\nENDCLASS';
      
      const startTime = Date.now();
      const result = convertJavaToIB(javaCode);
      const endTime = Date.now();
      
      expect(result).toBe(expected);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});