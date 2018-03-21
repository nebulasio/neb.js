"use strict";

var Nebulas = require("../index");

 var Neb = Nebulas.Neb;
 var neb = new Neb();
 neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));

 neb.api.getAccountState("n1PfySvoUyNfWg6xKDohK96TCWbSxQXLdwB").then(function (state) {
     console.log(state);
 }).catch(function (err) {
     console.log(err);
 });

var Account = Nebulas.Account;
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

var Transaction = Nebulas.Transaction;
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

var cryptoUtils = Nebulas.CryptoUtils;
console.log("black：" + cryptoUtils.sha3("").toString("hex"));
console.log("Hello, world：" + cryptoUtils.sha3("Hello, world").toString("hex"));
