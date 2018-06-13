"use strict";

var handlers = {
    lcs: 1,
    gcs: 2
};

var NativeStorage = function (handler) {
    this.handler = handler;
};

NativeStorage.prototype = {
    get: function(key) {
        return localStorage.getItem(key);
    },
    set: function(key, value) {
        localStorage.setItem(key, value);
        return 0;
    },
    del: function(key) {
        localStorage.removeItem(key);
        return 0;
    }
};

module.exports = {
    handlers: handlers,
    NativeStorage: NativeStorage
};