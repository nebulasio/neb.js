"use strict";

var axios = require("axios");

var debugLog = true;

var HttpRequest = function (host, timeout, apiVersion) {
    this.host = host || "http://localhost:8090";
    this.timeout = timeout || 0;
    this.apiVersion = apiVersion || "v1";
};

HttpRequest.prototype.setHost = function (host) {
    this.host = host;
};

HttpRequest.prototype.setAPIVersion = function (apiVersion) {
    this.apiVersion = apiVersion;
};

HttpRequest.prototype.createUrl = function (api) {
    return this.host + "/" + this.apiVersion + api;
};

HttpRequest.prototype.request = function (method, api, payload, callback) {
    if (debugLog) {
        console.log("[debug] HttpRequest: " + method + " " + this.createUrl(api) + " " + JSON.stringify(payload));
    }

    return axios({
        method: method,
        url: this.createUrl(api),
        data: payload,
        transformResponse: [function (resp) {
            if (typeof (resp) === "string") {
                resp = JSON.parse(resp);
            }
            return resp.result || resp;
        }]
    }).then(function (resp) {
        return resp.data;
    }).catch(function (e) {
        return e.response.data;
    });
};

HttpRequest.prototype.asyncRequest = function (method, api, payload, callback) {
    return this.request(method, api, payload).then(function (data) {
        callback(data);
    }).catch(function (err) {
        callback(err);
    });
};

module.exports = HttpRequest;
