const Redis = require("async-redis");
const EventEmitter = require('events');

const orchestlySystem = require("./systems/services/orchestly.service");
const Scheduler = require("./systems/services/scheduler.service");
const ZohoSystem = require("./systems/services/zoho.service");

class DI {
    constructor() {
        this.ee = new EventEmitter();
        this.orchestly = new orchestlySystem(this, process.env.client_id, process.env.client_secret, process.env.refresh_token);
        this.scheduler = new Scheduler(this, {report:["sms"]});
        this.zoho = new ZohoSystem(this, process.env.client_id, process.env.client_secret, process.env.refresh_token);
        this.redis = null;
    }

    async connectToRedis() {
        this.redis = Redis.createClient(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    }

}

let di = new DI();

module.exports = di;