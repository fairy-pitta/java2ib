const { Lexer } = require('./dist/lexer');
const { Parser } = require('./dist/parser');
const { ASTTransformer } = require('./dist/transformer');

function debugTransform(code) {
  console.log('Input code:', code);
  
  const lexer = new Lexer(code);
  const { tokens, errors: lexErrors } = lexer.tokenize();
  
  console.log('Tokens:', tokens.map(t => `${t.type}:${t.value}`));
  console.log('Lex errors:', lexErrors);
  
  const parser = new Parser(tokens);
  const { ast, errors: parseErrors } = parser.parse();
  
  console.log('AST:', JSON.stringify(ast, null, 2));
  console.log('Parse errors:', parseErrors);
  
  if (ast) {
    const transformer = new ASTTransformer();
    const { pseudocodeAST, errors: transformErrors } = transformer.transform(ast);
    
    console.log('Pseudocode AST:', JSON.stringify(pseudocodeAST, null, 2));
    console.log('Transform errors:', transformErrors);
    
    const result = pseudocodeAST.map(node => node.content).join('\n');
    console.log('Final result:', result);
  }
}

debugTransform('i++;');