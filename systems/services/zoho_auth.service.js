const fs = require("fs");
const randomString = require('randomstring');
const request = require('request');
const axios = require("axios");

class ZohoAuthentication {
    constructor(di,_client_id, _client_secret, _refresh_token) {
        this.client_id = _client_id;
        this.client_secret = _client_secret;
        this.refresh_token = _refresh_token;
        this.di = di;
    }

    async removeToken(){
        await this.di.redis.del("__zoho_token");
    }

    async getToken() {
        await this.di.redis.del("__zoho_token");
        let token = await this.di.redis.get("__zoho_token");
        if(!token){
            token = await this.generateToken();
            token = token.access_token;
            await this.di.redis.set("__zoho_token",token,"EX","3500")
        }
        return token;
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

    async customRequest(url, method, parameters) {
        if(!["GET","POST","PUT"].includes(method))
            throw new Error("method is not included");
        const token = await this.getToken();
        switch (method.toString().toUpperCase()) {
            case "POST": {
                try {
                    const response = await axios.post(url,parameters, {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Authorization': `Zoho-oauthtoken ${token}`,
                        },
                    });
                    return response.data;
                } catch (e) {
                    console.error(e.response.data);
                }
                break;
            }
            case "PUT": {
                try {
                    const response = await axios.put(url,parameters, {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Authorization': `Zoho-oauthtoken ${token}`,
                        },
                    });
                    return response.data;
                } catch (e) {
                    console.error(e.response.data);
                }
                break;
            }
            case "GET":{
                try {
                    let params = [];
                    for(let parameter in parameters){
                        if (parameters.hasOwnProperty(parameter)) {
                            params.push(encodeURI(parameter) + "=" + encodeURI(parameters[parameter]));
                        }
                    }

                    const response = await axios.get(url + "?" +  params.join("&"), {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Authorization': `Zoho-oauthtoken ${token}`,
                        },
                    });
                    return response.data;
                } catch (e) {
                    console.error(e.response.data);
                }
                break;
            }
        }
    }

}

module.exports = ZohoAuthentication;