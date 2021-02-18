const axios = require("axios");
const ZohoAuth = require("./zoho_auth.service");

const di = require("../../di");

class Orchestly extends ZohoAuth {

    async getAllJobs(index, range) {
        const token = await di.zoho.getToken();
        try {
            let url = 'https://orchestlyapi.zoho.com/blueprint/api/sigmagroup/job';
            const response = await axios.get(url, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': `Zoho-oauthtoken ${token}`,
                },
            });
            return response.data;
        } catch (e) {
            console.error(e.response.data);
        }
    }

    async getAllReport(org_id) {
        try {
            const response = await this.customRequest(`https://orchestlyapi.zoho.com/blueprint/api/${org_id}/reportfolder`,"GET");
            return response.data;
        } catch (e) {
            console.error(e.response.data);
        }
    }
}

module.exports = Orchestly;
