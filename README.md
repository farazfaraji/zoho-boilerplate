# Zoho Boilerplate

Using express to connecting to zoho, Handling routes and authentications.

## Features
* Managing authentications
* CURD data in Zoho CRM
* Managing Zoho Orchestly
* Exporting data to Zoho CRM to CSV
* Export emails to Zoho CRM
* Handling Webhooks
* Handling Jobs

## Installation

Install NPM and NodeJs

Installing Docker and Docker Compose (read the following article)
> https://phoenixnap.com/kb/install-docker-compose-ubuntu

Clone Repository

```bash
git clone git@github.com:farazfaraji/zoho-boilerplate
cd zoho-boilerplate
docker-compose up -d
npm install
```

Edit .env file
* Set application name
* Set Redis port and host
* Set email credential
* Set Zoho authentication information (or go to bottom of readme file)
    * https://www.zoho.com/crm/developer/docs/api/v2/oauth-overview.html
* Set Report credentials

## Get zoho credential info
* First Step , Replace expected values
  * client_ID: Your client ID from Zoho
  * scope : For example ZohoCRM.modules.leads.CREATE
  * redirect_url: https://yourwesbite.com
 > Method Get
 
`https://accounts.zoho.com/oauth/v2/auth?response_type=code&access_type=offline&client_id=$client_ID&scope=$scope&redirect_uri=$redirect_url`

* Second Step
Copy the code from redirected URL and replace expected values
> Method POST

`https://accounts.zoho.com/oauth/v2/token`

```bash
code:1000.XXX.XXX
client_id:1000.XXX
client_secret:XXX
redirect_uri:$redirect_uri
grant_type:authorization_code
```

#How to use
Create src folder in the root
```
mkdir src
cd src
touch index.js
```
Application will call index.js at the startup and your programs should write there.
- What are inside the DI?
    - di.orchestly -> to access to orchestly module
    - di.scheduler -> to access to scheduler module
    - di.redis -> to access to redis database
    - di.ee -> to access to events
    
# How scheduler works?
```
vi src/index.js
```
```js
const di = require("./../../di");
await di.scheduler.addJob("SCHEDULER_NAME","EVENT_NAME",{"data":1},5000,"${ScheduleTable}",{sms:true});
```
#### ${ScheduleTable}

You can manage schedule in 2 way,
1) interval:
    * EVERY_1
    * EVERY_5
    * EVERY_15
    * EVERY_30
    * EVERY_60
2) exact date: (star means every)
    * \*-\*-\*-01
        * [0] : Month
        * [1] : Day
        * [2] : Hour
        * [3] : Minute
- For example if you want to run every day at 15:20: \*-\*-15-20'

###::Important::
After event emitted you should run:
```
    await di.scheduler.jobDone("SCHEDULER_NAME");
```

