"use strict";

var trigger = function(topic, data) {
    var event = {
        Topic: topic,
        Data: data
    };
    var key = context.transaction.hash;
    var events = localStorage.getItem(key);
    if (typeof events === "undefined") {
        events = new Array();
    }
    events.push(event);
    localStorage.setItem(key, events);
};

module.exports = trigger;