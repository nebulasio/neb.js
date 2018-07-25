'use strict';

// mocha account.test.js

var expect = require('chai').expect;
var Nebulas = require('../index')
var Neb = Nebulas.Neb
var Account = Nebulas.Account


// var args = process.argv.splice(2);
// var env = args[1];
// //var testNetConfig = new TestNetConfig(env);
// console.log('env: ' + env);

//var neb = new Neb(new Nebulas.HttpRequest("http://172.16.13.243:8685"));

var keyJson = '{"address":"n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE","crypto":{"cipher":"aes-128-ctr","ciphertext":"b5041a4b9d4738bc2bcce580aeaadf53aa7c63b6aa3916b76c452630692fc397","cipherparams":{"iv":"f9d54f7854929e9e28731ee69d306a22"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":4096,"p":1,"r":8,"salt":"daa130fd5e3f9a77efe6028170becf7b1d9c73ce5c1d75d1142e90a68df12fed"},"mac":"aa390e6ed50741ed38670d1e1b11a1e44e174f9f66e41acc2e2d1762ebf1dfad","machash":"sha3256"},"id":"078fcad9-8f82-40e0-96c4-fb14b986c134","version":3}';

var givenAddress = 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE'
var givenPrivateKey = '1d3fe06a53919e728315e2ccca41d4aa5b190845a79007797517e62dbc0df454'

describe('account test', function () {

    it('new Account ', function (done) {
        var account = new Account();
        //console.log(account.getAddressString())
        var isValid = Account.isValidAddress(account.getAddressString())
        expect(isValid).to.equal(true)
        done()
    })

    it('new Account (2)', function (done) {
        var account = new Account(new Buffer("ac3773e06ae74c0fa566b0e421d4e391333f31aef90b383f0c0e83e4873609d6", "hex") );
        //console.log(account.getAddressString())
        var isValid = Account.isValidAddress(account.getAddressString())
        expect(isValid).to.equal(true)
        expect(account.getAddressString()).to.equal('n1LfrjZzXDCcHhNV2r6F6dUS5Zxi7P8xC45')
        done()
    })

    it('new Account (3)', function (done) {
        var account = new Account("ac3773e06ae74c0fa566b0e421d4e391333f31aef90b383f0c0e83e4873609d6");
        //console.log(account.getAddressString())
        var isValid = Account.isValidAddress(account.getAddressString())
        expect(isValid).to.equal(true)
        done()
    })

    it('NewAccount(3)', function (done) {
        var account = new Account("ac3773e06ae74c0fa566b0e421d4e391333f31aef90b383f0c0e83e4873609d6");
        //console.log(account.getAddressString())
        var isValid = Account.isValidAddress(account.getAddressString())
        expect(isValid).to.equal(true)
        done()
    })

    it('set private key', function (done) {
        var account = new Account();
        account.setPrivateKey(givenPrivateKey);
        expect(account.getAddressString()).to.equal(givenAddress);
        done()
    })

    it('import keyJson', function (done) {
        var account = Account.prototype.fromKey(keyJson,"passphrase"); //keyJson should be string or object
        var address = account.getAddressString()
        expect(Account.isValidAddress(address)).to.equal(true)
        expect(JSON.parse(keyJson).address).to.equal(address)
        done()
    })

    it('export keyJson', function (done) {
        var account = new Account()
        var keyJson = account.toKeyString('passphrase')
        //console.log(keyJson)

        var account2 = Account.prototype.fromKey(keyJson,"passphrase");
        expect(account2.getAddressString()).to.equal(account.getAddressString())

        done()
    })

})
