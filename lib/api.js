
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
    this._setRequest(neb._request);
};

/**
 * @private
 * @param {Request} request - transport wrapper.
 */
API.prototype._setRequest = function (request) {
    this._request = request;
    this._path = '/user';
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
API.prototype.getNebState = function () {
    var options = utils.argumentsToObject(['callback'], arguments);
    return this._sendRequest("get", "/nebstate", null, options.callback);
};

/**
 * Method get latest irreversible block of Nebulas Network.
 *
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [NebStateObject]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#latestirreversibleblock}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var state = api.latestIrreversibleBlock();
 * //async
 * api.latestIrreversibleBlock(function(state) {
 * //code
 * });
 */
API.prototype.latestIrreversibleBlock = function () {
     var options = utils.argumentsToObject(['callback'], arguments);
    return this._sendRequest("get", "/lib", null, options.callback);

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
 * var state = api.getAccountState("n1QsosVXKxiV3B4iDWNmxfN4VqpHn2TeUcn");
 * //async
 * api.getAccountState("n1QsosVXKxiV3B4iDWNmxfN4VqpHn2TeUcn", function(state) {
 * //code
 * });
 */
API.prototype.getAccountState = function () {
    var options = utils.argumentsToObject(['address', 'height', 'callback'], arguments);
    var params = { "address": options.address, "height": options.height };
    return this._sendRequest("post", "/accountstate", params, options.callback);
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
 *     "n1QsosVXKxiV3B4iDWNmxfN4VqpHn2TeUcn",
 *     "n1Lf5VcZQnzBc69iANxLTBqmojCeMFKowoM",
 *     "0",
 *     3,
 *     "1000000",
 *     "2000000",
 *     "contract":{"function":"save","args":"[0]"}
 * );
 * //async
 * api.call(
 *     100,
 *     "n1QsosVXKxiV3B4iDWNmxfN4VqpHn2TeUcn",
 *     "n1Lf5VcZQnzBc69iANxLTBqmojCeMFKowoM",
 *     "0",
 *      3,
 *      "1000000",
 *      "2000000",
 *      "contract":{"function":"save","args":"[0]"},
 *      function(tx) {
 *          //code
 *      }
 * );
 */
API.prototype.call = function () {
    var options = utils.argumentsToObject(['from', 'to', 'value', 'nonce', 'gasPrice', 'gasLimit', 'contract', 'callback'], arguments);
    var params = {
        "from": options.from,
        "to": options.to,
        "value": utils.toString(options.value),
        "nonce": options.nonce,
        "gasPrice": utils.toString(options.gasPrice),
        "gasLimit": utils.toString(options.gasLimit),
        "contract": options.contract
    };
    return this._sendRequest("post", "/call", params, options.callback);
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
API.prototype.sendRawTransaction = function () {
    var options = utils.argumentsToObject(['data', 'callback'], arguments);
    var params = { "data": options.data };
    return this._sendRequest("post", "/rawtransaction", params, options.callback);
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
API.prototype.getBlockByHash = function () {
    var options = utils.argumentsToObject(['hash', 'fullTransaction', 'callback'], arguments);
    var params = { "hash": options.hash, "fullTransaction": options.fullTransaction };
    return this._sendRequest("post", "/getBlockByHash", params, options.callback);
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
API.prototype.getBlockByHeight = function () {
    var options = utils.argumentsToObject(['height', 'fullTransaction', 'callback'], arguments);
    var params = { "height": options.height, "fullTransaction": options.fullTransaction };
    return this._sendRequest("post", "/getBlockByHeight", params, options.callback);
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
API.prototype.getTransactionReceipt = function () {
    var options = utils.argumentsToObject(['hash', 'callback'], arguments);
    var params = { "hash": options.hash };
    return this._sendRequest("post", "/getTransactionReceipt", params, options.callback);
};

/**
 * Return the subscribed events of transaction & block.
 * For more information about parameters, follow this link:
 * {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#subscribe}
 *
 * @param {Array|String} topics
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [eventData]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#subscribe}
 *
 * @example
 * var api = new Neb().api;
 * api.subscribe(["chain.linkBlock", "chain.pendingTransaction"]).then(function(eventData) {
 * //code
 * });
 */
API.prototype.subscribe = function () {
    var options = utils.argumentsToObject(['topics', 'onDownloadProgress'], arguments);
    var params = { "topics": options.topics };
    var axiosOptions;
    if (typeof options.onDownloadProgress === 'function') {
        axiosOptions = {
            onDownloadProgress: function(e) {
                if (typeof e.target._readLength === 'undefined') {
                    e.target._readLength = 0;
                }
                var chunk = e.target.responseText.substr(e.target._readLength);
                // TODO check and split multi events
                if (chunk && chunk.trim().length > 0) {
                    e.target._readLength += chunk.length;
                    options.onDownloadProgress(chunk);
                }
            }
        };
    }
    return this._sendRequest("post", "/subscribe", params, null, axiosOptions);
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
API.prototype.gasPrice = function () {
    var options = utils.argumentsToObject(['callback'], arguments);
    return this._sendRequest("get", "/getGasPrice", null, options.callback);
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
 * @param {String} [binary]
 * @param {Function} [callback] - Without callback return data synchronous.
 *
 * @return [Gas]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#estimategas}
 *
 * @example
 * var api = new Neb().api;
 * //sync
 * var gas = api.estimateGas(
 *     "n1QsosVXKxiV3B4iDWNmxfN4VqpHn2TeUcn",
 *     "n1Lf5VcZQnzBc69iANxLTBqmojCeMFKowoM",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000"
 * );
 * //async
 * api.estimateGas(
 *     "n1QsosVXKxiV3B4iDWNmxfN4VqpHn2TeUcn",
 *     "n1Lf5VcZQnzBc69iANxLTBqmojCeMFKowoM",
 *     "10",
 *     1,
 *     "1000000",
 *     "2000000",
 *     null, null,
 *     function(gas) {
 *          //code
 *     }
 * );
 */
API.prototype.estimateGas = function () {
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
    return this._sendRequest("post", "/estimateGas", params, options.callback);
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
API.prototype.getEventsByHash = function () {
    var options = utils.argumentsToObject(['hash', 'callback'], arguments);
    var params = { "hash": options.hash };
    return this._sendRequest("post", "/getEventsByHash", params, options.callback);
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
 * var api = new Neb().api;
 * //sync
 * var delegatees = api.getDynasty();
 * //async
 * api.getDynasty(function(delegatees) {
 * //code
 * });
 */
API.prototype.getDynasty = function (height, callback) {
    var params = {"height": height};
    return this._sendRequest("post", "/dynasty", params, callback);
};

API.prototype._sendRequest = function (method, api, params, callback, axiosOptions) {
    var action = this._path + api;
    if (typeof callback === "function") {
        return this._request.asyncRequest(method, action, params, callback);
    } else {
        return this._request.request(method, action, params, axiosOptions);
    }
};

module.exports = API;
