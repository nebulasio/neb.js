'use strict';
//mocha admin.test.js

var expect = require('chai').expect;
var Nebulas = require('../index')
var Neb = Nebulas.Neb

//var neb = new Neb(new Nebulas.HttpRequest("http://127.0.0.1:8685"))
var neb = new Neb(new Nebulas.HttpRequest("http://172.16.13.243:8685"))

var admin = neb.admin

function testAdmin(testInput,testExpect,done){
    neb.admin[testInput.api](testInput.args)
        .then(function (resp) {
            console.log(`response of ${testInput.api}: ` + JSON.stringify(resp))  //e.g. { gas_price: '2000000' }
            expect(resp).to.have.all.keys(testExpect.resultKeys)
            if(testExpect.resultObject){
                expect(resp).to.eql(testExpect.resultObject) //.and.equal(testExpect.resultObject)
            }
            done();
        })
        .catch(function (err) {
            console.log(`error of ${testInput.api}: ` + err.message)
            if(testExpect.errorMsg){        //判断是否为期望的错误
                expect(err.message).to.equal(testExpect.errorMsg);
                done()
                return
            }
            done(err);
        })
        .catch(function (err) {     //捕捉上面的expect失败的情况(不是期望的错误)
            console.log(err.message)
            done(err)
        })
}

describe('admin test', function () {


    it('admin.accounts', function (done) {
        var testInput = {
            api: 'accounts',
            args: null
        }
        var testExpect = {
            resultKeys: ['addresses']
        }
        testAdmin(testInput, testExpect, done)
    })

    it('admin.getConfig', function (done) {
        var testInput = {
            api: 'getConfig',
            args: null
        }
        var testExpect = {
            resultKeys: ['config']
        }
        testAdmin(testInput, testExpect, done)
    })

    it('admin.nodeInfo', function (done) {
        var testInput = {
            api: 'nodeInfo',
            args: null
        }
        var testExpect = {
            resultKeys: ["bucket_size","chain_id","coinbase","id","peer_count","protocol_version","route_table","synchronized"
            ]
        }
        testAdmin(testInput, testExpect, done)
    })

    // it('admin.newAccount', function (done) {
    //     var testInput = {
    //         api: 'newAccount',
    //         args: "passphrase"
    //     }
    //     var testExpect = {
    //         resultKeys: ["address"
    //         ]
    //     }
    //     testAdmin(testInput, testExpect, done)
    // })

    it("admin.lockAccount while it's locked", function (done) {
        var testInput = {
            api: 'lockAccount',
            args: {
                "address": "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE"
            }
        }
        var testExpect = {
            errorMsg: 'key not unlocked'
        }
        testAdmin(testInput, testExpect, done)
    })

    it('admin.signHash with account locked', function (done) {
        var testInput = {
            api: 'signHash',
            args: {
                address: "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE",
                hash: '74dc6a7fda21ecc31ed555860ce4811027628bad4796f8f64469602749f4d73b',
                alg: 1
            }
        }
        var testExpect = {
            //resultKeys: ['txhash', "contract_address"],
            errorMsg: 'account is locked'
        }
        testAdmin(testInput, testExpect, done)
    })

    it('admin.unlockAccount', function (done) {
        var testInput = {
            api: 'unlockAccount',
            args: {
                "address": "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE",
                "passphrase": "passphrase",
                'duration': 10000000000 //10s
            }
        }
        var testExpect = {
            resultKeys: ['result']
        }
        testAdmin(testInput, testExpect, done)
    })

    it('admin.sendTransaction', function (done) {
        var testInput = {
            api: 'sendTransaction',
            args: {
                from: 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE',
                to: 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE',
                value: 0,
                nonce: 1,
                gasLimit: "20000",
                gasPrice: '1000000',
                contract: undefined
            }
        }
        var testExpect = {
            resultKeys: ['txhash', "contract_address"],
            errorMsg: 'transaction\'s nonce is invalid, should bigger than the from\'s nonce'
        }
        testAdmin(testInput, testExpect, done)
    })

    it('admin.signHash', function (done) {
        var testInput = {
            api: 'signHash',
            args: {
                address: "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE",
                hash:"W+rOKNqs/tlvz02ez77yIYMCOr2EubpuNh5LvmwceI0=", //should be base64 coded
                //hash: 'ac3773e06ae74c0fa566b0e421d4e391333f31aef90b383f0c0e83e4873609d6', //invalid message length, need 32 bytes
                //hash : new Buffer('ac3773e06ae74c0fa566b0e421d4e391333f31aef90b383f0c0e83e4873609d6','hex'), // json: cannot unmarshal object into Go value of type []uint8
                alg: 1
            }
        }
        var testExpect = {
            resultKeys: ["data"],
            //errorMsg: 'account is locked'
        }
        testAdmin(testInput, testExpect, done)
    })
    it('admin.lockAccount', function (done) {
        var testInput = {
            api: 'lockAccount',
            args: {
                "address": "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE"
            }
        }
        var testExpect = {
            resultKeys: ['result']
        }
        testAdmin(testInput, testExpect, done)
    })

    it('admin.signTransactionWithPassphrase', function (done) {
        var testInput = {
            api: 'signTransactionWithPassphrase',
            args: {
                from: 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE',
                to: 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE',
                value: 0,
                nonce: 1,
                gasLimit: "20000",
                gasPrice: '1000000',
                contract: undefined,
                "passphrase": "passphrase"
            }
        }
        var testExpect = {
            resultKeys: ['data']
        }
        testAdmin(testInput, testExpect, done)
    })
    it('admin.sendTransactionWithPassphrase', function (done) {
        var testInput = {
            api: 'sendTransactionWithPassphrase',
            args: {
                from: 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE',
                to: 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE',
                value: 0,
                nonce: 1,
                gasLimit: "20000",
                gasPrice: '1000000',
                contract: undefined,
                "passphrase": "passphrase"
            }
        }
        var testExpect = {
            resultKeys: ['txhash', "contract_address"],
            errorMsg: 'transaction\'s nonce is invalid, should bigger than the from\'s nonce'
        }
        testAdmin(testInput, testExpect, done)
    })

    it('admin.signHash with account locked', function (done) {
        var testInput = {
            api: 'signHash',
            args: {
                address: "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE",
                hash: '74dc6a7fda21ecc31ed555860ce4811027628bad4796f8f64469602749f4d73b',
                alg: 1
            }
        }
        var testExpect = {
            resultKeys: ['txhash', "contract_address"],
            errorMsg: 'account is locked'
        }
        testAdmin(testInput, testExpect, done)
    })

    it('admin.startPprof', function (done) {
        var testInput = {
            api: 'startPprof',
            args: null
        }
        var testExpect = {
            resultKeys: ['result'],
            //errorMsg: 'account is locked'
        }
        testAdmin(testInput, testExpect, done)
    })

})
