const Report = require("./report.service");

class Scheduler extends Report{
    availablePeriod = ["EVERY_5", "EVERY_15","EVERY_30","EVERY_1","EVERY_60"];

    constructor(di,option) {
        super(option.report);
        this._di = di;
        this._option = option;
        setTimeout(()=>this.startProcess(), 1000 * 2 );
    }

    async addJob(jobName, eventName,data, timeout, period,reportOption) {
        this._checkPeriod(period);
        const jobs = await this.getJobs();
        if(jobs.includes(jobName))
            throw new Error("job name " + jobName + " already exist");
        jobs.push(jobName);
        const jobDetail = {jobName,eventName,timeout,period,data,lastRun:null,reportOption};
        await this._di.redis.set("__system_job_" + jobName,JSON.stringify(jobDetail));
        await this._di.redis.set("__system_jobsList",JSON.stringify(jobs));
    }

    async startProcess() {
        const jobs = await this.getJobs();
        for(let i = 0;i<jobs.length;i++){
            await this.startByName(jobs[i]);
        }
    }

    async startByName(name){
        let logs = {time:new Date(),data:[]};
        const jobInfo = await this.getJobInfo(name);
        logs.data.push([{title:"Job info fetched",data:jobInfo}]);
        const isTimeToRunStatus = await this._isTimeToRun(jobInfo.lastRun,jobInfo.period);
        logs.data.push([{title:"Is time to run",data:isTimeToRunStatus}]);

        if(isTimeToRunStatus){
            await this._call(jobInfo.eventName,jobInfo.data);
            await this._di.redis.set("__system_job__OnProcess_" +jobInfo.eventName ,1,"EX",jobInfo.timeout);
        }
        console.log(JSON.stringify(logs, null, 4));
    }


    async getJobs(){
        let jobsList = await this._di.redis.get("__system_jobsList");
        if (jobsList === null)
            return [];
        return JSON.parse(jobsList);
    }

    async getJobInfo(name) {
        return JSON.parse(await this._di.redis.get("__system_job_" + name));
    }

    async jobDone(jobName){
        const now = new Date();
        let jobInfo = JSON.parse(await this._di.redis.get("__system_job_" + jobName));
        jobInfo.lastRun = now;
        await this._di.redis.set("__system_job_" + jobName,JSON.stringify(jobInfo));
        await this._di.redis.del("__system_job__OnProcess_" +jobName);
        if(jobInfo.reportOption.sms)
            await this.sendReport("Time: " + new Date() + "\nJob Name: " + jobInfo.jobName + "\nDone.");
    }

    async deleteJob(jobName){
        const jobs = await this.getJobs();
        for(let i = 0;i<jobs.length;i++){
            if(jobs[i]===jobName){
                jobs.splice(i, 1);
                break;
            }
        }

        await this._di.redis.del("__system_job_" + jobName);
        await this._di.redis.set("__system_jobsList",JSON.stringify(jobs));
    }

    async _call(eventName,data){
        this._di.ee.emit(eventName, JSON.stringify(data));
    }

    async _isTimeToRun(lastRun,period,eventName){
        const isInProcess = await this._di.redis.get("__system_job__OnProcess_" +eventName);
        if(isInProcess!==null)
            return false;
        if(period.startsWith("E"))
        {
            const dueTime = this._castPeriodToInteger(period);
            const now = new Date().getTime();
            if((now - lastRun)>dueTime)
                return true;
            else
                return false;
        }
        else
        {
            let run = false;
            const interval = period.split("-");
            const month = new Date().getMonth() + 1;
            const day = new Date().getDate();
            const hour = new Date().getHours();
            const minute = new Date().getMinutes();

            let date = new Date().getFullYear() + "-";
            let determine = [];

            if(interval[0]==="*"){
                    date += this._fixDTlength(month);
                    determine.push("M");
            }
            else
                date += this._fixDTlength(interval[0]);
            date += "-";

            if(interval[1]==="*"){
                determine.push("D");
                    date += this._fixDTlength(day);
            }
            else
                date += this._fixDTlength(interval[1]);
            date += "T";

            if(interval[2]==="*"){
                determine.push("H");
                date += this._fixDTlength(hour);
            }
            else
                date += this._fixDTlength(interval[2]);
            date += ":";

            if(interval[3]==="*"){
                determine.push("m");
                date += this._fixDTlength(minute);
            }
            else
                date += this._fixDTlength(interval[3]);

            date = new Date(date);
            if(date <= new Date()){
                const now = new Date().getTime();
                const determineNextTime = new Date();

                for(let i = 0;i<determine.length;i++){
                    switch (determine[i]) {
                        case "M":
                        {
                            determineNextTime.setMonth(determineNextTime.getMonth() + 1);
                            break;
                        }
                        case "D":
                        {
                            determineNextTime.setDate(determineNextTime.getDate() + 1);
                            break;
                        }
                        case "H":
                        {
                            determineNextTime.setHours(determineNextTime.getHours() + 1);
                            break;
                        }
                        case "m":
                        {
                            determineNextTime.setMinutes(determineNextTime.getMinutes() + 1);
                            break;
                        }
                    }
                }

                if(lastRun===null)
                    lastRun = "1990-01-01T00:00:00";
                lastRun = new Date(lastRun);
return false;
                if((lastRun >= determineNextTime) || (lastRun <= new Date()))
                    return true;
                else
                    return false;
            }
            return false;
        }
    }

    _fixDTlength(v){
        if(v.toString().length===1)
            return "0" + v;
        return v;
    }

    _checkPeriod(period) {
        let error = true;
        if (this.availablePeriod.includes(period))
            error = false;

        if(!isNaN(period))
            error = false;

        if(period.split("-").length===4)
            error = false;


        if(error)
            throw new Error(this.availablePeriod.join(" ") + " are available for period");
    }

    _castPeriodToInteger(period){
        if(!isNaN(period))
            return period;
        switch (period) {
            case "EVERY_1":
                return 60*1000;
            case "EVERY_5":
                return 60*5*1000;
            case "EVERY_15":
                return 60*15*1000;
            case "EVERY_30":
                return 60*30*1000;
            case "EVERY_60":
                return 60*60*1000;

        }
    }

}

module.exports = Scheduler;