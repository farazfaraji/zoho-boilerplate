const ObjectsToCsv = require('objects-to-csv');

class CSV {
    /**
     * convert response to csv
     * @param {Array}data
     */
    constructor(data){
        this._data = data;
        const date = new Date().getFullYear() + "-" + (parseInt(new Date().getMonth()) + 1) + "-" + new Date().getDate();
        for(let i = 0;i<this._data.length;i++){
            this._data[i].Partition_Date = date;
        }
        this.csvObject = new ObjectsToCsv(this._data);
    }
    async save(fileName,option=undefined){
        await this.csvObject.toDisk(fileName,option);
    }

    /**
     *
     * @returns {CSV}
     */
    validate(){
        const keys = Object.keys(this._data[0]).length;
        for(let i =0;i<this._data.length;i++){
            if(keys !== Object.keys(this._data[0]).length)
                throw new Error("check row at" + i);
        }
        return this
    }
}

module.exports = CSV;