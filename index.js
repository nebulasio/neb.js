var HttpRequest = require("./lib/httprequest");
var Neb = require('./lib/neb');
var Account = require('./lib/account');
var Transaction = require('./lib/transaction');
var Utils = require('./lib/utils/utils');
var CryptoUtils = require('./lib/utils/crypto-utils');
var Unit = require('./lib/utils/unit');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Neb === 'undefined') {
    window.Neb = Neb;
}

module.exports = {
	HttpRequest: HttpRequest,
    Neb: Neb,
    Account: Account,
    Transaction: Transaction,
    Utils: Utils,
    CryptoUtils: CryptoUtils,
    Unit: Unit
};
