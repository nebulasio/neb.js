"use strict";

var trigger = function(topic, data) {
    var event = {
        Topic: topic,
        Data: data
    };
    var key = context.transaction.hash;
    var events = localStorage.getItem(key);
    if (events === null || typeof events === "undefined") {
        events = new Array();
    } else {
        events = Array.from(events);
    }
    events.push(event);
    localStorage.setItem(key, events);
};

module.exports = trigger;