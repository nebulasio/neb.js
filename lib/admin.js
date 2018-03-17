
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
    this.setRequest(neb._request);
};

/**
 * @private
 * @param {Request} request - transport wrapper.
 */
Admin.prototype.setRequest = function (request) {
    this._request = request;
    this.path = '/admin';
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
Admin.prototype.newAccount = function (passphrase, callback) {
    var params = { "passphrase": passphrase };
    return this.request("post", "/account/new", params, callback);
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
 * var isUnLocked = admin.unlockAccount("8a209cec02cbeab7e2f74ad969d2dfe8dd24416aa65589bf", "passphrase");
 * //async
 * admin.unlockAccount("8a209cec02cbeab7e2f74ad969d2dfe8dd24416aa65589bf", "passphrase", function(isUnLocked) {
 * //code
 * });
 */
Admin.prototype.unlockAccount = function (address, passphrase, callback) {
    var params = {
        "address": address,
        "passphrase": passphrase
    };
    return this.request("post", "/account/unlock", params, callback);
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
 * var isLocked = admin.lockAccount("8a209cec02cbeab7e2f74ad969d2dfe8dd24416aa65589bf");
 * //async
 * admin.lockAccount("8a209cec02cbeab7e2f74ad969d2dfe8dd24416aa65589bf", function(isLocked) {
 * //code
 * });
 */
Admin.prototype.lockAccount = function (address, callback) {
    var params = { "address": address };
    return this.request("post", "/account/lock", params, callback);
};

/**
 * Method change the Network id.{@link https://github.com/nebulasio/go-nebulas/blob/67dbb0d03e34a737ab09a2454cdb26b587d3cad4/rpc/admin_service.go#L145}<br>
 * TODO: Add parameter to wiki documentation.
 *
 * @param {String} networkId
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [isChanged]
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var isChanged = admin.changeNetworkID(2);
 * //async
 * admin.changeNetworkID(2, function(isChanged) {
 * //code
 * });
 */

Admin.prototype.changeNetworkID = function (networkId, callback) {
    var params = { "networkId": networkId };
    return this.request("post", "/changeNetworkID", params, callback);
};

/**
 * Method sign transaction.
 * The transaction's from addrees must be unlock before sign call.
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signtransaction}
 *
 * @param {String} from
 * @param {String} to
 * @param {Number|Sting} value
 * @param {Number} nonce
 * @param {Number|String} gasPrice
 * @param {Number|String} gasLimit
 * @param {Object} [contract]
 * @param {Object} [candidate]
 * @param {Object} [delegate]
 * @param {String} [binary]
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [data]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#signtransaction}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var data = admin.signTransaction(
 *     "22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09",
 *     "5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000"
 * );
 * //async
 * admin.signTransaction
 *     "22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09",
 *     "5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000",
 *     null, null, null, null,
 *     function(data) {
 *          //code
 *     }
 * );
 */
Admin.prototype.signTransaction = function (from, to, value, nonce, gasPrice, gasLimit, contract, candidate, delegate, binary, callback) {
    var params = {
        "from": from,
        "to": to,
        "value": utils.toString(value),
        "nonce": nonce,
        "gasPrice": utils.toString(gasPrice),
        "gasLimit": utils.toString(gasLimit),
        "contract": contract,
        "candidate": candidate,
        "delegate": delegate,
        "binary": binary
    };
    return this.request("post", "/sign", params, callback);
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
 * @param {Object} [candidate]
 * @param {Object} [delegate]
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
 *     "22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09",
 *     "5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000",
 *     null, null, null, null,
 *     "passphrase"
 * );
 * //async
 * admin.sendTransactionWithPassphrase
 *     "22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09",
 *     "5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000",
 *     null, null, null, null,
 *     "passphrase",
 *     function(data) {
 *          //code
 *     }
 * );
 */
Admin.prototype.sendTransactionWithPassphrase = function (from, to, value, nonce, gasPrice, gasLimit, contract, candidate, delegate, binary, passphrase, callback) {
    var tx = {
        "from": from,
        "to": to,
        "value": utils.toString(value),
        "nonce": nonce,
        "gasPrice": utils.toString(gasPrice),
        "gasLimit": utils.toString(gasLimit),
        "contract": contract,
        "candidate": candidate,
        "delegate": delegate,
        "binary": binary
    };
    var params = {
        "transaction": tx,
        "passphrase": passphrase
    };
    return this.request("post", "/transactionWithPassphrase", params, callback);
};

/**
 * Method getter for dpos dynasty.{@link https://github.com/nebulasio/go-nebulas/blob/0c3439f9cedc539f64f64dd400878d2318cb215f/rpc/api_service.go#L596}<br>
 * TODO: Add parameter to wiki documentation.
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [delegatees]
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var delegatees = admin.getDynasty();
 * //async
 * admin.getDynasty(function(delegatees) {
 * //code
 * });
 */
Admin.prototype.getDynasty = function (callback) {
    return this.request("get", "/dynasty", null, callback);
};

/**
 * Method getter for dpos delegate voters.
 * {@link https://github.com/nebulasio/wiki/blob/142c43c543c07f8ccf98f2aa11bb4bd1fcd65ddb/rpc.md#getdelegatevoters}
 *
 * @param {String} [delegatee]
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [delegatees]{@link https://github.com/nebulasio/wiki/blob/142c43c543c07f8ccf98f2aa11bb4bd1fcd65ddb/rpc.md#getdelegatevoters}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var voters = admin.getDelegateVoters("1a263547d167c74cf4b8f9166cfa244de0481c514a45aa2c");
 * //async
 * admin.getDelegateVoters("1a263547d167c74cf4b8f9166cfa244de0481c514a45aa2c", function(voters) {
 * //code
 * });
 */
Admin.prototype.getDelegateVoters = function (delegatee, callback) {
    var params = { "delegatee": delegatee };
    return this.request("post", "/delegateVoters", params, callback);
};

/**
 * Method start consensus mining.
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#startmining}
 *
 * @param {String} [passphrase]
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [isStarted]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#startmining}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var isStarted = admin.startMining("passphrase");
 * //async
 * admin.startMining("passphrase", function(isStarted) {
 * //code
 * });
 */
Admin.prototype.startMining = function (passphrase, callback) {
    var params = { "passphrase": passphrase };
    return this.request("post", "/startMining", params, callback);
};

/**
 * Method stop consensus mining.
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#stopmining}
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [isStoped]{@link https://github.com/nebulasio/wiki/blob/master/rpc_admin.md#stopmining}
 *
 * @example
 * var admin = new Neb().admin;
 * //sync
 * var isStoped = admin.stopMining();
 * //async
 * admin.stopMining(function(isStoped) {
 * //code
 * });
 */
Admin.prototype.stopMining = function (callback) {
    return this.request("get", "/stopMining", null, callback);
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
Admin.prototype.startPprof = function (listen, callback) {
    var params = { "listen": listen };
    return this.request("post", "/pprof", params, callback);
};

Admin.prototype.request = function (method, api, params, callback) {
    var action = this.path + api;
    return this._request.request(method, action, params, callback);
};

module.exports = Admin;
