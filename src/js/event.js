var EventEmitter = require('events').EventEmitter;
EventEmitter.defaultMaxListeners = 40;
let Event = new EventEmitter();

export default Event;
