"use strict";

var Account = require("../../account");

var transfer = function(to, value) {
    // TODO: mock the transfer func in nebulas 
    return 0;
};

var verifyAddress = function(address) {
    return Account.isValidAddress(address);
};

module.exports = {
    transfer: transfer,
    verifyAddress: verifyAddress
};