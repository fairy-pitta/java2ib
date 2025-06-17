import { convertJavaToIB, Parser, Emitter } from './dist/index.js';

try {
  const javaCode = 'int x = 5;';
  console.log('Input:', javaCode);
  
  console.log('Testing Parser...');
  const parser = new Parser();
  const parseResult = parser.parse(javaCode);
  console.log('Parse result:', parseResult);
  
  console.log('Testing convertJavaToIB...');
  const result = convertJavaToIB(javaCode);
  console.log('Output:', result);
  console.log('Output length:', result.length);
  console.log('Output type:', typeof result);
} catch (error) {
  console.error('Error:', error.message || error);
  console.error('Stack:', error.stack);
}