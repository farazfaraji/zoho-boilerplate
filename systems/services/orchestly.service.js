const axios = require("axios");
const ZohoAuth = require("./zoho_auth.service");

const di = require("../../di");

class Orchestly extends ZohoAuth {
    constructor(di, _client_id, _client_secret, _refresh_token) {
        super(di, _client_id, _client_secret, _refresh_token)
    }

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

    async getAllReports(org_id) {
        try {
            return await this.customRequest(`https://orchestlyapi.zoho.com/blueprint/api/${org_id}/reportfolder`, "GET");
        } catch (e) {
            if (e.response !== undefined)
                console.error(e.response.data);
            else
                console.error(e.message);
        }
    }

    async getReport(org_id,report_id) {
        try {
            return await this.customRequest(`https://orchestlyapi.zoho.com/blueprint/api/${org_id}/reports/${report_id}`, "GET");
        } catch (e) {
            if (e.response !== undefined)
                console.error(e.response.data);
            else
                console.error(e.message);
        }
    }
}

module.exports = Orchestly;
