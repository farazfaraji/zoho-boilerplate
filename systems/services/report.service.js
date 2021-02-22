const format = require("string-template");
const axios = require("axios");
class Report {
    constructor(_report) {
        this.report = _report;
    }

    async sendSMS(text){
        text = "Report Detail:\n" + text;
        const baseURL = process.env.SMS_BASE_URL;
        const usernameParameter = process.env.SMS_USERNAME_PARAMETER;
        const passwordParameter = process.env.SMS_PASSWORD_PARAMETER;
        const toParameter = process.env.SMS_TO_PARAMETER;
        const fromParameter = process.env.SMS_FROM_PARAMETER;
        const contentParameter = process.env.SMS_CONTENT_PARAMETER;

        const username = process.env.SMS_USERNAME;
        const password = process.env.SMS_PASSWORD;
        const to = process.env.SMS_TO;
        const from = process.env.SMS_FROM;

        let URL = `${baseURL}?`;
        if(usernameParameter.length>0)
            URL += (`${usernameParameter}=${username}&`);
        if(passwordParameter.length>0)
            URL += (`${passwordParameter}=${password}&`);
        if(toParameter.length>0)
            URL += (`${toParameter}=${to}&`);
        if(fromParameter.length>0)
            URL += (`${fromParameter}=${from}&`);
        if(contentParameter.length>0)
            URL += (`${contentParameter}=${text}&`);

        await axios.get(URL);
    }

    async sendReport(text){
        if(this.report.includes("sms"))
            await this.sendSMS(text);
    }

}

module.exports = Report;