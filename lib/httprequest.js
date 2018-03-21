"use strict";

var Promise = require('promise/lib/es6-extensions');
var XMLHttpRequest;

// browser
if (typeof window !== "undefined" && window.XMLHttpRequest) {
    XMLHttpRequest = window.XMLHttpRequest;

    // node
} else {
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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

HttpRequest.prototype.request = function (method, action, payload) {
	var request = this._newRequest(method, action, true);

    var promise = new Promise(function (resolve, reject) {
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

                if (error !== null) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        };

        request.ontimeout = function () {
            reject(new Error("connection timeout"));
        };

        try {
            if (payload === undefined || payload === "") {
                request.send();
            } else {
                request.send(JSON.stringify(payload));
            }
        } catch (error) {
            reject(error);
        }
    });

    return promise;
};

HttpRequest.prototype.asyncRequest = function (method, api, payload, callback) {
    this.request(method, api, payload).then(function (resp) {
        callback(null, resp);
    }).catch(function (err) {
        callback(err);
    });
};

module.exports = HttpRequest;
