'use strict';

var Nebulas = require('../index');


var NetworkConf = function (env) {

    this.ChainId = undefined;
    this.SourceAccount = "";
    this.apiEndPoint = "";

    if (env === 'testnet') {

        this.ChainId = 1001;
        this.sourceAccount = new Nebulas.Account("6c41a31b4e689e1441c930ce4c34b74cc037bd5e68bbd6878adb2facf62aa7f3"); //n1H2Yb5Q6ZfKvs61htVSV4b1U2gr2GA9vo6
        this.apiEndPoint = "https://testnet.nebulas.io";

    }
    else if (env === "local") {

        this.ChainId = 100;
        this.sourceAccount = new Nebulas.Account("1d3fe06a53919e728315e2ccca41d4aa5b190845a79007797517e62dbc0df454"); //n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE
        this.apiEndPoint = "http://127.0.0.1:8685";
        //this.apiEndPoint = "http://172.16.13.243:8685";
    }
    else { //if specify other network, use local
        console.log("====> could not found specified env: " + env + ", using local env instead");
        console.log("====> example: mocha cases/contract/xxx testneb2 -t 2000000");
        env = "local";
        // throw new Error("invalid env (" + env + ").");

        this.ChainId = 100;
        this.sourceAccount = new Nebulas.Account("1d3fe06a53919e728315e2ccca41d4aa5b190845a79007797517e62dbc0df454");
        this.apiEndPoint = "http://127.0.0.1:8685";
        //this.apiEndPoint = "http://172.16.13.243:8685";
    }
    console.log("\n=====> running: env:", env, " ChainId:", this.ChainId, " apiEndPoint:", this.apiEndPoint, " time:", new Date());

};

module.exports = NetworkConf;
