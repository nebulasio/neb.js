"use strict";

 var Neb = require("../lib/neb");
 var neb = new Neb();

 neb.api.getAccountState("n1PfySvoUyNfWg6xKDohK96TCWbSxQXLdwB").then(function (state) {
     console.log(state);
 }).catch(function (err) {
     console.log(err);
 });

 return;

var Account = require("../lib/account");
var account = Account.NewAccount();
console.log(account.getPrivateKeyString());
console.log(account.getPublicKeyString());
console.log(account.getAddressString());
console.log(Account.isValidAddress(account.getAddressString()));
var key = account.toKey("passphrase");
console.log(JSON.stringify(key));
console.log("********************");
var a1 = new Account();
a1 = a1.fromKey(key, "passphrase");
console.log(a1.getPrivateKeyString());
var Transaction = require("../lib/transaction");
var tx = new Transaction(100, account, account, "10", 1);
tx.signTransaction();
console.log("hash:" + tx.hash.toString("hex"));
console.log("sign:" + tx.sign.toString("hex"));
console.log(tx.toString());
var data = tx.toProtoString();
console.log(data);
tx.fromProto(data);
console.log(tx.toString());
console.log("address:"+tx.from.getAddressString());

var cryptoUtils = require("../lib/utils/crypto-utils");
console.log("black：" + cryptoUtils.sha3("").toString("hex"));
console.log("Hello, world：" + cryptoUtils.sha3("Hello, world").toString("hex"));
