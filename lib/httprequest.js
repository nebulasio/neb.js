
"use strict";

var XMLHttpRequest;
var utils = require('./utils/utils.js');
// browser
if (typeof window !== "undefined" && window.XMLHttpRequest) {
	XMLHttpRequest = window.XMLHttpRequest;
	// node
} else {
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	// XMLHttpRequest = require('xhr2');
}

var HttpRequest = function (host, timeout, apiVersion) {
	this.host = host || "http://localhost:8685";
	this.timeout = timeout || 0;
	this.APIVersion = apiVersion || 'v1';
};

HttpRequest.prototype.setHost = function (host) {
	this.host = host || "http://localhost:8685";
};

HttpRequest.prototype.setAPIVersion = function (APIVersion) {
	this.APIVersion = APIVersion;
};

HttpRequest.prototype.createUrl = function (action) {
	return this.host + '/' + this.APIVersion + action;
};

HttpRequest.prototype._newRequest = function (method, action, async) {
	var request = new XMLHttpRequest();
	var m = "GET";
	if (method.toUpperCase() === "POST") {
		m = "POST";
	}

	request.open(m, this.createUrl(action), async);
	return request;
};

HttpRequest.prototype.syncRequest = function (method, action, payload) {
	var request = this._newRequest(method, action, false);
	try {
		if (payload === undefined || payload === "") {
			request.send();
		} else {
			request.send(JSON.stringify(payload));
		}
	} catch (error) {
		throw error;
	}

	var result = request.responseText;
	try {
		result = JSON.parse(result);
	} catch (e) {
		throw e;
	}

	return result;
};

HttpRequest.prototype.request = function (method, action, payload, callback) {
	if ( !utils.isFunction(callback) ) {
        return this.syncRequest(method, action, payload);
	}

	var request = this._newRequest(method, action, true);
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.timeout !== 1) {
			var result = request.responseText;
			var error = null;

			try {
				result = JSON.parse(result);
			} catch (e) {
				var message = !!result && !!result.error && !!result.error.message ? result.error.message : "Invalid response: " + JSON.stringify(result);
				error = new Error(message);
			}

			callback(error, result);
		}
	};

	request.ontimeout = function () {
		callback(new Error("connection timeout"));
	};

	try {
		if (payload === undefined || payload === "") {
			request.send();
		} else {
			request.send(JSON.stringify(payload));
		}
	} catch (error) {
		callback(error);
	}
};

module.exports = HttpRequest;
