
var tokenizer = require('./tokenizer');

exports.Commander = function () {

    let me = this;

    this.METHOD_TREE = [];
    this.TMP_METHOD = {
        name: '',
        start: 0,
        end: 0,
        code: []
    };

    this.get = function(){
        return me.METHOD_TREE;
    }

    this.DEF = function(v1, v2, pointer){
        if(v1 == 'proc'){
            me.TMP_METHOD.name = v2;
            me.TMP_METHOD.start = pointer
        }
    }

    this.MOV = function(v1, v2){
        me.TMP_METHOD.code.push({command: 'mov', to: v1, from: v2});
    }

    this.ADD = function(v1, v2, v3){
        me.TMP_METHOD.code.push({command: 'add', to: v3, num1: v1, num2: v2});
    }

    this.SUB = function(v1, v2, v3){
        me.TMP_METHOD.code.push({command: 'sub', to: v3, num1: v1, num2: v2});
    }

    this.MUL = function(v1, v2, v3){
        me.TMP_METHOD.code.push({command: 'mul', to: v3, num1: v1, num2: v2});
    }

    this.DIV = function(v1, v2, v3){
        me.TMP_METHOD.code.push({command: 'div', to: v3, num1: v1, num2: v2});
    }

    this.OUT = function(v1){
        me.TMP_METHOD.code.push({command: 'out', from: v1});
    }

    this.LBL = function(v1){
        me.TMP_METHOD.code.push({command: 'lbl', name: v1});
    }

    this.GOTO = function(v1){
        me.TMP_METHOD.code.push({command: 'goto', name: v1});
    }

    this.INP = function(v1){
        me.TMP_METHOD.code.push({command: 'inp', to: v1});        
    }

    this.CALL = function(v1){
        me.TMP_METHOD.code.push({command: 'call', method: v1});
    }

    this.END = function(v1, pointer){
        if(v1 == 'proc'){
            me.TMP_METHOD.end = pointer
            me.METHOD_TREE.push(me.TMP_METHOD);
            me.TMP_METHOD = {
                name: '',
                start: 0,
                end: 0,
                code: []
            };
        }
    }

};