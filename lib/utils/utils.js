
"use strict";

var BigNumber = require('bignumber.js');

var isNull = function (v) {
    return v === null || typeof v === "undefined";
};

var isBrowser = function () {
    return (typeof window !== "undefined");
};

var isBigNumber = function (obj) {
    return obj instanceof BigNumber ||
        (obj && obj.constructor && obj.constructor.name === 'BigNumber');
};

var isString = function (obj) {
    return typeof obj === 'string' && obj.constructor === String;
};

var isObject = function (obj) {
    return obj !== null && typeof obj === 'object';
};

var isFunction = function (object) {
    return typeof object === 'function';
};

var isNumber = function (object) {
	return typeof object === 'number';
};

var toBigNumber = function (number) {
	number = number || 0;
	if (isBigNumber(number)) {
		return number;
	}
	if (isString(number) && number.indexOf('0x') === 0) {
        return new BigNumber(number.replace('0x',''), 16);
    }
    return new BigNumber(number.toString(10), 10);
};

var toString = function (obj) {
	if (isString(obj)) {
		return obj;
	} else if (isBigNumber(obj)) {
		return obj.toString(10);
	} else if (isObject(obj)) {
		return JSON.stringify(obj);
	} else {
		return obj + "";
	}
};

// Transform Array-like arguments object to common array.
var argumentsToArray = function(args) {
	var len = args.length,
		resultArray = new Array(len);

	for (var i = 0; i < len; i += 1) {
		resultArray[i] = args[i];
	}
	return resultArray;
};

// Create object based on provided arrays
var zipArraysToObject = function(keysArr, valuesArr) {
	var resultObject = {};

	for (var i = 0; i < keysArr.length; i += 1) {
		resultObject[keysArr[i]] = valuesArr[i];
	}
	return resultObject;
};

// Function what make overall view for arguments.
// If arguments was provided separated by commas like "func(arg1 ,arg2)" we create
// ArgumentsObject and write keys from argsNames and value from args.
// in case wheare we provide args in object like "func({arg1: value})"
// we just return that object
var argumentsToObject = function(keys, args) {
	var ArgumentsObject = {};

	args = argumentsToArray(args);
	if ( isObject(args[0]) ) {
		ArgumentsObject = args[0];
	} else {
		ArgumentsObject = zipArraysToObject(keys, args);
	}

	return ArgumentsObject;
};

module.exports = {
    isNull: isNull,
    isBrowser: isBrowser,
	isBigNumber: isBigNumber,
	isString: isString,
	isObject: isObject,
	isFunction: isFunction,
	isNumber: isNumber,
	toBigNumber: toBigNumber,
	toString: toString,
	argumentsToObject: argumentsToObject,
	zipArraysToObject: zipArraysToObject
};
