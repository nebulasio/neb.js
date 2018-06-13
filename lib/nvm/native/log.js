"use strict";

var log = function(level, msg) {
    var levelStr;
    switch(level) {
        case 1:
            levelStr = "debug"; 
        case 2:
            levelStr = "warn";
        case 3:
            levelStr = "info";
        case 4:
            levelStr = "error";
        default:
            levelStr = "info";
    }
    var log = levelStr + ":" + msg;
    nativeConsole.log(log);
};

module.exports = log;