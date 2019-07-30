exports.Compiler = function (tree) {

    let me = this;
    
    this.AX = '';
    this.BX = '';
    this.CX = '';
    this.DX = '';

    this.labels = [];

    this.isRegister = function(v){
        if(v == 'ax' || v == 'bx' || v == 'cx' || v == 'dx') return true;
        return false;
    }

    this.getRegister = function(name){
        if(!me.isRegister(name)){
            console.log('CRITICAL: expecting "'+name+'" to be a register i.e ax, bx, cx or dx');
            return;
        }
        if(name == 'ax') return me.AX;
        if(name == 'bx') return me.BX;
        if(name == 'cx') return me.CX;
        if(name == 'dx') return me.DX;
    }

    this.setRegister = function(name, value){
        if(!me.isRegister(name)){
            console.log('CRITICAL: expecting "'+name+'" to be a register i.e ax, bx, cx or dx');
            return;
        }
        if(name == 'ax') me.AX = value;
        if(name == 'bx') me.BX = value;
        if(name == 'cx') me.CX = value;
        if(name == 'dx') me.DX = value;
    }

    this.compile = function(startup_method_name){
        let found = false;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            //console.log(node);       
            if(node.name == startup_method_name){
                found = true;
                console.log('@OUTPUT f{' + node.name +'}');
                let code_blocks = node.code;
                for (let j = 0; j < code_blocks.length; j++) {
                    let block = code_blocks[j];
                    //console.log('TRACK: ', j, code_blocks[j]);
                    
                    if(block.command == 'mov'){
                        if(me.isRegister(block.from)){
                            me.setRegister(block.to, me.getRegister(block.from));
                        }else{
                            me.setRegister(block.to, block.from);
                        }
                    }

                    if(block.command == 'add'){
                        if(me.isRegister(block.num1) && me.isRegister(block.num2)){
                            me.setRegister(block.to, parseInt(me.getRegister(block.num1)) + parseInt(me.getRegister(block.num2)));
                        } else if(me.isRegister(block.num1)){
                            me.setRegister(block.to, parseInt(me.getRegister(block.num1)) + parseInt(block.num2));
                        } else if(me.isRegister(block.num2)){
                            me.setRegister(block.to, parseInt(block.num1) + parseInt(me.getRegister(block.num2)));
                        }else{
                            me.setRegister(block.to, parseInt(block.num1) + parseInt(block.num2));
                        }
                    }

                    if(block.command == 'sub'){
                        if(me.isRegister(block.num1) && me.isRegister(block.num2)){
                            me.setRegister(block.to, parseInt(me.getRegister(block.num1)) - parseInt(me.getRegister(block.num2)));
                        } else if(me.isRegister(block.num1)){
                            me.setRegister(block.to, parseInt(me.getRegister(block.num1)) - parseInt(block.num2));
                        } else if(me.isRegister(block.num2)){
                            me.setRegister(block.to, parseInt(block.num1) - parseInt(me.getRegister(block.num2)));
                        }else{
                            me.setRegister(block.to, parseInt(block.num1) - parseInt(block.num2));
                        }
                    }

                    if(block.command == 'mul'){
                        if(me.isRegister(block.num1) && me.isRegister(block.num2)){
                            me.setRegister(block.to, parseInt(me.getRegister(block.num1)) * parseInt(me.getRegister(block.num2)));
                        } else if(me.isRegister(block.num1)){
                            me.setRegister(block.to, parseInt(me.getRegister(block.num1)) * parseInt(block.num2));
                        } else if(me.isRegister(block.num2)){
                            me.setRegister(block.to, parseInt(block.num1) * parseInt(me.getRegister(block.num2)));
                        }else{
                            me.setRegister(block.to, parseInt(block.num1) * parseInt(block.num2));
                        }
                    }

                    if(block.command == 'div'){
                        if(me.isRegister(block.num1) && me.isRegister(block.num2)){
                            me.setRegister(block.to, parseInt(me.getRegister(block.num1)) / parseInt(me.getRegister(block.num2)));
                        } else if(me.isRegister(block.num1)){
                            me.setRegister(block.to, parseInt(me.getRegister(block.num1)) / parseInt(block.num2));
                        } else if(me.isRegister(block.num2)){
                            me.setRegister(block.to, parseInt(block.num1) / parseInt(me.getRegister(block.num2)));
                        }else{
                            me.setRegister(block.to, parseInt(block.num1) / parseInt(block.num2));
                        }
                    }

                    if(block.command == 'out'){
                        if(me.isRegister(block.from)){
                            console.log(me.getRegister(block.from));
                        }else{
                            console.log(block.from);
                        }
                    }                                       

                    if(block.command == 'inp'){
                        if(me.isRegister(block.to)){
                            let content = '';
                            // const stdin = process.openStdin();
                            // stdin.addListener('data', d => {
                            //     content += d.toString();
                            // });
                            var readline = require('readline-sync');
                            var name = readline.question(">");
                            me.setRegister(block.to, name);
                            // me.setRegister(block.to, content);
                            // const rl = require('readline').createInterface({
                            //     input: process.stdin,
                            //     output: process.stdout
                            // })  
                            // rl.setPrompt(">");      
                            // rl.prompt();
                            // rl.on('line', function(line) {
                            //     me.setRegister(block.to, line);
                            //     //rl.close();
                            // });
                        }else{
                            console.log('CRITICAL: cannot take input in constant.');
                        }
                    }

                    if(block.command == 'call'){
                        me.compile(block.method);
                    }

                    if(block.command == 'lbl'){
                        me.labels.push({
                            name: block.name,
                            line: j
                        });
                    } 

                    if(block.command == 'goto'){
                        for (let k = 0; k < me.labels.length; k++) {
                            const lbl = me.labels[k];
                            if(lbl.name == block.name){
                                j = lbl.line-1;
                                break;
                            }
                        }
                    }

                }
            }
        }
        if(!found){
            console.log('CRITICAL: call to an undefined procedure "' + startup_method_name + '"');
        }
    }

};