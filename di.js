const Redis = require("async-redis");
const orchestlySystem = require("./systems/services/orchestly.service");

class DI {
    constructor(){
        this.orchestly = new orchestlySystem(this,process.env.client_id,process.env.client_secret,process.env.refresh_token);
        this.redis = null;
    }

    async connectToRedis(){
        this.redis = Redis.createClient(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    }

}
let di = new DI();

module.exports = di;