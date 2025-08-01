const { JavaToIBConverter } = require('./dist/index.js');

const converter = new JavaToIBConverter();

// Test switch statement
console.log('=== Testing Switch Statement ===');
const switchCode = `
  switch (grade) {
    case 'A':
      System.out.println("Excellent");
      break;
    default:
      System.out.println("Try harder");
  }
`;

const switchResult = converter.convert(switchCode);
console.log('Success:', switchResult.success);
console.log('Errors:', switchResult.errors);
console.log('Pseudocode:', switchResult.pseudocode);

console.log('\n=== Testing Enhanced For Loop ===');
const forCode = `for (String name : names) { System.out.println(name); }`;

try {
  const forResult = converter.convert(forCode);
  console.log('Success:', forResult.success);
  console.log('Errors:', forResult.errors);
  console.log('Pseudocode:', forResult.pseudocode);
} catch (error) {
  console.log('Exception:', error.message);
  console.log('Stack:', error.stack);
}

console.log('\n=== Testing Complex Switch ===');
const complexSwitchCode = `
  switch (operation) {
    case "sum":
      int total = 0;
      for (int num : numbers) {
        total += num;
      }
      System.out.println("Sum: " + total);
      break;
    case "average":
      int sum = 0;
      for (int num : numbers) {
        sum += num;
      }
      System.out.println("Average: " + (sum / numbers.length));
      break;
    default:
      System.out.println("Unknown operation");
  }
`;

try {
  const complexSwitchResult = converter.convert(complexSwitchCode);
  console.log('Success:', complexSwitchResult.success);
  console.log('Errors:', complexSwitchResult.errors);
  console.log('Pseudocode:', complexSwitchResult.pseudocode);
} catch (error) {
  console.log('Exception:', error.message);
  console.log('Stack:', error.stack);
}