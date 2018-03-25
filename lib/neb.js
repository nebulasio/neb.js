
"use strict";

var API = require("./api.js");
var Admin = require("./admin.js");

var Unit = require("./utils/unit.js");

/**
 * Neb API library constructor.
 * @constructor
 * @param {Request} request - transport wrapper.
 */
var Neb = function (request) {
	if (request) {
		this._request = request;
	}

	this.api = new API(this);
	this.admin = new Admin(this);
};

Neb.prototype.setRequest = function (request) {
	this._request = request;
	this.api._setRequest(request);
	this.admin._setRequest(request);
};

Neb.prototype.toBasic = Unit.toBasic;
Neb.prototype.fromBasic = Unit.fromBasic;
Neb.prototype.nasToBasic = Unit.nasToBasic;

module.exports = Neb;
