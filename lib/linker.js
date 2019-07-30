var tokenizer = require('./tokenizer');

exports.Linker = function () {
    
    let me = this;
    
    this.include = function(tokens, callback){
        let found = 0;
        let tokenized = 0;
        let ptr = 0;
        let token = tokens[ptr];
        let _t = new tokenizer.Tokenizer();
        while(ptr != tokens.length-1)
        {
            token = tokens[ptr];
            if(token == 'inc'){                      
                found++;     
                ptr+=1;
                console.log('@LINK ' + tokens[ptr] + '.a');
                _t.readFileContents('./' + tokens[ptr] + '.a', function(contents){
                    let newTokens = _t.tokenize(contents);
                    tokens = tokens.concat(newTokens);
                    tokenized++;
                    console.log('linked.');
                });
                continue;
            }else{
                ptr++;
            }
        }
        let timer = setInterval(function(){            
            if(found == tokenized){
                clearInterval(timer);
                callback(tokens);
            }else{
                console.log('linking ...');
            }
        }, 1);        
    }

};