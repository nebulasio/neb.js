"use strict";

var block = {
    timestamp: 0,
    height: 1,
    seed: "s"
};

var transaction = {
    hash: "",
    from: "",
    to: "",
    value: "0",
    nonce: 1,
    timestamp: 0,
    gasPrice: "0",
    gasLimit: "0"
};

var state = function() {
};

module.exports = {
    block: block,
    transaction: transaction,
    state: state
};