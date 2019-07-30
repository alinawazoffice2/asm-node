var tokenizer = require('./lib/tokenizer');
var parser = require('./lib/parser');
var Tokenizer = new tokenizer.Tokenizer();

var args = process.argv.slice(2);

switch (args[0]) {
    case 'compile':
    Tokenizer.readFileContents('main.a', function(contents){
        //console.log(contents);
        let tokens = Tokenizer.tokenize(contents);
        let Parser = new parser.Parser(tokens);
        Parser.parse();
    });
    break;
}