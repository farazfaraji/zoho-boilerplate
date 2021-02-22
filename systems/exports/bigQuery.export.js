const {BigQuery} = require("@google-cloud/bigquery");
const fs = require("fs");

const CSV = require("./csv.export");

class bigQueryClass extends CSV {

    constructor(data) {
        super(data);
        this.bigQuery = new BigQuery({
            projectId: 'sigmacdr',
            keyFilename: process.env.BQ_PATH
        });
    }

    async getInfo(dataset, table) {
        const data = this.bigQuery.dataset(dataset).table(table);
        return await data.getMetadata();
    }

    /**
     *
     * @param {String} dataset
     * @param {String} table
     * @param {String|"WRITE_TRUNCATE"|"WRITE_APPEND"} writeDisposition
     * @returns {Promise<void>}
     */
    async upload(dataset, table,writeDisposition) {
        const randomNumber = Math.floor(Math.random() * (1000000 - 1) + 1);
        const fileName = "_temp_" + randomNumber;
        await this.validate().save(fileName);
        const firstKey = Object.keys(this._data[0]).length;
        const bigQueryMetadata = await this.getInfo(dataset, table);

        if (firstKey !== Object.keys(bigQueryMetadata[0].schema.fields).length)
            throw new Error("schema is not same");

        const metadata = {
            sourceFormat: 'CSV',
            skipLeadingRows: 1,
            autodetect: false,
            writeDisposition: writeDisposition
        };
        await this.bigQuery.dataset(dataset).table(table).load(fileName, metadata);
        fs.unlinkSync("_temp_" + randomNumber);
    }

    async createTable(dataset, tableName, fields, types) {
        try {
            let deleteTable = `drop table ${dataset}.${tableName}`;
            await this.bigQuery.query(deleteTable);
        } catch (e) {

        }
        let columns = "";
        for (let i = 0; i < fields.length; i++) {
            if (types[fields[i]])
                columns += fields[i] + " " + types[fields[i]] + ",";
            else
                columns += fields[i] + " STRING,"
        }
        columns = columns.slice(0, -1);

        let query = `CREATE TABLE ${dataset}.${tableName} (${columns}) PARTITION BY Partition_Date`;
        await this.bigQuery.query(query);
    }
}


module.exports = bigQueryClass;