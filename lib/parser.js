var cmd = require('./commader');
var cmp = require('./compiler');
var lnk = require('./linker');

exports.Parser = function (tokens) {
    
    let me = this;
    this.tokens = tokens;
    this.pointer = 0;
    this.line = 1;
    this.error_flag = false;

    this.parse = function(build){
        let build_flag = false;
        if(build !== undefined) build_flag=true;
        let CMD = new cmd.Commander();
        let LNK = new lnk.Linker();
        let token = me.tokens[me.pointer];        
        LNK.include(me.tokens, function(tokens){
            me.tokens = tokens;
            while(me.pointer != me.tokens.length-1)
            {            
                token = me.tokens[me.pointer];
                if(token == 'def'){
                    me.expectTokens(2);
                    me.hasNextToken('proc', 'def type');              
                    me.pointer+=2;
                    CMD.DEF(me.tokens[me.pointer-1], me.tokens[me.pointer], me.pointer);
                    continue;
                }else if(token == 'end'){
                    me.expectTokens(1);
                    me.hasNextToken('proc', 'end type');  
                    me.pointer+=1;
                    CMD.END(me.tokens[me.pointer], me.pointer);
                    continue;
                }else if(token == 'out'){
                    me.expectTokens(1);
                    me.hasNextRegister();
                    me.pointer+=1;
                    CMD.OUT(me.tokens[me.pointer]);
                    continue;
                }else if(token == 'push'){
                    me.expectTokens(1);
                    me.hasNextRegister();
                    me.pointer+=1;
                    CMD.PUSH(me.tokens[me.pointer]);
                    continue;
                }else if(token == 'pop'){
                    me.expectTokens(1);
                    me.hasNextRegister();
                    me.pointer+=1;
                    CMD.POP(me.tokens[me.pointer]);
                    continue;
                }else if(token == 'lbl'){
                    me.expectTokens(1);
                    me.pointer+=1;
                    CMD.LBL(me.tokens[me.pointer]);
                    continue;
                }else if(token == 'goto'){
                    me.expectTokens(1);
                    me.pointer+=1;
                    CMD.GOTO(me.tokens[me.pointer]);
                    continue;
                }else if(token == 'inp'){
                    me.expectTokens(1);
                    me.hasNextRegister();
                    me.pointer+=1;
                    CMD.INP(me.tokens[me.pointer]);
                    continue;
                }else if(token == 'call'){
                    me.expectTokens(1);
                    if(me.tokens[me.pointer+1] == 'nl') me.er('Missing last argument');
                    //let reg = me.tokens[me.pointer+1];
                    // if(reg != 'ax' && reg != 'bx' && reg != 'cx' && reg != 'dx'){
                    //     me.er('Invalid register "' + reg + '", expecting ax, bx, cx or dx');
                    // }
                    me.pointer+=1;
                    CMD.CALL(me.tokens[me.pointer]);
                    continue;
                }else if(token == 'mov'){
                    me.expectTokens(2);
                    me.hasNextRegister();
                    me.pointer+=2;
                    CMD.MOV(me.tokens[me.pointer-1], me.tokens[me.pointer]);
                    continue;
                }else if(token == 'map'){ // move and preserve
                    me.expectTokens(2);
                    me.hasNextRegister();
                    me.pointer+=2;
                    CMD.MAP(me.tokens[me.pointer-1], me.tokens[me.pointer]);
                    continue;
                }else if(token == 'add'){
                    me.expectTokens(3);
                    me.hasNextRegisterOrNumber();
                    me.hasNextRegisterOrNumber(2);
                    me.hasNextRegister(3);
                    me.pointer+=3;
                    CMD.ADD(me.tokens[me.pointer-2], me.tokens[me.pointer-1], me.tokens[me.pointer]);
                    continue;
                }else if(token == 'sub'){
                    me.expectTokens(3);
                    me.hasNextRegisterOrNumber();
                    me.hasNextRegisterOrNumber(2);
                    me.hasNextRegister(3);
                    me.pointer+=3;
                    CMD.SUB(me.tokens[me.pointer-2], me.tokens[me.pointer-1], me.tokens[me.pointer]);
                    continue;
                }else if(token == 'mul'){
                    me.expectTokens(3);
                    me.hasNextRegisterOrNumber();
                    me.hasNextRegisterOrNumber(2);
                    me.hasNextRegister(3);
                    me.pointer+=3;
                    CMD.MUL(me.tokens[me.pointer-2], me.tokens[me.pointer-1], me.tokens[me.pointer]);
                    continue;
                }else if(token == 'div'){
                    me.expectTokens(3);
                    me.hasNextRegisterOrNumber();
                    me.hasNextRegisterOrNumber(2);
                    me.hasNextRegister(3);
                    me.pointer+=3;
                    CMD.DIV(me.tokens[me.pointer-2], me.tokens[me.pointer-1], me.tokens[me.pointer]);
                    continue;
                }else if(token == 'cmp'){
                    me.expectTokens(3);
                    //me.hasNextRegisterOrNumber();
                    //me.hasNextRegisterOrNumber(2);
                    //me.hasNextRegister(3); // can add hasNextLabel later
                    me.pointer+=3;
                    CMD.CMP(me.tokens[me.pointer-2], me.tokens[me.pointer-1], me.tokens[me.pointer]);
                    continue;
                }else if(token == 'nl'){
                    me.line++;
                    me.pointer++;
                    continue;
                }else{
                    me.pointer++;
                }
            }

            if(!me.error_flag && !build_flag){
                //console.log('@Parser done');
                //console.log(JSON.stringify(CMD.get()));
                let CMP = new cmp.Compiler(CMD.get());
                CMP.compile('main'); // default method to be compiled
            }

            if(build_flag){
                let buildBuff = JSON.stringify(CMD.get());
                buildBuff = Buffer.from(buildBuff).toString('base64');
                const fs = require('fs');
                fs.writeFile("build.f", buildBuff, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("Build generated.");
                }); 
            }

        }); // attach external .a file tokens as well        
    }

    this.er = function(message){
        console.log('LINE ' + me.line + ': ' + message);
        me.error_flag = true;
    }

    this.expectTokens = function(count){
        if(me.pointer+parseInt(count) > (parseInt(me.tokens.length-1))){
            me.er('Incomplete command!');
        }
        if(me.tokens[me.pointer+count] == 'nl') me.er('Missing last argument');
    }

    this.hasNextRegister = function(count){
        let step = 1;
        if(count != undefined){
            step = count;
        }
        let token = me.tokens[me.pointer+parseInt(step)];
        if(token != 'ax' && token != 'bx' && token != 'cx' && token != 'dx'){
            me.er('Invalid register "' + token + '", expecting ax, bx, cx or dx');
        }
    }

    this.hasNextRegisterOrNumber = function(count){
        let step = 1;
        if(count != undefined){
            step = count;
        }
        let token = me.tokens[me.pointer+parseInt(step)];
        if(token != 'ax' && token != 'bx' && token != 'cx' && token != 'dx' && isNaN(token)){
            me.er('Invalid register "' + token + '", expecting ax, bx, cx or dx');
        }
    }

    this.hasNextToken = function(name, forToken){
        let token = me.tokens[me.pointer+1];
        if(token != name){
            me.er('Invalid ' + forToken + ' "' + token + '", expeting "' + name + '"');
        } 
    }

};