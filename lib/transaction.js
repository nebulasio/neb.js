"use strict";

var protobuf = require('protobufjs');
var utils = require('./utils/utils.js');
var cryptoUtils = require('./utils/crypto-utils.js');
var account = require("./account.js");
var htmlescape = require('htmlescape');
var BigNumber = require('bignumber.js');

var SECP256K1 = 1;
var root = protobuf.Root.fromJSON(require("./transaction.json"));

var TxPayloadBinaryType    = "binary";
var TxPayloadDeployType    = "deploy";
var TxPayloadCallType      = "call";

/**
 * @typedef TransactionInit
 * @example
 * var acc = Account.NewAccount();
 *
 * var tx = new Transaction({
 *    chainID: 1,
 *    from: acc,
 *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
 *    value: 10,
 *    nonce: 12,
 *    gasPrice: 1000000,
 *    gasLimit: 2000000
 * });
 */

/**
 * Represent of smart contract payload data.
 *
 * @typedef {Object} Contract
 * @property {String} source - Contract source code for deploy contract.
 * @property {String} sourceType - Contract source type for deploy contract. Currently support js and ts.
 * @property {String} args - The params of contract. The args content is JSON string of parameters array.
 * @property {String} function - The contract call function.
 * @property {Buffer} binary - Binary contract representation.
 *
 * @see [Create own smart contract in Nebulas.]{@link https://github.com/nebulasio/wiki/blob/master/tutorials/%5BEnglish%5D%20Nebulas%20101%20-%2003%20Smart%20Contracts%20JavaScript.md}
 * @see [More about transaction parameters.]{@link https://github.com/nebulasio/wiki/blob/c3f5ce8908c80e9104e3b512a7fdfd75f16ac38c/rpc.md#sendtransaction}
 *
 * @example
 * // It's example of possible fields values.
 * // For deploy, and execute smart contracts follow this link - https://github.com/nebulasio/wiki/blob/master/tutorials/%5BEnglish%5D%20Nebulas%20101%20-%2003%20Smart%20Contracts%20JavaScript.md
 * {
 *     'source': '"use strict";var DepositeContent=function(t){if(t){let n=JSON.parse(t);' +
 *               'this.balance=new BigNumber(n.balance),this.expiryHeight=new BigNumber(n.expiryHeight)' +
 *               '}else this.balance=new BigNumber(0),this.expiryHeight=new BigNumber(0)};' +
 *               'DepositeContent.prototype={toString:function(){return JSON.stringify(this)}};' +
 *               'var BankVaultContract=function(){LocalContractStorage.defineMapProperty(this,"bankVault",' +
 *               '{parse:function(t){return new DepositeContent(t)},stringify:function(t){return t.toString()}})};' +
 *               'BankVaultContract.prototype={init:function(){},save:function(t){var n=Blockchain.transaction.from,' +
 *               'e=Blockchain.transaction.value,a=new BigNumber(Blockchain.block.height),r=this.bankVault.get(n);' +
 *               'r&&(e=e.plus(r.balance));var i=new DepositeContent;i.balance=e,i.expiryHeight=a.plus(t),' +
 *               'this.bankVault.put(n,i)},takeout:function(t){var n=Blockchain.transaction.from,' +
 *               'e=new BigNumber(Blockchain.block.height),a=new BigNumber(t),r=this.bankVault.get(n);' +
 *               'if(!r)throw new Error("No deposit before.");if(e.lt(r.expiryHeight))throw new Error("Can't takeout before expiryHeight.");' +
 *               'if(a.gt(r.balance))throw new Error("Insufficient balance.");if(0!=Blockchain.transfer(n,a))throw new Error("transfer failed.");' +
 *               'Event.Trigger("BankVault",{Transfer:{from:Blockchain.transaction.to,to:n,value:a.toString()}}),' +
 *               'r.balance=r.balance.sub(a),this.bankVault.put(n,r)},balanceOf:function(){var t=Blockchain.transaction.from;' +
 *               'return this.bankVault.get(t)}},module.exports=BankVaultContract;',
 *     'sourceType': 'js',
 *     'args': '[0]',
 *     'function': 'save'
 * }
 */

 /**
  * Represent Transaction parameters
  *
  * @typedef {Object} TransactionOptions
  * @property {Number} options.chainID - Transaction chain id.
  * @property {HexString} options.from - Hex string of the sender account addresss..
  * @property {HexString} options.to - Hex string of the receiver account addresss..
  * @property {Number} options.value - Value of transaction.
  * @property {Number} options.nonce - Transaction nonce.
  * @property {Number} options.gasPrice - Gas price. The unit is 10^-18 NAS.
  * @property {Number} options.gasLimit - Transaction gas limit.
  * @property {Contract} [options.contract]
  *
  * @example
  * {
 *    chainID: 1,
 *    from: "n1QZMXSZtW7BUerroSms4axNfyBGyFGkrh5",
 *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
 *    value: 10,
 *    nonce: 12,
 *    gasPrice: 1000000,
 *    gasLimit: 2000000
 * }
  */

/**
 * Transaction constructor.
 * Class encapsulate main operation with transactions.
 * @see [For more information about parameters, follow this link]{@link https://github.com/nebulasio/wiki/blob/master/rpc.md#sendrawtransaction}
 * @constructor
 *
 * @param {TransactionOptions} options - Transaction options.
 *
 * @see [Transaction tutorial.]{@link https://github.com/nebulasio/wiki/blob/master/tutorials/%5BEnglish%5D%20Nebulas%20101%20-%2002%20Transaction.md}
 * @see [Create own smart contract in Nebulas.]{@link https://github.com/nebulasio/wiki/blob/master/tutorials/%5BEnglish%5D%20Nebulas%20101%20-%2003%20Smart%20Contracts%20JavaScript.md}
 * @see [More about transaction parameters.]{@link https://github.com/nebulasio/wiki/blob/c3f5ce8908c80e9104e3b512a7fdfd75f16ac38c/rpc.md#sendtransaction}
 *
 * @example
 * var acc = Account.NewAccount();
 *
 * var tx = new Transaction({
 *    chainID: 1,
 *    from: acc,
 *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
 *    value: 10,
 *    nonce: 12,
 *    gasPrice: 1000000,
 *    gasLimit: 2000000,
 *    contract: {
 *        function: "save",
 *        args: "[0]"
 *    }
 * });
 *
 */
var Transaction = function (options) {
    options = utils.argumentsToObject(['chainID', 'from', 'to', 'value', 'nonce', 'gasPrice', 'gasLimit', 'contract'], arguments);

    this.chainID = options.chainID;
    this.from = account.fromAddress(options.from);
    this.to = account.fromAddress(options.to);
    this.value = utils.toBigNumber(options.value);
    this.nonce = options.nonce;
    this.timestamp = Math.floor(new Date().getTime()/1000);
    this.contract = options.contract;
    this.gasPrice = utils.toBigNumber(options.gasPrice);
    this.gasLimit = utils.toBigNumber(options.gasLimit);

    this.data = parseContract(this.contract);
    if (this.gasPrice.lessThanOrEqualTo(0)) {
        this.gasPrice = new BigNumber(1000000);
    }

    if (this.gasLimit.lessThanOrEqualTo(0)) {
        this.gasLimit = new BigNumber(20000);
    }
    this.signErrorMessage = "You should sign transaction before this operation.";
};

var parseContract = function (obj) {
    /*jshint maxcomplexity:7 */

    var payloadType, payload;
    if (obj && utils.isString(obj.source) && obj.source.length > 0) {
        payloadType = TxPayloadDeployType;
        payload = {
            SourceType: obj.sourceType,
            Source: obj.source,
            Args: obj.args
        };
    } else if (obj && utils.isString(obj.function) && obj.function.length > 0) {
        payloadType = TxPayloadCallType;
        payload = {
            Function: obj.function,
            Args: obj.args
        };
    } else {
        payloadType = TxPayloadBinaryType;
        if (obj) {
            payload = {
                Data: cryptoUtils.toBuffer(obj.binary)
            };
        }
    }
    var payloadData = utils.isNull(payload) ? null : cryptoUtils.toBuffer(htmlescape(payload));

    return {type: payloadType, payload: payloadData};
};

Transaction.prototype = {
    /**
     * Convert transaction to hash by SHA3-256 algorithm.
     *
     * @return {Hash} hash of Transaction.
     *
     * @example
     * var acc = Account.NewAccount();
     *
     * var tx = new Transaction({
     *    chainID: 1,
     *    from: acc,
     *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
     *    value: 10,
     *    nonce: 12,
     *    gasPrice: 1000000,
     *    gasLimit: 2000000
     * });
     * var txHash = tx.hashTransaction();
     * //Uint8Array(32) [211, 213, 102, 103, 23, 231, 246, 141, 20, 202, 210, 25, 92, 142, 162, 242, 232, 95, 44, 239, 45, 57, 241, 61, 34, 2, 213, 160, 17, 207, 75, 40]
     */
    hashTransaction: function () {
        var Data = root.lookup("corepb.Data");
        var err = Data.verify(this.data);
        if (err) {
            throw new Error(err);
        }
        var data = Data.create(this.data);
        var dataBuffer = Data.encode(data).finish();
        var hash = cryptoUtils.sha3(
            this.from.getAddress(),
            this.to.getAddress(),
            cryptoUtils.padToBigEndian(this.value, 128),
            cryptoUtils.padToBigEndian(this.nonce, 64),
            cryptoUtils.padToBigEndian(this.timestamp, 64),
            dataBuffer,
            cryptoUtils.padToBigEndian(this.chainID, 32),
            cryptoUtils.padToBigEndian(this.gasPrice, 128),
            cryptoUtils.padToBigEndian(this.gasLimit, 128)
            );
        return hash;
    },
    /**
     * Sign transaction with the specified algorithm.
     *
     * @example
     * var acc = Account.NewAccount();
     *
     * var tx = new Transaction({
     *    chainID: 1,
     *    from: acc,
     *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
     *    value: 10,
     *    nonce: 12,
     *    gasPrice: 1000000,
     *    gasLimit: 2000000
     * });
     * tx.signTransaction();
     */
    signTransaction: function () {
        if (this.from.getPrivateKey() !== null) {
            this.hash = this.hashTransaction();
            this.alg = SECP256K1;
            this.sign = cryptoUtils.sign(this.hash, this.from.getPrivateKey());
        } else {
            throw new Error("transaction from address's private key is invalid");
        }
    },
    /**
     * Conver transaction data to plain JavaScript object.
     *
     * @return {Object} Plain JavaScript object with Transaction fields.
     * @example
     * var acc = Account.NewAccount();
     * var tx = new Transaction({
     *    chainID: 1,
     *    from: acc,
     *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
     *    value: 10,
     *    nonce: 12,
     *    gasPrice: 1000000,
     *    gasLimit: 2000000
     * });
     * txData = tx.toPlainObject();
     * // {chainID: 1001, from: "n1USdDKeZXQYubA44W2ZVUdW1cjiJuqswxp", to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17", value: 1000000000000000000, nonce: 1, …}
     */
    toPlainObject: function() {
        return {
            chainID: this.chainID,
            from: this.from.getAddressString(),
            to: this.to.getAddressString(),
            value: utils.isBigNumber(this.value) ? this.value.toNumber() : this.value,
            nonce: this.nonce,
            gasPrice: utils.isBigNumber(this.gasPrice) ? this.gasPrice.toNumber() : this.gasPrice,
            gasLimit: utils.isBigNumber(this.gasLimit) ? this.gasLimit.toNumber() : this.gasLimit,
            contract: this.contract
        };
    },
    /**
     * Convert transaction to JSON string.
     * </br><b>Note:</b> Transaction should be [sign]{@link Transaction#signTransaction} before converting.
     *
     * @return {String} JSON stringify of transaction data.
     * @example
     * var acc = Account.NewAccount();
     *
     * var tx = new Transaction({
     *    chainID: 1,
     *    from: acc,
     *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
     *    value: 10,
     *    nonce: 12,
     *    gasPrice: 1000000,
     *    gasLimit: 2000000
     * });
     * tx.signTransaction();
     * var txHash = tx.toString();
     * // "{"chainID":1001,"from":"n1QZMXSZtW7BUerroSms4axNfyBGyFGkrh5","to":"n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17","value":"1000000000000000000","nonce":1,"timestamp":1521905294,"data":{"payloadType":"binary","payload":null},"gasPrice":"1000000","gasLimit":"20000","hash":"f52668b853dd476fd309f21b22ade6bb468262f55402965c3460175b10cb2f20","alg":1,"sign":"cf30d5f61e67bbeb73bb9724ba5ba3744dcbc995521c62f9b5f43efabd9b82f10aaadf19a9cdb05f039d8bf074849ef4b508905bcdea76ae57e464e79c958fa900"}"
     */
    toString: function () {
        if(!this.sign) {
            throw new Error(this.signErrorMessage);
        }
        var payload = utils.isNull(this.data.payload) ? null : JSON.parse(this.data.payload.toString());
        var tx = {
            chainID: this.chainID,
            from: this.from.getAddressString(),
            to: this.to.getAddressString(),
            value: this.value.toString(10),
            nonce: this.nonce,
            timestamp: this.timestamp,
            data: {payloadType: this.data.type, payload:payload},
            gasPrice: this.gasPrice.toString(10),
            gasLimit: this.gasLimit.toString(10),
            hash: this.hash.toString("hex"),
            alg: this.alg,
            sign: this.sign.toString("hex")

        };
        return JSON.stringify(tx);
    },
    /**
     * Convert transaction to Protobuf format.
     * </br><b>Note:</b> Transaction should be [sign]{@link Transaction#signTransaction} before converting.
     *
     * @return {Buffer} Transaction data in Protobuf format
     *
     * @example
     * var acc = Account.NewAccount();
     *
     * var tx = new Transaction({
     *    chainID: 1,
     *    from: acc,
     *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
     *    value: 10,
     *    nonce: 12,
     *    gasPrice: 1000000,
     *    gasLimit: 2000000
     * });
     * tx.signTransaction();
     * var txHash = tx.toProto();
     * // Uint8Array(127)
     */
    toProto: function () {
        if(!this.sign) {
            throw new Error(this.signErrorMessage);
        }
        var Data = root.lookup("corepb.Data");
        var err = Data.verify(this.data);
        if (err) {
            throw err;
        }
        var data = Data.create(this.data);

        var TransactionProto = root.lookup("corepb.Transaction");

        var txData = {
            hash: this.hash,
            from: this.from.getAddress(),
            to: this.to.getAddress(),
            value: cryptoUtils.padToBigEndian(this.value, 128),
            nonce: this.nonce,
            timestamp: this.timestamp,
            data: data,
            chainId: this.chainID,
            gasPrice: cryptoUtils.padToBigEndian(this.gasPrice, 128),
            gasLimit: cryptoUtils.padToBigEndian(this.gasLimit, 128),
            alg: this.alg,
            sign: this.sign
        };

        err = TransactionProto.verify(txData);
        if (err) {
            throw err;
        }
        var tx = TransactionProto.create(txData);

        var txBuffer = TransactionProto.encode(tx).finish();
        return txBuffer;
    },
    /**
     * Convert transaction to Protobuf hash string.
     * </br><b>Note:</b> Transaction should be [sign]{@link Transaction#signTransaction} before converting.
     *
     * @return {Base64} Transaction string.
     *
     * @example
     * var acc = Account.NewAccount();
     *
     * var tx = new Transaction({
     *    chainID: 1,
     *    from: acc,
     *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
     *    value: 10,
     *    nonce: 12,
     *    gasPrice: 1000000,
     *    gasLimit: 2000000
     * });
     * tx.signTransaction();
     * var txHash = tx.toProtoString();
     * // "EhjZTY/gKLhWVVMZ+xoY9GiHOHJcxhc4uxkaGNlNj+AouFZVUxn7Ghj0aIc4clzGFzi7GSIQAAAAAAAAAAAN4Lazp2QAACgBMPCz6tUFOggKBmJpbmFyeUDpB0oQAAAAAAAAAAAAAAAAAA9CQFIQAAAAAAAAAAAAAAAAAABOIA=="
     */
    toProtoString: function () {
        var txBuffer = this.toProto();
        return protobuf.util.base64.encode(txBuffer, 0, txBuffer.length);
    },
    /**
     * Restore Transaction from Protobuf format.
     * @property {Buffer|String} data - Buffer or stringify Buffer.
     *
     * @return {Transaction} Restored transaction.
     *
     * @example
     * var acc = Account.NewAccount();
     *
     * var tx = new Transaction({
     *    chainID: 1,
     *    from: acc,
     *    to: "n1SAeQRVn33bamxN4ehWUT7JGdxipwn8b17",
     *    value: 10,
     *    nonce: 12,
     *    gasPrice: 1000000,
     *    gasLimit: 2000000
     * });
     * var tx = tx.fromProto("EhjZTY/gKLhWVVMZ+xoY9GiHOHJcxhc4uxkaGNlNj+AouFZVUxn7Ghj0aIc4clzGFzi7GSIQAAAAAAAAAAAN4Lazp2QAACgBMPCz6tUFOggKBmJpbmFyeUDpB0oQAAAAAAAAAAAAAAAAAA9CQFIQAAAAAAAAAAAAAAAAAABOIA==");
     */
    fromProto: function (data) {

        var txBuffer;
        if (utils.isString(data)) {
            txBuffer = new Array(protobuf.util.base64.length(data));
            protobuf.util.base64.decode(data, txBuffer, 0);
        } else {
            txBuffer = data;
        }

        var TransactionProto = root.lookup("corepb.Transaction");
        var txProto = TransactionProto.decode(txBuffer);

        this.hash = cryptoUtils.toBuffer(txProto.hash);
        this.from = account.fromAddress(txProto.from);
        this.to = account.fromAddress(txProto.to);
        this.value = utils.toBigNumber("0x" + cryptoUtils.toBuffer(txProto.value).toString("hex"));
        // long number is object, should convert to int
        this.nonce = parseInt(txProto.nonce.toString());
        this.timestamp = parseInt(txProto.timestamp.toString());
        this.data = txProto.data;
        if (this.data.payload.length === 0) {
            this.data.payload = null;
        }
        this.chainID = txProto.chainId;
        this.gasPrice = utils.toBigNumber("0x" + cryptoUtils.toBuffer(txProto.gasPrice).toString("hex"));
        this.gasLimit = utils.toBigNumber("0x" + cryptoUtils.toBuffer(txProto.gasLimit).toString("hex"));
        this.alg = txProto.alg;
        this.sign = cryptoUtils.toBuffer(txProto.sign);

        return this;
    }
};

module.exports = Transaction;
