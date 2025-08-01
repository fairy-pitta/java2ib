const { JavaToIBConverter } = require('./dist/index.js');

const converter = new JavaToIBConverter();

const javaCode = `
  boolean found = false;
  int target = 15;
  int[] grid;
  int foundRow = -1;
  int foundCol = -1;
  
  for (int row = 0; row < 3 && !found; row++) {
    for (int col = 0; col < 3; col++) {
      if (grid[row] == target) {
        found = true;
        foundRow = row;
        foundCol = col;
      }
    }
  }
  
  if (found) {
    System.out.println("Found " + target + " at position [" + foundRow + "][" + foundCol + "]");
  } else {
    System.out.println("Target not found");
  }
`;

const result = converter.convert(javaCode);

console.log('Success:', result.success);
console.log('Errors:', result.errors);
if (!result.success) {
  console.log('Pseudocode:', result.pseudocode);
}