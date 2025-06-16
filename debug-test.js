const { convertJavaToIB } = require('./src/index.ts');

console.log('Testing basic conversion:');
const result = convertJavaToIB('int x = 5;');
console.log('Input: int x = 5;');
console.log('Output:', result);
console.log('Expected: X = 5');
console.log('Match:', result === 'X = 5');