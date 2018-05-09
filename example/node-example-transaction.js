"use strict";

var Nebulas = require("../index");

var Neb = Nebulas.Neb;
var neb = new Neb();

neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
var Account = Nebulas.Account;
var v3 = '{"address":"n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE","crypto":{"cipher":"aes-128-ctr","ciphertext":"b5041a4b9d4738bc2bcce580aeaadf53aa7c63b6aa3916b76c452630692fc397","cipherparams":{"iv":"f9d54f7854929e9e28731ee69d306a22"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":4096,"p":1,"r":8,"salt":"daa130fd5e3f9a77efe6028170becf7b1d9c73ce5c1d75d1142e90a68df12fed"},"mac":"aa390e6ed50741ed38670d1e1b11a1e44e174f9f66e41acc2e2d1762ebf1dfad","machash":"sha3256"},"id":"078fcad9-8f82-40e0-96c4-fb14b986c134","version":3}';
var acc = new Account();
acc = acc.fromKey(v3, "passphrase", true);

neb.api.getNebState().then((nebstate) => {
    let address = acc.getAddressString();
    neb.api.getAccountState(address).then((accstate) => {
        console.log(JSON.stringify(nebstate));
        console.log(JSON.stringify(accstate));
        let _value = Math.pow(10, 18) * 0.000001;// = 0.000001 NAS
        let _nonce = parseInt(accstate.nonce) + 1;
        let _to = "n1J7bHLFjxggYu156tzEma8NNewCL9varnL";
        //generate transfer information
        var Transaction = Nebulas.Transaction;
        var tx = new Transaction({
            chainID: nebstate.chain_id,
            from: acc,
            to: _to,
            value: _value,
            nonce: _nonce,
            gasPrice: 1000000,
            gasLimit: 2000000
        });
        tx.signTransaction();
        //send a transfer request to the NAS node
        neb.api.sendRawTransaction({
            data: tx.toProtoString()
        }).then((result) => {
            let txhash = result.txhash;
            let trigger = setInterval(() => {
                neb.api.getTransactionReceipt({ hash: txhash }).then((receipt) => {
                    console.log('status', receipt.status);
                    if (receipt.status != 2) //not in pending
                    {
                        console.log(JSON.stringify(receipt));
                        clearInterval(trigger);
                    }
                });
            }, 2000);

        });

    });
});