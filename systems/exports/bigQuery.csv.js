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

    async upload(dataset, table) {
        const randomNumber = Math.floor(Math.random() * (1000000 - 1) + 1);
        await this.validate().save("_temp_" + randomNumber);
        const firstKey = Object.keys(this._data[0]).length;
        const bigQueryMetadata = await this.getInfo(dataset, table);

        if (firstKey !== Object.keys(bigQueryMetadata[0].schema.fields).length)
            throw new Error("schema is not same");

        const metadata = {
            sourceFormat: 'CSV',
            skipLeadingRows: 1,
            autodetect: false,
            writeDisposition: 'WRITE_APPEND'
        };
        await this.bigQuery.dataset(dataset).table(table).load(filename, metadata);
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
        let query = `CREATE TABLE ${dataset}.${tableName} (${columns} Partition_Date DATE) PARTITION BY Report_Date`;
        await this.bigQuery.query(query);
    }
}

async function test() {
    const r = new bigQueryClass([{"SALAM": "dsa"}]);
    await r.validate().save("test.csv");
    const rs = await r.upload("5G_CDRS", "iran-numbers");
    console.log(rs);
}

test();
module.exports = bigQueryClass;