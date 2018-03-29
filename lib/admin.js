
"use strict";

var utils = require('./utils/utils.js');

/**
 * Admin API constructor.
 * Class encapsulate methods for admin APIs commands.
 * @see [Admin API documentation:]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md}.
 * @constructor
 *
 * @param {Neb} neb - Instance of Neb library.
 *
 * @example
 * var admin = new Admin( new Neb() );
 * // or just
 * var admin = new Neb().admin;
 */
var Admin = function (neb) {
    this._setRequest(neb._request);
};

/**
 * @private
 * @param {Request} request - transport wrapper.
 */
Admin.prototype._setRequest = function (request) {
    this._request = request;
    this._path = '/admin';
};

/**
 * Method get info about nodes in Nebulas Network.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#nodeinfo}
 *
 * @return [nodeInfoObject]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#nodeinfo}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.nodeInfo().then(function(info) {
 * //code
 * });
 */
Admin.prototype.nodeInfo = function () {
    return this._sendRequest("get", "/nodeinfo", null);
};

/**
 * Method get list of available addresses.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#accounts}
 *
 * @return [accountsList]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#accounts}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.accounts().then(function(accounts) {
 * //code
 * });
 */
Admin.prototype.accounts = function () {
    return this._sendRequest("get", "/accounts", null);
};

/**
 * Method create a new account in Nebulas network with provided passphrase.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#newaccount}
 *
 * @param {Object} options
 * @param {Password} options.passphrase
 *
 * @return [address]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#newaccount}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.newAccount({passphrase: "passphrase"}).then(function(address) {
 * //code
 * });
 */
Admin.prototype.newAccount = function (options) {
    options = utils.argumentsToObject(['passphrase'], arguments);
    var params = { "passphrase": options.passphrase };
    return this._sendRequest("post", "/account/new", params);
};

/**
 * Method unlock account with provided passphrase.
 * After the default unlock time, the account will be locked.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#unlockaccount}
 *
 * @param {Object} options
 * @param {HexString} options.address
 * @param {Password} options.passphrase
 * @param {Number} options.duration
 *
 * @return [isUnLocked]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#unlockaccount}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.unlockAccount({
 *     address: "n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh",
 *     passphrase: "passphrase",
 *     duration: 1000000000
 * }).then(function(isUnLocked) {
 * //code
 * });
 */
Admin.prototype.unlockAccount = function (options) {
    options = utils.argumentsToObject(['address', 'passphrase', 'duration'], arguments);
    var params = {
        "address": options.address,
        "passphrase": options.passphrase,
        "duration": options.duration
    };
    return this._sendRequest("post", "/account/unlock", params);
};

/**
 * Method lock account.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#lockaccount}
 *
 * @param {Object} options
 * @param {HexString} options.address
 *
 * @return [isLocked]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#lockaccount}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.lockAccount({address: "n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh"}).then(function(isLocked) {
 * //code
 * });
 */
Admin.prototype.lockAccount = function (options) {
    options = utils.argumentsToObject(['address'], arguments);
    var params = { "address": options.address };
    return this._sendRequest("post", "/account/lock", params);
};

/**
 * Method wrap transaction sending functionality.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransaction}
 *
 * @param {TransactionOptions} options
 *
 * @return [Transcation hash and contract address]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransaction}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.sendTransaction({
 *    from: "n1QZMXSZtW7BUerroSms4axNfyBGyFGkrh5",
 *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
 *    value: 10,
 *    nonce: 12,
 *    gasPrice: 1000000,
 *    gasLimit: 2000000
 * }).then(function(tx) {
 * //code
 * });
 */
Admin.prototype.sendTransaction = function (options) {
    options = utils.argumentsToObject(['from', 'to', 'value', 'nonce', 'gasPrice', 'gasLimit', 'contract', 'binary'], arguments);
    var params = {
        "from": options.from,
        "to": options.to,
        "value": utils.toString(options.value),
        "nonce": options.nonce,
        "gasPrice": utils.toString(options.gasPrice),
        "gasLimit": utils.toString(options.gasLimit),
        "contract": options.contract,
        "binary": options.binary
    };
    return this._sendRequest("post", "/transaction", params);
};

/**
 * Method sign hash.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signhash}
 *
 * @param {Object} options
 * @param {HexString} options.address
 * @param {Base64} options.hash of hash bytes with base64 encode.
 * @param {UInt32} options.alg
 *
 * @return [data]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signhash}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.SignHash({
 *     address: "n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh",
 *     hash: "OGQ5NjllZWY2ZWNhZDNjMjlhM2E2MjkyODBlNjg2Y2YwYzNmNWQ1YTg2YWZmM2NhMTIwMjBjOTIzYWRjNmM5Mg==",
 *     alg: 1
 * }).then(function(data) {
 * //code
 * });
 */
Admin.prototype.signHash = function (options) {
   options = utils.argumentsToObject(['address', 'hash', 'alg'], arguments);
    var params = {
        "address": options.address,
        "hash": options.hash,
        "alg": options.alg
    };
    return this._sendRequest("post", "/sign/hash", params);
};

/**
 * Method sign transaction with passphrase.
 * The transaction's from addrees must be unlock before sign call.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signtransactionwithpassphrase}
 *
 * @param {TransactionOptions} options
 * @param {Password} options.passphrase
 *
 * @return [Transcation hash and contract address]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signtransactionwithpassphrase}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.signTransactionWithPassphrase({
 *    from: "n1QZMXSZtW7BUerroSms4axNfyBGyFGkrh5",
 *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
 *    value: 10,
 *    nonce: 12,
 *    gasPrice: 1000000,
 *    gasLimit: 2000000,
 *    passphrase: "passphrase"
 * }).then(function(tx) {
 * //code
 * });
 */
Admin.prototype.signTransactionWithPassphrase = function (options) {
    options = utils.argumentsToObject(['from', 'to', 'value', 'nonce', 'gasPrice', 'gasLimit', 'contract', 'binary', 'passphrase'], arguments);
    var tx = {
        "from": options.from,
        "to": options.to,
        "value": utils.toString(options.value),
        "nonce": options.nonce,
        "gasPrice": utils.toString(options.gasPrice),
        "gasLimit": utils.toString(options.gasLimit),
        "contract": options.contract,
        "binary": options.binary
    };
    var params = {
        "transaction": tx,
        "passphrase": options.passphrase
    };
    return this._sendRequest("post", "/sign", params);
};

/**
 * Method send transaction with passphrase.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransactionwithpassphrase}
 *
 * @param {TransactionOptions} options
 * @param {Password} options.passphrase
 *
 * @return [data]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransactionwithpassphrase}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.sendTransactionWithPassphrase({
 *    from: "n1QZMXSZtW7BUerroSms4axNfyBGyFGkrh5",
 *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
 *    value: 10,
 *    nonce: 12,
 *    gasPrice: 1000000,
 *    gasLimit: 2000000,
 *    passphrase: "passphrase"
 * }).then(function(tx) {
 * //code
 * });
 */
Admin.prototype.sendTransactionWithPassphrase = function (options) {
    options = utils.argumentsToObject(['from', 'to', 'value', 'nonce', 'gasPrice', 'gasLimit', 'contract', 'binary', 'passphrase'], arguments);
    var tx = {
        "from": options.from,
        "to": options.to,
        "value": utils.toString(options.value),
        "nonce": options.nonce,
        "gasPrice": utils.toString(options.gasPrice),
        "gasLimit": utils.toString(options.gasLimit),
        "contract": options.contract,
        "binary": options.binary
    };
    var params = {
        "transaction": tx,
        "passphrase": options.passphrase
    };
    return this._sendRequest("post", "/transactionWithPassphrase", params);
};

/**
 * Method start listen provided port.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#startpprof}
 *
 * @param {Object} options
 * @param {String} options.listen - Listen port.
 *
 * @return [isListenStrted]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#startpprof}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.startPprof({listen: '8080'}).then(function(isListenStrted) {
 * //code
 * });
 */
Admin.prototype.startPprof = function (options) {
    options = utils.argumentsToObject(['listen'], arguments);
    var params = { "listen": options.listen };
    return this._sendRequest("post", "/pprof", params);
};

/**
 * Method get config of node in Nebulas Network.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#getConfig}
 *
 * @return [config]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#getConfig}
 *
 * @example
 * var admin = new Neb().admin;
 * admin.getConfig().then(function(info) {
 * //code
 * });
 */
Admin.prototype.getConfig = function () {
    return this._sendRequest("get", "/getConfig", null);
};

Admin.prototype._sendRequest = function (method, api, params, callback) {
    var action = this._path + api;
    if (typeof callback === "function") {
        return this._request.asyncRequest(method, action, params, callback);
    } else {
        return this._request.request(method, action, params);
    }
};

module.exports = Admin;
