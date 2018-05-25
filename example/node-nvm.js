"use strict";

var fs = require("fs");
var path = require("path");

var NVM = require("../lib/nvm/nvm");

var block = {
    timestamp: 0,
    height: 1
};

var transaction = {
    hash: "2933836c3a56ddd789464c7bd3fd92bdb1c974ac62f7b38a34bc48eb33679f52",
    from: "n1dAmstUGQ3YB4EVokmRdrvvVCNfJVU5WuS",
    to: "n1dAmstUGQ3YB4EVokmRdrvvVCNfJVU5WuS",
    value: "10",
    nonce: 1,
    timestamp: 1527077193,
    gasPrice: "1000000",
    gasLimit: "20000"
};

var path = path.join(__dirname, "./bank_vault_contract.js");
var smartContract = fs.readFileSync(path, "utf-8");

var nvm = new NVM(block, transaction);
// console.log("contract:", smartContract);
var deploy = nvm.deploy(smartContract, "[]");
console.log("deploy:", deploy);

var result = nvm.call(smartContract, "save", "[1]");
console.log("call:", result);

