/**
Service Information
service: chromeless-serverless
stage: dev
region: us-west-2
api keys:
  dev-chromeless-session-key: FanbDgtzYfafE0XnPc5PL9hKtE7O5dcn7kOiXeod
endpoints:
  GET - https://p5tsc6fyah.execute-api.us-west-2.amazonaws.com/dev/version
  OPTIONS - https://p5tsc6fyah.execute-api.us-west-2.amazonaws.com/dev/
  GET - https://p5tsc6fyah.execute-api.us-west-2.amazonaws.com/dev/
functions:
  run: chromeless-serverless-dev-run
  version: chromeless-serverless-dev-version
  session: chromeless-serverless-dev-session
  disconnect: chromeless-serverless-dev-disconnect
**/
const Chromeless = require('chromeless').default

async function run() {
    
  const chromeless = new Chromeless({
    remote: {
      endpointUrl: 'https://p5tsc6fyah.execute-api.us-west-2.amazonaws.com/dev/',
      apiKey: 'FanbDgtzYfafE0XnPc5PL9hKtE7O5dcn7kOiXeod'
    }
  })
  const accountPage = 'https://console.aws.amazon.com/billing/home?#/account'
  
  var user = '' // aws username
  var pw = '' // aws pw
    
    const accountDeletion = await chromeless
    .goto(accountPage)
    .type(user, 'input[id="ap_email"]')
    .type(pw, 'input[id="ap_password"]')
    .click('input[id="signInSubmit-input"]')
    .wait(5000)
//    .wait('label.margin-top-10 > span:nth-child(2)')
//    .scrollToElement('label.margin-top-10 > span:nth-child(2)')
//    .click('label.margin-top-10 > span:nth-child(2)')
//    .focus('.btn-danger')
    .screenshot()
    

  console.log(accountDeletion) // prints local file path or S3 url

  await chromeless.end() 
}

run().catch(console.error.bind(console))