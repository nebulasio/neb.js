
"use strict";

var utils = require('./utils/utils.js');

/**
 * User API constructor.
 * Class encapsulate methods for building distributed applications and services.
 * API documentation: {@link https://github.com/nebulasio/wiki/blob/master/rpc.md}.
 * @constructor
 *
 * @param {Neb} neb - Instance of Neb library.
 *
 * @example
 * var api = new API ( new Neb() );
 * // or just
 * var api = new Neb().api;
 */
var API = function (neb) {
    this._request = neb._request;
};

/**
 * @private
 * @param {Request} request - transport wrapper.
 */
API.prototype.setRequest = function (request) {
    this._request = request;
};

/**
 * Method get state of Nebulas Network.
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [NebStateObject]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getnebstate}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var state = api.getNebState();
 * //async
 * api.getNebState(function(state) {
 * //code
 * });
 */
API.prototype.getNebState = function (callback) {
    return this.request("get", "/v1/user/nebstate", null, callback);
};


/**
 * Method get info about nodes in Nebulas Network.
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [nodeInfoObject]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#nodeinfo}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var info = api.nodeInfo();
 * //async
 * api.nodeInfo(function(info) {
 * //code
 * });
 */
API.prototype.nodeInfo = function (callback) {
    return this.request("get", "/v1/user/nodeinfo", null, callback);
};

/**
 * Method get list of available addresses.
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [accountsList]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#accounts}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var accounts = api.accounts();
 * //async
 * api.accounts(function(accounts) {
 * //code
 * });
 */
API.prototype.accounts = function (callback) {
    return this.request("get", "/v1/user/accounts", null, callback);
};

/**
 * Method return the dump info of blockchain.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#blockdump}
 *
 * @param {Number} count
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [dumpObject]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#blockdump}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var dump = api.blockDump(3);
 * //async
 * api.blockDump(3, function(dump) {
 * //code
 * });
 */
API.prototype.blockDump = function (count, callback) {
    var params = { "count": count };
    return this.request("post", "/v1/user/blockdump", params, callback);
};

/**
 * Method return the state of the account. Balance and nonce.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getaccountstate}
 *
 * @param {String} address
 * @param {String} height
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [accaountStateObject]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getaccountstate}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var state = api.getAccountState("22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09");
 * //async
 * api.getAccountState("22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09", function(state) {
 * //code
 * });
 */
API.prototype.getAccountState = function (address, height, callback) {
    var params = { "address": address, "height": height };
    return this.request("post", "/v1/user/accountstate", params, callback);
};

/**
 * Method wrap transaction sending functionality.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#sendtransaction}
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
 * @return [Transcation hash and contract address]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#sendtransaction}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var tx = api.sendTransaction(
 *     "22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09",
 *     "5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f",
 *     "10",
 *     1,
 *     "gasPrice":"1000000",
 *     "gasLimit":"2000000"
 * );
 * //async
 * api.sendTransaction(
 *     "22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09",
 *     "5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f",
 *     "10",
 *     1,
 *     "gasPrice":"1000000",
 *     "gasLimit":"2000000",
 *     null, null, null, null,
 *     function(tx) {
 *          //code
 *     }
 * );
 */

API.prototype.sendTransaction = function (from, to, value, nonce, gasPrice, gasLimit, contract, candidate, delegate, binary, callback) {
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
    return this.request("post", "/v1/user/transaction", params, callback);
};

/**
 * Method wrap smart contract call functionality.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#call}
 *
 * @param {String} from
 * @param {String} to
 * @param {Number|Sting} value
 * @param {Number} nonce
 * @param {Number|String} gasPrice
 * @param {Number|String} gasLimit
 * @param {Object} contract
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [Transcation hash]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#call}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var tx = api.call(
 *     "1a263547d167c74cf4b8f9166cfa244de0481c514a45aa2c",
 *     "333cb3ed8c417971845382ede3cf67a0a96270c05fe2f700",
 *     "0",
 *     3,
 *     "gasPrice":"1000000",
 *     "gasLimit":"2000000",
 *     "contract":{"function":"save","args":"[0]"}
 * );
 * //async
 * api.call(
 *     100,
 *     "22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09",
 *     "5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f",
 *     "0",
 *      3,
 *      "gasPrice":"1000000",
 *      "gasLimit":"2000000",
 *      "contract":{"function":"save","args":"[0]"},
 *      function(tx) {
 *          //code
 *      }
 * );
 */
API.prototype.call = function (from, to, value, nonce, gasPrice, gasLimit, contract, callback) {
    var params = {
        "from": from,
        "to": to,
        "value": utils.toString(value),
        "nonce": nonce,
        "gasPrice": utils.toString(gasPrice),
        "gasLimit": utils.toString(gasLimit),
        "contract": contract
    };
    return this.request("post", "/v1/user/call", params, callback);
};

/**
 * Method wrap submit the signed transaction.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#sendrawtransaction}
 *
 * @param {Object} data
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [Transcation hash]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#sendrawtransaction}
 *
 * @example
 * var api = new Neb().api;
 * var tx = new Transaction(ChainID, from, to, transferValue, nonce, gasPrice, gasLimit);
 * tx.signTransaction();
 * //sync
 * var hash = api.sendRawTransaction( tx.toProtoString() );
 * //async
 * api.sendRawTransaction( tx.toProtoString(), function(hash) {
 * //code
 * });
 */
API.prototype.sendRawTransaction = function (data, callback) {
    var params = { "data": data };
    return this.request("post", "/v1/user/rawtransaction", params, callback);
};

/**
 * Get block header info by the block hash.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getblockbyhash}
 *
 * @param {String} hash
 * @param {Boolean} fullTransaction
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [Block]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getblockbyhash}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var block = api.getBlockByHash("00000658397a90df6459b8e7e63ad3f4ce8f0a40b8803ff2f29c611b2e0190b8", true);
 * //async
 * api.getBlockByHash("00000658397a90df6459b8e7e63ad3f4ce8f0a40b8803ff2f29c611b2e0190b8", true,  function(block) {
 * //code
 * });
 */
API.prototype.getBlockByHash = function (hash, fullTransaction, callback) {
    var params = { "hash": hash, "fullTransaction": fullTransaction };
    return this.request("post", "/v1/user/getBlockByHash", params, callback);
};

/**
 * Get block header info by the block height.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getblockbyheight}
 *
 * @param {Number} height
 * @param {Boolean} fullTransaction
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [Block]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getblockbyheight}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var block = api.getBlockByHeight(2, true);
 * //async
 * api.getBlockByHeight(2, true,  function(block) {
 * //code
 * });
 */
API.prototype.getBlockByHeight = function (height, fullTransaction, callback) {
    var params = { "height": height, "fullTransaction": fullTransaction };
    return this.request("post", "/v1/user/getBlockByHeight", params, callback);
};

/**
 * Get transactionReceipt info by tansaction hash.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#gettransactionreceipt}
 *
 * @param {String} hash
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [TransactionReceipt]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#gettransactionreceipt}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var receipt = api.getTransactionReceipt("cc7133643a9ae90ec9fa222871b85349ccb6f04452b835851280285ed72b008c");
 * //async
 * api.getTransactionReceipt("cc7133643a9ae90ec9fa222871b85349ccb6f04452b835851280285ed72b008c", function(receipt) {
 * //code
 * });
 */
API.prototype.getTransactionReceipt = function (hash, callback) {
    var params = { "hash": hash };
    return this.request("post", "/v1/user/getTransactionReceipt", params, callback);
};

/**
 * Return the subscribed events of transaction & block.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#subscribe}
 *
 * @param {Array|String} topic
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [eventData]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#subscribe}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var eventData = api.subscribe(["chain.linkBlock", "chain.pendingTransaction"]);
 * //async
 * api.subscribe(["chain.linkBlock", "chain.pendingTransaction"], function(eventData) {
 * //code
 * });
 */
API.prototype.subscribe = function (topic, callback) {
    var params = { "topic": topic };
    return this.request("post", "/v1/user/subscribe", params, callback);
};

/**
 * Return current gasPrice.
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [Gas Price]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getgasprice}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var gasPrice = api.gasPrice();
 * //async
 * api.gasPrice(function(gasPrice) {
 * //code
 * });
 */
API.prototype.gasPrice = function (callback) {
    return this.request("get", "/v1/user/getGasPrice", null, callback);
};

/**
 * Return the estimate gas of transaction.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#estimategas}
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
 * @return [Gas]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#estimategas}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var gas = api.estimateGas(
 *     "22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09",
 *     "5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f",
 *     "10",
 *     1,
 *     "gasPrice":"1000000",
 *     "gasLimit":"2000000"
 * );
 * //async
 * api.estimateGas(
 *     "22ac3a9a2b1c31b7a9084e46eae16e761f83f02324092b09",
 *     "5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f",
 *     "10",
 *     1,
 *     "gasPrice":"1000000",
 *     "gasLimit":"2000000",
 *     null, null, null, null,
 *     function(gas) {
 *          //code
 *     }
 * );
 */
API.prototype.estimateGas = function (from, to, value, nonce, gasPrice, gasLimit, contract, candidate, delegate, binary, callback) {
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
    return this.request("post", "/v1/user/estimateGas", params, callback);
};

/**
 * Return transaction used gas.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getgasused}
 *
 * @param {String} hash
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [Gas]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getgasused}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var gas = api.getGasUsed("ec239d532249f84f158ef8ec9262e1d3d439709ebf4dd5f7c1036b26c6fe8073");
 * //async
 * api.getGasUsed("ec239d532249f84f158ef8ec9262e1d3d439709ebf4dd5f7c1036b26c6fe8073", function(gas) {
 * //code
 * });
 */
API.prototype.getGasUsed = function (hash, callback) {
    var params = { "hash": hash };
    return this.request("post", "/v1/user/getGasUsed", params, callback);
};

/**
 * Return the events list of transaction.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#geteventsbyhash}
 *
 * @param {String} hash
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [Events]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#geteventsbyhash}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var events = api.getEventsByHash("ec239d532249f84f158ef8ec9262e1d3d439709ebf4dd5f7c1036b26c6fe8073");
 * //async
 * api.getEventsByHash("ec239d532249f84f158ef8ec9262e1d3d439709ebf4dd5f7c1036b26c6fe8073", function(events) {
 * //code
 * });
 */
API.prototype.getEventsByHash = function (hash, callback) {
    var params = { "hash": hash };
    return this.request("post", "/v1/user/getEventsByHash", params, callback);
};

API.prototype.request = function (method, api, params, callback) {
    if (utils.isFunction(callback)) {
        this._request.asyncRequest(method, api, params, callback);
        return callback;
    } else {
        return this._request.request(method, api, params);
    }
};

module.exports = API;
