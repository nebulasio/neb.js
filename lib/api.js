
"use strict";

var utils = require('./utils/utils.js');

/**
 * User API constructor.
 * Class encapsulate methods for building distributed applications and services.
 *
 * @see [API documentation]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md}
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
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getnebstate}
 *
 * @return [NebStateObject]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getnebstate}
 *
 * @example
 * var api = new Neb().api;
 * api.getNebState().then(function(state) {
 * //code
 * });
 */
API.prototype.getNebState = function () {
    return this._sendRequest("get", "/nebstate", null);
};

/**
 * Method get latest irreversible block of Nebulas Network.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#latestirreversibleblock}
 *
 * @return [dataBlockInfo.]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#latestirreversibleblock}
 *
 * @example
 * var api = new Neb().api;
 * api.latestIrreversibleBlock().then(function(blockData) {
 * //code
 * });
 */
API.prototype.latestIrreversibleBlock = function () {
    return this._sendRequest("get", "/lib", null);

};

/**
 * Method return the state of the account. Balance and nonce.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getaccountstate}
 *
 * @param {Object} options
 * @param {HexString} options.address
 * @param {String} options.height
 *
 * @return [accaountStateObject]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getaccountstate}
 *
 * @example
 * var api = new Neb().api;
 * api.getAccountState({address: "n1QsosVXKxiV3B4iDWNmxfN4VqpHn2TeUcn"}).then(function(state) {
 * //code
 * });
 */
API.prototype.getAccountState = function (options) {
    options = utils.argumentsToObject(['address', 'height'], arguments);
    var params = { "address": options.address, "height": options.height };
    return this._sendRequest("post", "/accountstate", params);
};

/**
 * Method wrap smart contract call functionality.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#call}
 *
 * @param {TransactionOptions} options
 *
 * @return [Transcation hash]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#call}
 *
 * @example
 * var api = new Neb().api;
 * api.call({
 *    chainID: 1,
 *    from: "n1QZMXSZtW7BUerroSms4axNfyBGyFGkrh5",
 *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
 *    value: 10,
 *    nonce: 12,
 *    gasPrice: 1000000,
 *    gasLimit: 2000000,
 *    contract: {
 *        function: "save",
 *        args: "[0]"
 *    }
 * }).then(function(tx) {
 *     //code
 * });
 */
API.prototype.call = function (options) {
    options = utils.argumentsToObject(['from', 'to', 'value', 'nonce', 'gasPrice', 'gasLimit', 'contract'], arguments);
    var params = {
        "from": options.from,
        "to": options.to,
        "value": utils.toString(options.value),
        "nonce": options.nonce,
        "gasPrice": utils.toString(options.gasPrice),
        "gasLimit": utils.toString(options.gasLimit),
        "contract": options.contract
    };
    return this._sendRequest("post", "/call", params);
};

/**
 * Method wrap submit the signed transaction.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#sendrawtransaction}
 *
 * @param {Object} options
 * @param {String} options.data
 *
 * @return [Transcation hash]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#sendrawtransaction}
 *
 * @example
 * var api = new Neb().api;
 * var tx = new Transaction({
 *    chainID: 1,
 *    from: acc1,
 *    to: acc2,
 *    value: 10,
 *    nonce: 12,
 *    gasPrice: 1000000,
 *    gasLimit: 2000000
 * });
 * tx.signTransaction();
 * api.sendRawTransaction( {data: tx.toProtoString()} ).then(function(hash) {
 * //code
 * });
 */
API.prototype.sendRawTransaction = function (options) {
    options = utils.argumentsToObject(['data'], arguments);
    var params = { "data": options.data };
    return this._sendRequest("post", "/rawtransaction", params);
};

/**
 * Get block header info by the block hash.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getblockbyhash}
 *
 * @param {Object} options
 * @param {HexString} options.hash
 * @param {Boolean} options.fullTransaction
 *
 * @return [Block]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getblockbyhash}
 *
 * @example
 * var api = new Neb().api;
 * api.getBlockByHash({
 *     hash: "00000658397a90df6459b8e7e63ad3f4ce8f0a40b8803ff2f29c611b2e0190b8",
 *     fullTransaction: true
 * }).then(function(block) {
 * //code
 * });
 */
API.prototype.getBlockByHash = function (options) {
    options = utils.argumentsToObject(['hash', 'fullTransaction'], arguments);
    var params = { "hash": options.hash, "full_fill_transaction": options.fullTransaction };
    return this._sendRequest("post", "/getBlockByHash", params);
};

/**
 * Get block header info by the block height.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getblockbyheight}
 *
 * @param {Object} options
 * @param {Number} options.height
 * @param {Boolean} options.fullTransaction
 *
 * @return [Block]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getblockbyheight}
 *
 * @example
 * var api = new Neb().api;
 * api.getBlockByHeight({height:2, fullTransaction:true}).then(function(block) {
 * //code
 * });
 */
API.prototype.getBlockByHeight = function (options) {
    options = utils.argumentsToObject(['height', 'fullTransaction'], arguments);
    var params = { "height": options.height, "full_fill_transaction": options.fullTransaction };
    return this._sendRequest("post", "/getBlockByHeight", params);
};

/**
 * Get transactionReceipt info by tansaction hash.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#gettransactionreceipt}
 *
 * @param {Object} options
 * @param {HexString} options.hash
 *
 * @return [TransactionReceipt]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#gettransactionreceipt}
 *
 * @example
 * var api = new Neb().api;
 * api.getTransactionReceipt({hash: "cc7133643a9ae90ec9fa222871b85349ccb6f04452b835851280285ed72b008c"}).then(function(receipt) {
 * //code
 * });
 */
API.prototype.getTransactionReceipt = function (options) {
    options = utils.argumentsToObject(['hash'], arguments);
    var params = { "hash": options.hash };
    return this._sendRequest("post", "/getTransactionReceipt", params);
};

/**
 * Get transactionReceipt info by contract address.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#gettransactionbycontract}
 * 
 * @param {Object} options
 * @param {HexString} options.address contract address
 * 
 * @returns the same as [TransactionReceipt]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#gettransactionreceipt}
 * 
 * @example
 * var api = new Neb().api;
 * api.getTransactionByContract({address: "n1sqDHGjYtX6rMqFoq5Tow3s3LqF4ZxBvE3"}).then(function(receipt) {
 *  //code
 * });
 */
API.prototype.getTransactionByContract = function (options) {
    options = utils.argumentsToObject(['address'], arguments);
    var params = { "address": options.address };
    return this._sendRequest("post", "/getTransactionByContract", params);
};

/**
 * Return the subscribed events of transaction & block.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#subscribe}
 *
 * @param {Object} options
 * @param {Array|String} options.topics
 * @param {Function} options.onDownloadProgress - On progress callback function. Recive chunk.
 *
 * @return [eventData]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#subscribe}
 *
 * @example
 * var api = new Neb().api;
 * api.subscribe({topics: ["chain.linkBlock", "chain.pendingTransaction"]}).then(function(eventData) {
 * //code
 * });
 */
API.prototype.subscribe = function (options) {
    options = utils.argumentsToObject(['topics', 'onDownloadProgress'], arguments);
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
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getgasprice}
 *
 * @return [Gas Price]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getgasprice}
 *
 * @example
 * var api = new Neb().api;
 * api.gasPrice().then(function(gasPrice) {
 * //code
 * });
 */
API.prototype.gasPrice = function () {
    return this._sendRequest("get", "/getGasPrice", null);
};

/**
 * Return the estimate gas of transaction.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#estimategas}
 *
 * @param {TransactionOptions} options
 *
 * @return [Gas]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#estimategas}
 *
 * @example
 * var api = new Neb().api;
 * api.estimateGas({
 *    chainID: 1,
 *    from: "n1QZMXSZtW7BUerroSms4axNfyBGyFGkrh5",
 *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
 *    value: 10,
 *    nonce: 12,
 *    gasPrice: 1000000,
 *    gasLimit: 2000000
 * }).then(function(gas) {
 * //code
 * });
 */
API.prototype.estimateGas = function (options) {
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
    return this._sendRequest("post", "/estimateGas", params);
};

/**
 * Return the events list of transaction.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#geteventsbyhash}
 *
 * @param {Object} options
 * @param {HexString} options.hash
 *
 * @return [Events]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#geteventsbyhash}
 *
 * @example
 * var api = new Neb().api;
 * api.getEventsByHash({hash: "ec239d532249f84f158ef8ec9262e1d3d439709ebf4dd5f7c1036b26c6fe8073"}).then(function(events) {
 * //code
 * });
 */
API.prototype.getEventsByHash = function (options) {
    options = utils.argumentsToObject(['hash'], arguments);
    var params = { "hash": options.hash };
    return this._sendRequest("post", "/getEventsByHash", params);
};

/**
 * Method getter for dpos dynasty.
 * @see {@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getdynasty}
 *
 * @param {Object} options
 * @param {Number} options.height
 *
 * @return [delegatees]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#getdynasty}
 *
 * @example
 * var api = new Neb().api;
 * api.getDynasty({height: 1}).then(function(delegatees) {
 * //code
 * });
 */
API.prototype.getDynasty = function (options) {
    var params = {"height": options.height};
    return this._sendRequest("post", "/dynasty", params);
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
