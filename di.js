const Redis = require("async-redis");
const zohoSystem = require("./systems/zoho_auth.system");

class di {
    constructor(){
        this.zoho = new zohoSystem(process.env.client_id,process.env.client_secret,process.env.refresh_token);
        this.redis = null;
    }

    async connectToRedis(){
        this.redis = await Redis.createClient(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
        await this.redis.get("TEST_VALUE");
    }
}

module.exports = di;