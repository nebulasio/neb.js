'use strict';

//mocha transaction.test.js

var expect = require('chai').expect;
var Nebulas = require('../index')
var Neb = Nebulas.Neb
var Account = Nebulas.Account
var Transaction = Nebulas.Transaction

//var neb = new Neb(new Nebulas.HttpRequest("http://172.16.13.243:8685"));

describe('account test', function () {

    it('new Transaction ', function (done) {
        var account = new Account()
        var options = {
            chainID: 100,
            from: account,
            to: account,
            value: 0,
            nonce: 1,
            //gasLimit: "20000",
            //gasPrice: '1000000',
            contract: undefined
        }
        var tx = new Transaction(options);
        tx.signTransaction()
        console.log(tx.toString())
        done()
    })

    it('toProtoString', function (done) {
        var account = new Account()
        var options = {
            chainID: 100,
            from: account,
            to: account,
            value: 0,
            nonce: '1',
            //gasLimit: "20000",
            //gasPrice: '1000000',
            contract: undefined
        }
        var tx = new Transaction(options);
        tx.signTransaction()
        try{
            tx.toProtoString()
            console.log(tx.toProtoString())
        }catch (err) {
            console.log(err)
            expect(err).to.equal("nonce: integer|Long expected")
        }
        done()
    })


})
