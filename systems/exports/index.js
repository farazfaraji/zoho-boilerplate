const _ = require("lodash");
const _bigQuery = require("./bigQuery.export");

class Export {
    constructor(data) {
        this.bigQuery = new _bigQuery(data);
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

    /**
     *
     * @param {String} projectName
     * @param {String} tableName
     * @param {String|"WRITE_TRUNCATE"|"WRITE_APPEND"} writeDisposition
     * @returns {Promise<void>}
     * @constructor
     */
    async ObjectToBigQuery(projectName, tableName,writeDisposition) {
        await this.bigQuery.upload(projectName,tableName,writeDisposition)
    }

    async CSVToBigQuery(path,projectName, tableName) {

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

module.exports = Export;
