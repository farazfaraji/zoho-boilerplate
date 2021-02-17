const fs = require("fs");
const randomString = require('randomstring');
const request = require('request');
const axios = require("axios");

class ZohoAuthentication {
    constructor(_client_id, _client_secret, _refresh_token) {
        this.client_id = _client_id;
        this.client_secret = _client_secret;
        this.refresh_token = _refresh_token;
    }
    async getToken() {
        if (fs.existsSync("token.tk")) {
            let content = JSON.parse(fs.readFileSync("token.tk", "UTF-8"));
            let currentTime = new Date().getTime();
            if (Math.abs(content.time - currentTime) > 3000000) {
                const token = await this.generateToken();
                fs.writeFileSync("token.tk", JSON.stringify({token: token.access_token, time: currentTime}))
            }
        } else {
            let currentTime = new Date().getTime();
            const token = await this.generateToken();
            fs.writeFileSync("token.tk", JSON.stringify({token: token.access_token, time: currentTime}))
        }
        console.log(fs.readFileSync("token.tk", "UTF-8"));
        return JSON.parse(fs.readFileSync("token.tk", "UTF-8"));
    }

    async generateToken() {

        const client_id = this.client_id;
        const client_secret = this.client_secret;
        const refresh_token = this.refresh_token;

        return new Promise(function (resolve, reject) {
            request({
                url: 'https://accounts.zoho.com/oauth/v2/token',
                method: 'POST',
                form: {
                    grant_type: 'refresh_token',
                    client_id: client_id,
                    client_secret: client_secret,
                    refresh_token: refresh_token,
                }
            }, (error, response, body) => {
                if (error) {
                    console.log(error);
                } else {
                    resolve(JSON.parse(response.body));
                }
            });
        })
    }
}

module.exports = ZohoAuthentication;