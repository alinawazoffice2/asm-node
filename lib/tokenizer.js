var fs = require('fs');

exports.Tokenizer = function () {
    
    this.readFileContents = function(filename, callback){
        fs.readFile(filename, "utf8", function(err, data) {
            callback(data);
        });
    }

    this.tokenize = function(contents){
        let tokens = contents.split(' ');
        let temp_arr = [];
        tokens.forEach(token => {
            let temp = token.replace('\t', '').split('\r\n');            
            if(temp.length>1){                
                temp.splice(1, 0, "nl");
                temp.forEach(t => {
                    if(t != '')
                        temp_arr.push(t);
                });
            }else{
                if(temp[0] != '')
                    temp_arr.push(temp[0]);
            }
        });
        return temp_arr;
    }

};