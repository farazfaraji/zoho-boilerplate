const axios = require("axios");
const ZohoAuth = require("./zoho_auth.service");

const di = require("../../di");

class Zoho extends ZohoAuth {
    constructor(di, _client_id, _client_secret, _refresh_token) {
        super(di, _client_id, _client_secret, _refresh_token)
    }

    async search(moduleName, criteria) {
        try {
            const parameter = {
                criteria
            };
            return await this.customRequest(`https://www.zohoapis.com/crm/v2/${moduleName}/search`, "GET",parameter);
        }catch (e) {
            console.error(e);
        }

    }

    async update(moduleName,record_id,data ) {
        try {
            return await this.customRequest(`https://www.zohoapis.com/crm/v2/${moduleName}/${record_id}`, "PUT",data);
        }catch (e) {
            console.error(e);
        }

    }


}

module.exports = Zoho;
