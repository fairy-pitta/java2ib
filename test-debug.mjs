import { convertJavaToIB } from './dist/index.js';

console.log('=== Test Debug ===');

const testCases = [
  {
    name: 'Simple variable assignment',
    input: 'int x = 5;',
    expected: 'X ← 5'
  },
  {
    name: 'String assignment',
    input: 'String name = "John";',
    expected: 'NAME ← "John"'
  },
  {
    name: 'Boolean assignment',
    input: 'boolean flag = true;',
    expected: 'FLAG ← true'
  }
];

for (const testCase of testCases) {
  console.log(`\n--- ${testCase.name} ---`);
  console.log(`Input: ${testCase.input}`);
  
  try {
    const actual = convertJavaToIB(testCase.input);
    console.log(`Actual: "${actual}"`);
    console.log(`Expected: "${testCase.expected}"`);
    console.log(`Match: ${actual === testCase.expected}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(`Stack: ${error.stack}`);
  }
}