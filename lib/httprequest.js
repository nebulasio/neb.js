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
	};
	if (axiosOptions && typeof axiosOptions.onDownloadProgress === 'function') {
		axiosParams.onDownloadProgress = axiosOptions.onDownloadProgress;
	}
	return axios(axiosParams).then(function (resp) {
		if("text/html; charset=UTF-8" === resp.headers['content-type']){
			throw new Error(resp.status+' - '+resp.statusText);
		}
		if(typeof(resp.data) === "string"){
			try{
				resp.data = JSON.parse(resp.data);
			} catch(e){
				throw new Error('Response is invalid json');
			}
		}
		return resp.data.result || resp.data;
	}).catch(function (e) {
		if (typeof e.response !== "undefined") {
		    if(typeof(e.response.data) === 'object'){   //400 error
                throw new Error(e.response.data.error);
            }else {     //500 error
                var err = e.response.status + ' - ' + e.response.statusText;
                err += "\n" + api + " " + JSON.stringify(payload);
                throw new Error(err);
            }

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
