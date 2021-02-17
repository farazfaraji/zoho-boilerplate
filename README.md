# Zoho Boilerplate

Using express to connecting to zoho, Handling routes and authentications.

## Features
* Managing authentications
* CURD data in Zoho CRM
* Managing Zoho Orchestly
* Exporting data to Zoho CRM by CSV
* Export emails to Zoho CRM
* Handling Webhooks
* Handling CronJob

## Installation

Install NPM and NodeJs

Installing Docker and Docker Compose (read the following article)
> https://phoenixnap.com/kb/install-docker-compose-ubuntu

```bash
git clone git@github.com:farazfaraji/zoho-boilerplate
cd zoho-boilerplate
npm install
```

Clone Repository

```bash
git clone git@github.com:farazfaraji/zoho-boilerplate
cd zoho-boilerplate
npm install
```

Edit .env file
* Set application name
* Set Redis port and host
* Set email credential
* Set CronJob info, acceptable values : [MONTHLY,DAILY,HOURLY,MINUTELY,EVERY5,EVERY10,EVERY15,EVERY30]
* Set Zoho authentication information (or go to bottom of readme file)
    * https://www.zoho.com/crm/developer/docs/api/v2/oauth-overview.html

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

