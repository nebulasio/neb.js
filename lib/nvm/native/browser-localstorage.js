'use strict';

// go env doesn't have and need localStorage
if (typeof localStorage === 'undefined') {
    exports.localStorage = {};
} else {
    exports.localStorage = localStorage; // jshint ignore:line
}