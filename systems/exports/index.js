const _ = require("lodash");
const bigQuery = require("./bigQuery.csv");

const a = {faraz: {data: {hello: "1"}}};

const qq = _.at(a,['faraz']);
console.log(qq);

class Export {
    constructor(data) {
        this.bigQuery = new bigQuery();
        this._rawData = data;
        this._preparedData = [];
        this._toRemove = [];
    }

    /**
     * to include an object and remove else data
     * @param {string} data
     * @returns {Export}
     */
    need(data) {
        const result = _.at(this._rawData,data);
        this._preparedData.push(result);
        return this;
    }
    /**
     * to exclude an object and return else data
     * @param {string} data
     * @returns {Export}
     */
    skip(data) {
        this._toRemove.push(data);
        return this;
    }

    async toConsole() {
        console.log(this._preparedData)
    }

    async toBigQuery(projectName, tableName) {

    }

    /**
     * remove excluded items from base
     * @returns {Promise<void>}
     * @private
     */
    async _prepare(){
        if(this._preparedData.length === 0){
            this._preparedData = this._rawData;
        }
        _.unset(this._preparedData,this._toRemove);
    }
}

async function test() {
    const qq = new Export([{"salam":"test"},{"el":{"salasa":"21"}}]);
    const r = await qq.need("[0].salam").toConsole();
}
