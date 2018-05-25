

global;

if (typeof window !== "undefined") {
    global = window;
}

if (typeof localStorage === "undefined" || localStorage === null) {
    var path = require("path");
    var storageFile = path.join(__dirname, "./.storage");
    var LocalStorage = require('node-localstorage').LocalStorage;
    global.localStorage = new LocalStorage(storageFile);
}

global.context = require("./context");
global._native_blockchain = require("./native/blockchain");
global._native_log = require("./native/log");
global._native_event_trigger = require("./native/event");
global._native_storage_handlers = require("./native/storage").handlers;
global.NativeStorage = require("./native/storage").NativeStorage;

global.nativeConsole = global.console;
global.console = require("./libs/console");
global.ContractStorage = require("./libs/storage");
global.LocalContractStorage = global.ContractStorage.lcs;
// global.GlobalContractStorage = ContractStorage.gcs;
global.BigNumber = require("bignumber.js");
global.Blockchain = require("./libs/blockchain");
global.Event = require("./libs/event");

global.Date = require('./libs/date');
global.Math.random = require('./libs/random');
global.BigNumber.random = global.Math.random;

module.exports = {
    context: global.context
};

