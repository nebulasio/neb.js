"use strict";

var extend = require('extend');
var native = require("./native");

var funcRegex = new RegExp("^[a-zA-Z$][A-Za-z0-9_$]*$");

var NVM = function (block, transaction) {
    extend(native.context.block, block);
    extend(native.context.transaction, transaction);
    // console.log("block:", native.context.block);
    // console.log("tx:", native.context.transaction);
};

NVM.prototype = {
    deploy: function(source, args) {
        return this.run(source, "init", args);
    },
    call: function(source, func, args) {
        if (funcRegex.test(func)) {
            return this.run(source, func, args);
        } else {
            throw new Error("invalid func");
        }
    },
    run: function(source, func, args) {
        Blockchain.blockParse(JSON.stringify(native.context.block));
        Blockchain.transactionParse(JSON.stringify(native.context.transaction));
        var Contract = eval(source);
        // console.log("contract:", Contract);
        var contract = new Contract();
        if (args === undefined || args.length === 0) {
            args = "[]";
        }
        if (contract[func] != undefined) {
            return contract[func].apply(contract, JSON.parse(args));
        } else {
            throw new Error("function not found");
        }
    }
};

module.exports = NVM;