'use strict';

//mocha api.test.js testnet -t 200000
//mocha api.test.js local -t 200000

var expect = require('chai').expect;
var Nebulas = require('../index');
var Neb = Nebulas.Neb;
var Transaction = Nebulas.Transaction;
var Account = Nebulas.Account;
var Buffer = require('safe-buffer').Buffer;
var NetworkConf = require('./network_config.js');


var args = process.argv.splice(2);
var env = args[1];
//var testNetConfig = new TestNetConfig(env);
console.log("env: " + env);

var network = new NetworkConf(env)

var chainID = network.ChainId;
var sourceAccount = network.sourceAccount;
var apiEndPoint = network.apiEndPoint;

//"http://172.16.13.243:8685"
var neb = new Neb(new Nebulas.HttpRequest(apiEndPoint));

function testApi(testInput,testExpect,done){
    neb.api[testInput.api](testInput.args)
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

describe('api test', function () {


    it('api.getNebState',function (done) {
        var testInput = {
            api: 'getNebState',
            args: null
        }
        var testExpect = {
            resultKeys: ['chain_id','tail','lib','height','protocol_version','synchronized','version']
        }
        testApi(testInput,testExpect,done)
    })

    it('api.getAccountState',function (done) {
        var testInput = {
            api: 'getAccountState',
            args: {'address':'n1FLRAxzKTGhWg3SE4fq4sf1w1Lh4oVmnoB',"height":"1"}
        }
        var testExpect = {
            resultKeys: ['balance','nonce','type']
        }
        testApi(testInput,testExpect,done)
    })

    it('api.getAccountState with invalid account',function (done) {
        var testInput = {
            api: 'getAccountState',
            args: {'address':'n1FLRAxzKTGhWg3SE4fq4sf1w1Lh4oVmnob',"height":"1"}
        }
        var testExpect = {
            //resultKeys : ['balance','nonce','type'],
            error : true,
            errorMsg : 'address: invalid address checksum'
        }
        testApi(testInput,testExpect,done)
    })

    it('api.latestIrreversibleBlock',function (done) {
        var testInput = {
            api: 'latestIrreversibleBlock',
            args: null
        }
        var testExpect = {
            resultKeys: ['chain_id','coinbase','consensus_root','events_root','hash','parent_hash','transactions',
                'height','is_finality','miner','nonce','randomProof','randomSeed','state_root','timestamp','txs_root']
        }
        testApi(testInput,testExpect,done)
    })

    it('api.gasPrice',function (done) {
        var testInput = {
            api: 'gasPrice',
            args: null
        }
        var testExpect = {
            resultKeys: ['gas_price']
        }
        testApi(testInput,testExpect,done)
    })

    it('api.getBlockByHash',function (done) {
        var testInput = {
            api: 'getBlockByHash',
            args: {
                'hash': '0000000000000000000000000000000000000000000000000000000000000000',
                "full_fill_transaction" : true
            }
        }
        var testExpect = {
            resultKeys: ['chain_id','coinbase','consensus_root','events_root','hash','parent_hash','transactions',
                'height','is_finality','miner','nonce','randomProof','randomSeed','state_root','timestamp','txs_root']
        }
        testApi(testInput,testExpect,done)
    })

    it('api.GetBlockByHeight',function (done) {
        var testInput = {
            api: 'getBlockByHeight',
            args: {
                'height': 1,
                "full_fill_transaction" : true
            }
        }
        var testExpect = {
            resultKeys: ['chain_id','coinbase','consensus_root','events_root','hash','parent_hash','transactions',
                'height','is_finality','miner','nonce','randomProof','randomSeed','state_root','timestamp','txs_root']
        }
        testApi(testInput,testExpect,done)
    })
    it('api.GetBlockByHeight with invalid height',function (done) {
        var testInput = {
            api: 'getBlockByHeight',
            args: {
                'height': 0,
                "full_fill_transaction" : true
            }
        }
        var testExpect = {
            error : true,
            errorMsg : 'block not found'
        }
        testApi(testInput,testExpect,done)
    })

    it('api.GetDynasty',function (done) {
        var testInput = {
            api: 'getDynasty',
            args: {'height':'1'}
        }
        var testExpect = {
            resultKeys : ['miners']
        }
        testApi(testInput,testExpect,done)
    })
    // it('api.GetDynasty with invalid height',function (done) {
    //     var testInput = {
    //         api: 'getDynasty',
    //         args: {'height':'100000'}
    //     }
    //     var testExpect = {
    //         errorMsg : 'block not found'
    //     }
    //     testApi(testInput,testExpect,done)
    // })

    it('api.sendRawTransaction',function (done) {
        var from = Account.NewAccount()
        var to = from
        var tx = new Transaction({
            chainID: chainID,
            from: from,
            to: to,
            value: 0,
            nonce: 1,
            contract: undefined
        })
        tx.signTransaction()
        console.log(tx.hash.toString('hex'))

        var testInput = {
            api: 'sendRawTransaction',
            args: tx.toProtoString()
        }
        var testExpect = {
            resultKeys: ['txhash', "contract_address"]
        }
        testApi(testInput, testExpect, done)  //test sendRawTransaction
    })

    it('api.sendRawTransaction twice',function (done) {
        var from = Account.NewAccount()
        var to = from
        var tx = new Transaction({
            chainID: chainID,
            from: from,
            to: to,
            value: 0,
            nonce: 1,
            contract: undefined
        })
        tx.signTransaction()
        //console.log(tx.hash.toString('hex'))

        var testInput = {
            api: 'sendRawTransaction',
            args: tx.toProtoString()
        }
        var testExpect = {
            errorMsg: 'duplicated transaction'
        }
        neb.api.sendRawTransaction(tx.toProtoString()).then(function () {
            testApi(testInput, testExpect, done)  //test sendRawTransaction
        })
    })
    it('api.sendRawTransaction deploy contract',function (done) {
        var from = Account.NewAccount()
        var tx = new Transaction({
            chainID: chainID,
            from: from,
            to: from,
            value: 0,
            nonce: 1,
            gasLimit: "20000",
            gasPrice: '1000000',
            contract: {
                sourceType : 'js',
                source: smartContractSource
            }
        })
        tx.signTransaction()
        console.log(tx.hash.toString('hex'))

        var testInput = {
            api: 'sendRawTransaction',
            args: tx.toProtoString()
        }
        var testExpect = {
            resultKeys: ['txhash', "contract_address"]
        }
        testApi(testInput, testExpect, done)  //test sendRawTransaction
    })


    it('api.getTransactionReceipt',function (done) {

        var from = Account.NewAccount()
        var to = from
        var tx = new Transaction({
            chainID: chainID,
            from: from,
            to: to,
            value: 0,
            nonce: 1,
            contract: undefined
        })
        tx.hashTransaction()
        tx.signTransaction()
        console.log(tx.hash.toString('hex'))

        var testInput = {
            api: 'getTransactionReceipt',
            args: tx.hash.toString('hex')
        }
        var testExpect = {
            resultKeys : ['hash','chainId',"from",'to','value','nonce','timestamp','type', "data","gas_price",
                "gas_limit", "contract_address", "status","gas_used","execute_error","execute_result"]
        }

        neb.api.sendRawTransaction(tx.toProtoString()).then(function () {
            testApi(testInput,testExpect,done)
        })
    })

    it('api.getTransactionReceipt with wrong txhash',function (done) {
        //bdd30fc0ea4417f3cf07c6f7102137c4bfd688d7849929c48997a146a044e987
        var txhash = 'bdd30fc0ea4417f3cf07c6f7102137c4bfd688d7849929c48997a146a044e98'

        var testInput = {
            api: 'getTransactionReceipt',
            args: txhash
        }
        var testExpect = {
            errorMsg : "encoding/hex: odd length hex string"
        }

        testApi(testInput,testExpect,done)

    })

    it('api.getTransactionReceipt with wrong txhash(2)',function (done) {
        var txhash = '?dd30fc0ea4417f3cf07c6f7102137c4bfd688d7849929c48997a146a044e987'

        var testInput = {
            api: 'getTransactionReceipt',
            args: txhash //not hex-string
        }
        var testExpect = {
            errorMsg : "encoding/hex: invalid byte: U+003F '?'" //encoding/hex: odd length hex string
        }

        testApi(testInput,testExpect,done)

    })
    it('api.getTransactionReceipt with invalid txhash',function (done) {

        var txhash = 'bdd30fc0ea4417f3cf07c6f7102137c4bfd688d7849929c48997a146a044e987'
        txhash = new Buffer(txhash , 'hex')

        var testInput = {
            api: 'getTransactionReceipt',
            args: txhash        //should be string, here is Buffer
        }
        var testExpect = {
            errorMsg : "invalid argument(s)"  //not a string
        }

        testApi(testInput,testExpect,done)

    })

    it('api.estimateGas', function (done) {
        var address = Account.NewAccount().getAddressString()
        neb.api.estimateGas({
            chainID: chainID,
            from: address,
            to: address,
            value: 0,
            nonce: 1,
            gasPrice: '1000000',
            gasLimit: "20000",
            contract: {
                sourceType : 'js',
                source: smartContractSource
            }
        }).then(function (resp) {
            console.log(resp)  //{ gas_price: '2000000' }
            var keys = ['err',"gas"];
            expect(resp).to.have.all.keys(keys)
            expect(resp.gas).to.equal('20359')  //todo 是否需要测试合约中各种指令的gas消耗
            expect(resp.err).to.equal('insufficient balance')
            done();
        }).catch(function (err) {
            console.log(err)
            done(err);
        })
    });
    it('api.estimateGas with wrong js code', function (done) {
        var address = Account.NewAccount().getAddressString()
        neb.api.estimateGas({
            chainID: chainID,
            from: address,
            to: address,
            value: 0,
            nonce: 1,
            gasPrice: '1000000',
            gasLimit: "20000",
            contract: {
                sourceType : 'js',
                source: smartContractSource_error
            }
        }).then(function (resp) {
            console.log(resp)  //{ gas_price: '2000000' }
            var keys = ['err',"gas"];
            expect(resp).to.have.all.keys(keys)
            expect(resp.gas).to.equal('20318')  //todo 是否需要测试合约中各种指令的gas消耗
            expect(resp.err).to.equal('Deploy: TypeError: __contract is not a constructor')
            done();
        }).catch(function (err) {
            console.log(err)
            done(err);
        })
    });

    //需要测试参数错误, 调用未定义合约接口, 等常见错误
    it('api.call', function (done) {
        var address = Account.NewAccount().getAddressString()
        neb.api.call({
            chainID: chainID,
            from: address,
            to: address,
            value: 0,
            nonce: 1,
            gasLimit: "20000",
            gasPrice: '1000000',
            contract: {
                sourceType : 'js',
                source: smartContractSource
            }
        }).then(function (resp) {
            //console.log(resp)  //{ gas_price: '2000000' }
            var keys = ['estimate_gas',"execute_err",'result'];
            expect(resp).to.have.all.keys(keys)
            expect(resp.result).to.equal('""')
            expect(resp.execute_err).to.equal('insufficient balance')
            expect(resp.estimate_gas).to.equal('20359')
            done();
        }).catch(function (err) {
            console.log(err)
            expect(err.message).to.equal('invalid gasPrice')
            done(err);
        })
    });
    it('api.call with invalid gasPrice', function (done) {
        var address = Account.NewAccount().getAddressString()
        var testInput = {
            api: 'call',
            args: {
                chainID: chainID,
                from: address,
                to: address,
                value: 0,
                nonce: 1,
                gasLimit: "20000",
                //gasPrice: '1000000',
                contract: undefined
            }
        }
        var testExpect = {
            errorMsg: 'invalid gasPrice'
        }
        testApi(testInput, testExpect, done)
    });
    it('api.call deploy with wrong source code', function (done) {
        var address = Account.NewAccount().getAddressString()
        var testInput = {
            api: 'call',
            args: {
                chainID: chainID,
                from: address,
                to: address,
                value: 0,
                nonce: 1,
                gasPrice: '1000000',
                gasLimit: "20000",
                contract: {
                    sourceType : 'js',
                    source: smartContractSource_error
                }
            }
        }
        var testExpect = {
            resultKeys: ['estimate_gas',"execute_err",'result'],
            resultObject: {"result":"TypeError: __contract is not a constructor",
                "execute_err":"Deploy: TypeError: __contract is not a constructor",
                "estimate_gas":"20318"
            }
        }
        testApi(testInput, testExpect, done)
        // neb.api.call({
        //     chainID: chainID,
        //     from: address,
        //     to: address,
        //     value: 0,
        //     nonce: 1,
        //     gasPrice: '1000000',
        //     gasLimit: "20000",
        //     contract: {
        //         sourceType : 'js',
        //         source: smartContractSource_error
        //     }
        // }).then(function (resp) {
        //     console.log(resp)  //{ gas_price: '2000000' }
        //     var keys = ['estimate_gas',"execute_err",'result'];
        //     expect(resp).to.have.all.keys(keys)
        //     expect(resp.estimate_gas).to.equal('20318')  //todo 是否需要测试合约中各种指令的gas消耗
        //     expect(resp.execute_err).to.equal('Deploy: TypeError: __contract is not a constructor')
        //     expect(resp.result).to.equal('TypeError: __contract is not a constructor')
        //     done();
        // }).catch(function (err) {
        //     console.log(err)
        //     done(err);
        // })
    });
    it('api.call deploy with wrong source code 2', function (done) {
        var address = Account.NewAccount().getAddressString()
        var testInput = {
            api: 'call',
            args: {
                chainID: chainID,
                from: address,
                to: address,
                value: 0,
                nonce: 1,
                gasPrice: '1000000',
                gasLimit: "20000",
                contract: {
                    sourceType : 'js',
                    source: smartContractSource_error2
                }
            }
        }
        var testExpect = {
            resultKeys: ['estimate_gas',"execute_err",'result'],
            resultObject: {"result":"","execute_err":"contract code syntax error","estimate_gas":"20378"}
        }
        testApi(testInput, testExpect, done)
    });
    it('api.call deploy with wrong source code 3', function (done) {
        var address = Account.NewAccount().getAddressString()
        var testInput = {
            api: 'call',
            args: {
                chainID: chainID,
                from: address,
                to: address,
                value: 0,
                nonce: 1,
                gasPrice: '1000000',
                gasLimit: "20000",
                contract: {
                    sourceType : 'js',
                    source: smartContractSource_error3
                }
            }
        }
        var testExpect = {
            resultKeys: ['estimate_gas',"execute_err",'result'],
            resultObject: {"result":"ReferenceError: SampleContract is not defined",
                "execute_err":"Deploy: ReferenceError: SampleContract is not defined",
                "estimate_gas":"20351"}
        }
        testApi(testInput, testExpect, done)
    });
    it('api.call deploy with wrong source code 4', function (done) {
        var address = Account.NewAccount().getAddressString()
        var testInput = {
            api: 'call',
            args: {
                chainID: chainID,
                from: address,
                to: address,
                value: 0,
                nonce: 1,
                gasPrice: '1000000',
                gasLimit: "20000",
                contract: {
                    sourceType : 'js',
                    source: smartContractSource_error4
                }
            }
        }
        var testExpect = {
            resultKeys: ['estimate_gas',"execute_err",'result'],
            resultObject: {"result":"TypeError: Cannot read property 'apply' of undefined",
                "execute_err":"Deploy: TypeError: Cannot read property 'apply' of undefined",
                "estimate_gas":"20471"}
        }
        testApi(testInput, testExpect, done)
    });
    it('api.call call with wrong contract address', function (done) {
        var address = Account.NewAccount().getAddressString()
        var testInput = {
            api: 'call',
            args: {
                chainID: chainID,
                from: address,
                to: address,        //not a contract address
                value: 0,
                nonce: 1,
                gasPrice: '1000000',
                gasLimit: "20000",
                contract: {
                    function : 'function',
                    args: undefined
                }
            }
        }
        var testExpect = {
            errorMsg: 'invalid contract'
        }
        testApi(testInput, testExpect, done)
    });
    it('api.call call with non-exist contract address', function (done) {
        var address = Account.NewAccount().getAddressString()
        var testInput = {
            api: 'call',
            args: {
                chainID: chainID,
                from: address,
                //to: 'n1oXdmwuo5jJRExnZR5rbceMEyzRsPeALgm',  //a valid smart-contract address
                to: 'n1nggpdziVAZrxPfhcmUiEcy83pEVX7Li8T',  //a valid smart-contract address
                value: 0,
                nonce: 1,
                gasPrice: '1000000',
                gasLimit: "20000",
                contract: {
                    function: 'function',
                    args: undefined
                }
            }
        }
        var testExpect = {
            resultKeys: ['estimate_gas',"execute_err",'result'],
            resultObject: {"result":"",
                "execute_err":'contract check failed',
                "estimate_gas":"20093"
            }
        }
        testApi(testInput, testExpect, done)
    });

    it('api.getTransactionByContract with non-exist address',function (done) {

        var testInput = {
            api: 'getTransactionByContract',
            //args: 'n1oXdmwuo5jJRExnZR5rbceMEyzRsPeALgm' //a valid but non-exist smart-contract address
            args: 'n1nggpdziVAZrxPfhcmUiEcy83pEVX7Li8T',  //a valid but non-exist smart-contract address
        }
        var testExpect = {
            errorMsg: 'cannot found contract account in storage please check contract address is valid or deploy is success'
        }
        testApi(testInput, testExpect, done)

    })

    var transactionKeys = ['hash','chainId',"from",'to','value','nonce','timestamp','type', "data","gas_price", "gas_limit", "contract_address", "status","gas_used","execute_error","execute_result"]
    var contractAddress;

    //getTransactionByContract & getEventsByHash
    it('api.getTransactionByContract & getEventsByHash', function (done) {

        //var from = Account.NewAccount().fromKey(keyJson,'passphrase')
        var from = sourceAccount
        neb.api.getAccountState(from.getAddressString()).then(function (resp) {
            console.log("account state: " + JSON.stringify(resp))
            var tx = new Transaction({
                chainID: chainID,
                from: from,
                to: from,
                value: 0,
                nonce: parseInt(resp.nonce) + 1,
                gasLimit: "200000",
                gasPrice: '10000000',
                contract: {
                    sourceType: 'js',
                    source: smartContractSource
                }
            })
            tx.signTransaction()
            return neb.api.sendRawTransaction(tx.toProtoString())
        }).then(function (txresp) {
            console.log(txresp)
            checkTransaction(txresp.txhash,function (receipt) {
                //console.log("checked transaction: " + JSON.stringify(receipt))
                if(!receipt){done()}
                neb.api.getTransactionByContract(txresp.contract_address)  //
                .then(function (resp) {
                    console.log("getTransactionByContract: " + JSON.stringify(resp))
                    var resultKeys = transactionKeys
                    expect(resp).to.have.all.keys(resultKeys)

                    return neb.api.getEventsByHash(txresp.txhash)       //
                }).then(function (resp) {
                    console.log("getEventsByHash: " + JSON.stringify(resp))
                    var resultKeys = ['events'];
                    expect(resp).to.have.all.keys(resultKeys)

                    var address = Account.NewAccount().getAddressString()
                    var options = {
                        chainID: chainID,
                        from: address,
                        to: txresp.contract_address,
                        value: 0,
                        nonce: 1,
                        gasLimit: "20000",
                        gasPrice: '1000000',
                        contract: {
                            function : 'helloWorld',
                            args: null
                        }
                    }
                    return neb.api.call(options)        //
                }).then(function (resp) {
                    console.log("api.call of call type: " )// + JSON.stringify(resp))
                    //console.log(resp)
                    var resultKeys = ['estimate_gas',"execute_err",'result']
                    expect(resp).to.have.all.keys(resultKeys)
                    expect(resp).to.be.eql({"result":"\"\"",
                        "execute_err":"insufficient balance",
                        "estimate_gas":"20121"
                    })

                    var address = Account.NewAccount().getAddressString()
                    var options = {
                        chainID: chainID,
                        from: address,
                        to: txresp.contract_address,
                        value: 0,
                        nonce: 1,
                        gasLimit: "20000",
                        gasPrice: '1000000',
                        contract: {
                            function : 'hello',  //wrong function,
                            args: null
                        }
                    }
                    return neb.api.call(options)        //
                }).then(function (resp) {
                    console.log("api.call of call type with wrong function: " ) //+ JSON.stringify(resp))
                    //console.log(resp)
                    expect(resp).to.eql({"result":"TypeError: Cannot read property 'apply' of undefined",
                        "execute_err":"Call: TypeError: Cannot read property 'apply' of undefined",
                        "estimate_gas":"20104"
                    })

                    var address = Account.NewAccount().getAddressString()
                    var options = {
                        chainID: chainID,
                        from: address,
                        to: txresp.contract_address,
                        value: 0,
                        nonce: 1,
                        gasLimit: "20000",
                        gasPrice: '1000000',
                        contract: {
                            function : 'helloWorld',
                            args: ['']  //wrong arg format, 返回错误"json: cannot unmarshal array into Go value of type string"
                        }
                    }
                    return neb.api.call(options)        //
                }).catch(function (error) {
                    console.log("call type: wrong args format.")
                    //console.log(error)
                    expect(error.message).to.equal('json: cannot unmarshal array into Go value of type string')

                    var address = Account.NewAccount().getAddressString()
                    var options = {
                        chainID: chainID,
                        from: address,
                        to: txresp.contract_address,
                        value: 0,
                        nonce: 1,
                        gasLimit: "20000",
                        gasPrice: '1000000',
                        contract: {
                            function : 'helloWorld',
                            args: "args"  //wrong args format, 返回错误"invalid argument(s)"
                        }
                    }
                    return neb.api.call(options)        //
                }).catch(function (error) {
                    console.log("call type: wrong args format.")
                    //console.log(error)
                    expect(error.message).to.equal('invalid argument(s)')
                    done()
                })
                    .catch(function (error) {
                        console.log("chai expect failed.")
                        console.log(error)
                    })

            })
        }).catch(function (err) {
            console.log(err);
            done(err);
        });
    });


})

// function newTransaction() {
//     var from = Account.NewAccount()
//     var to = from
//     return new Transaction({
//         chainID: chainID,
//         from: from,
//         to: to,
//         value: 0,
//         nonce: 1,
//         contract: undefined
//     })
// }

var keyJson = '{"address":"n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE","crypto":{"cipher":"aes-128-ctr","ciphertext":"b5041a4b9d4738bc2bcce580aeaadf53aa7c63b6aa3916b76c452630692fc397","cipherparams":{"iv":"f9d54f7854929e9e28731ee69d306a22"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":4096,"p":1,"r":8,"salt":"daa130fd5e3f9a77efe6028170becf7b1d9c73ce5c1d75d1142e90a68df12fed"},"mac":"aa390e6ed50741ed38670d1e1b11a1e44e174f9f66e41acc2e2d1762ebf1dfad","machash":"sha3256"},"id":"078fcad9-8f82-40e0-96c4-fb14b986c134","version":3}';

var smartContractSource =`
'use strict'
var SampleContract = function () {}
SampleContract.prototype = {
    init: function () {},
    helloWorld: function () {
        console.log("Hello world from Smart-Contract!")
    }
}
module.exports = SampleContract;
`;

var smartContractSource_error =`
'use strict'
var SampleContract = function () {}
SampleContract.prototype = {
    init: function () {},
    helloWorld: function () {
        console.log("Hello world from Smart-Contract!")
    }
}
`;
var smartContractSource_error2 =`
'use strict'
var SampleContract = function () {}
SampleContract.prototype = {
    init: function () {},
    helloWorld: functio () { //"contract code syntax error" 
        console.log("Hello world from Smart-Contract!")
    }
}
module.exports = SampleContract;
`;

var smartContractSource_error3 =`
'use strict'
var SampleContrac = function () {}
SampleContract.prototype = {
    init: function () {},
    helloWorld: function () {
        console.log("Hello world from Smart-Contract!")
    }
}
module.exports = SampleContract;
`;
var smartContractSource_error4 =`
'use strict'
var SampleContract = function () {}  
SampleContract.prototype = { //prototype写错,也是同样的错误
    //init: function () {},  //"Deploy: TypeError: Cannot read property 'apply' of undefined"
    helloWorld: function () {
        console.log("Hello world from Smart-Contract!")
    }
}
module.exports = SampleContract;
`;

var checkTimes = 0
var maxCheckTime = 25
function checkTransaction(hash, callback) {
    checkTimes += 1;

    if (checkTimes > maxCheckTime) {
        console.log("check tx receipt timeout: " + hash);
        checkTimes = 0;
        callback();
        return;
    }
    neb.api.getTransactionReceipt(hash).then(function (resp) {
        console.log("0. tx receipt status:" + resp.status);
        console.log("checkTimes: " + checkTimes)
        if (resp.status === 2) {
            setTimeout(function () {
                checkTransaction(hash, callback);
            }, 2000);
        } else {
            checkTimes = 0;
            callback(resp);
        }
    }).catch(function (err) {
        console.log("1. fail to get tx receipt hash: " + hash);
        console.log("2. error: " + JSON.stringify(err));
        setTimeout(function () {
            checkTransaction(hash, callback);
        }, 2000);
    });
}
