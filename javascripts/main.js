"use strict";

console.log("works!");

let apiKeys = require('./apiKeys');
let events = require('./events');

events.assignEventHandlers();
apiKeys.retrieveKeys();
