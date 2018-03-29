
"use strict";

var utils = require('./utils/utils.js');

/**
 * Admin API constructor.
 * Class encapsulate methods for admin APIs commands.
 * API documentation: {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md}.
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
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [nodeInfoObject]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#nodeinfo}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var info = admin.nodeInfo();
 * //async
 * admin.nodeInfo(function(info) {
 * //code
 * });
 */
Admin.prototype.nodeInfo = function () {
    var options = utils.argumentsToObject(['callback'], arguments);
    return this._sendRequest("get", "/nodeinfo", null, options.callback);
};

/**
 * Method get list of available addresses.
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [accountsList]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#accounts}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var accounts = admin.accounts();
 * //async
 * admin.accounts(function(accounts) {
 * //code
 * });
 */
Admin.prototype.accounts = function () {
    var options = utils.argumentsToObject(['callback'], arguments);
    return this._sendRequest("get", "/accounts", null, options.callback);
};

/**
 * Method create a new account in Nebulas network with provided passphrase.
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#newaccount}
 *
 * @param {String} passphrase
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [address]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#newaccount}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var address = admin.newAccount("passphrase");
 * //async
 * admin.newAccount("passphrase", function(address) {
 * //code
 * });
 */
Admin.prototype.newAccount = function () {
    var options = utils.argumentsToObject(['passphrase', 'callback'], arguments);
    var params = { "passphrase": options.passphrase };
    return this._sendRequest("post", "/account/new", params, options.callback);
};

/**
 * Method unlock account with provided passphrase.
 * After the default unlock time, the account will be locked.
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#unlockaccount}
 *
 * @param {String} address
 * @param {String} passphrase
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [address]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#unlockaccount}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var isUnLocked = admin.unlockAccount("n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh", "passphrase");
 * //async
 * admin.unlockAccount("n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh", "passphrase", function(isUnLocked) {
 * //code
 * });
 */
Admin.prototype.unlockAccount = function () {
    var options = utils.argumentsToObject(['address', 'passphrase', 'callback'], arguments);
    var params = {
        "address": options.address,
        "passphrase": options.passphrase
    };
    return this._sendRequest("post", "/account/unlock", params, options.callback);
};

/**
 * Method lock account.
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#lockaccount}
 *
 * @param {String} address
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [address]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#lockaccount}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var isLocked = admin.lockAccount("n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh");
 * //async
 * admin.lockAccount("n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh", function(isLocked) {
 * //code
 * });
 */
Admin.prototype.lockAccount = function () {
    var options = utils.argumentsToObject(['address', 'callback'], arguments);
    var params = { "address": options.address };
    return this._sendRequest("post", "/account/lock", params, options.callback);
};

/**
 * Method wrap transaction sending functionality.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransaction}
 *
 * @param {String} from
 * @param {String} to
 * @param {Number|Sting} value
 * @param {Number} nonce
 * @param {Number|String} gasPrice
 * @param {Number|String} gasLimit
 * @param {Object} [contract]
 * @param {String} [binary]
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [Transcation hash and contract address]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransaction}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var tx = admin.sendTransaction(
 *     "n1QsosVXKxiV3B4iDWNmxfN4VqpHn2TeUcn",
 *     "n1Lf5VcZQnzBc69iANxLTBqmojCeMFKowoM",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000"
 * );
 * //async
 * admin.sendTransaction(
 *     "n1QsosVXKxiV3B4iDWNmxfN4VqpHn2TeUcn",
 *     "n1Lf5VcZQnzBc69iANxLTBqmojCeMFKowoM",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000",
 *     null, null,
 *     function(tx) {
 *          //code
 *     }
 * );
 */
Admin.prototype.sendTransaction = function () {
    var options = utils.argumentsToObject(['from', 'to', 'value', 'nonce', 'gasPrice', 'gasLimit', 'contract', 'binary', 'callback'], arguments);
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
    return this._sendRequest("post", "/transaction", params, options.callback);
};

/**
 * Method sign hash.
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signhash}
 *
 * @param {String} address
 * @param {string} string of hash bytes with base64 encode.
 * @param {uint32} alg
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [data]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signhash}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var data = admin.SignHash("n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh", "OGQ5NjllZWY2ZWNhZDNjMjlhM2E2MjkyODBlNjg2Y2YwYzNmNWQ1YTg2YWZmM2NhMTIwMjBjOTIzYWRjNmM5Mg==", 1);
 * //async
 * admin.SignHash("n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh", "OGQ5NjllZWY2ZWNhZDNjMjlhM2E2MjkyODBlNjg2Y2YwYzNmNWQ1YTg2YWZmM2NhMTIwMjBjOTIzYWRjNmM5Mg==", 1, function(isLocked) {
 * //code
 * });
 */
Admin.prototype.signHash = function () {
   var options = utils.argumentsToObject(['address', 'hash', 'alg', 'callback'], arguments);
    var params = {
        "address": options.address,
        "hash": options.hash,
        "alg": options.alg
    };
    return this._sendRequest("post", "/sign/hash", params, options.callback);
};

/**
 * Method sign transaction with passphrase.
 * The transaction's from addrees must be unlock before sign call.
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signtransactionwithpassphrase}
 *
 * @param {String} from
 * @param {String} to
 * @param {Number|Sting} value
 * @param {Number} nonce
 * @param {Number|String} gasPrice
 * @param {Number|String} gasLimit
 * @param {Object} [contract]
 * @param {String} [binary]
 * @param {String} passphrase
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [data]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signtransactionwithpassphrase}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var data = admin.signTransactionWithPassphrase(
 *     "n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh",
 *     "n1dYu2BXgV3xgUh8LhZu8QDDNr15tz4hVDv",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000"
 *     null, null,
 *     "passphrase"
 * );
 * //async
 * admin.signTransactionWithPassphrase(
 *     "n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh",
 *     "n1dYu2BXgV3xgUh8LhZu8QDDNr15tz4hVDv",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000",
 *     null, null,
 *     "passphrase"
 *     function(data) {
 *          //code
 *     }
 * );
 */
Admin.prototype.signTransactionWithPassphrase = function () {
    var options = utils.argumentsToObject(['from', 'to', 'value', 'nonce', 'gasPrice', 'gasLimit', 'contract', 'binary', 'passphrase', 'callback'], arguments);
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
    return this._sendRequest("post", "/sign", params, options.callback);
};

/**
 * Method send transaction with passphrase.
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransactionwithpassphrase}
 *
 * @param {String} from
 * @param {String} to
 * @param {Number|Sting} value
 * @param {Number} nonce
 * @param {Number|String} gasPrice
 * @param {Number|String} gasLimit
 * @param {Object} [contract]
 * @param {String} [binary]
 * @param {String} [passphrase]
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [data]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#sendtransactionwithpassphrase}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var data = admin.sendTransactionWithPassphrase(
 *     "n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh",
 *     "n1dYu2BXgV3xgUh8LhZu8QDDNr15tz4hVDv",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000",
 *     null, null,
 *     "passphrase"
 * );
 * //async
 * admin.sendTransactionWithPassphrase
 *     "n1cYKNHTeVW9v1NQRWuhZZn9ETbqAYozckh",
 *     "n1dYu2BXgV3xgUh8LhZu8QDDNr15tz4hVDv",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000",
 *     null, null,
 *     "passphrase",
 *     function(data) {
 *          //code
 *     }
 * );
 */
Admin.prototype.sendTransactionWithPassphrase = function () {
    var options = utils.argumentsToObject(['from', 'to', 'value', 'nonce', 'gasPrice', 'gasLimit', 'contract', 'binary', 'passphrase', 'callback'], arguments);
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
    return this._sendRequest("post", "/transactionWithPassphrase", params, options.callback);
};

/**
 * Method start listen provided port. {@link https://github.com/nebulasio/go-nebulas/blob/1bd9bc9c9c6ca4fa0d515b620aa096f7e1c45088/neblet/neblet.go#L159}<br>
 * TODO: Add parameter to wiki documentation.
 *
 * @param {String} [callback] - Listen port.
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [isListenStrted]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#stopmining}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var isListenStrted = admin.startPprof('8080');
 * //async
 * admin.startPprof('8080', function(isListenStrted) {
 * //code
 * });
 */
Admin.prototype.startPprof = function () {
    var options = utils.argumentsToObject(['listen', 'callback'], arguments);
    var params = { "listen": options.listen };
    return this._sendRequest("post", "/pprof", params, options.callback);
};

/**
 * Method get config of node in Nebulas Network.
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [config]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#getConfig}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var info = admin.getConfig();
 * //async
 * admin.getConfig(function(info) {
 * //code
 * });
 */
Admin.prototype.getConfig = function () {
    var options = utils.argumentsToObject(['callback'], arguments);
    return this._sendRequest("get", "/getConfig", null, options.callback);
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
