"use strict";

var axios = require("axios");

var debugLog = false;

var HttpRequest = function (host, timeout, apiVersion) {
    this.host = host || "http://localhost:8685";
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

HttpRequest.prototype.request = function (method, api, payload, axiosOptions) {
    if (debugLog) {
        console.log("[debug] HttpRequest: " + method + " " + this.createUrl(api) + " " + JSON.stringify(payload));
    }

    var axiosParams = {
        method: method,
        url: this.createUrl(api),
        data: payload,
        transformResponse: [function (resp) {
            if (typeof (resp) === "string") {
                resp = JSON.parse(resp);
            }
            return resp.result || resp;
        }]
    };
    if (axiosOptions && typeof axiosOptions.onDownloadProgress === 'function') {
        axiosParams.onDownloadProgress = axiosOptions.onDownloadProgress;
    }
    return axios(axiosParams).then(function (resp) {
        return resp.data;
    }).catch(function (e) {
        if (typeof e.response !== "undefined") {
            throw new Error(e.response.data.error);
        } else {
            throw new Error(e.message);
        }
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
