var tokenizer = require('./lib/tokenizer');
var parser = require('./lib/parser');
var cmp = require('./lib/compiler');
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
    case 'build':
        Tokenizer.readFileContents('main.a', function(contents){
            //console.log(contents);
            let tokens = Tokenizer.tokenize(contents);
            let Parser = new parser.Parser(tokens);
            Parser.parse(true); // for build
        });
        break;
    case 'run':
        Tokenizer.readFileContents('build.f', function(contents){
            let buildBuff = Buffer.from(contents, 'base64').toString('ascii');
            buildTree = JSON.parse(buildBuff);
            let CMP = new cmp.Compiler(buildTree);
            CMP.compile('main');
        });
        break;
}