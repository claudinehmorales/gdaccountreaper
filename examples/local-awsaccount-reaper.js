const { Chromeless } = require('chromeless')

async function run() {
    
  const chromeless = new Chromeless()
  const accountPage = 'https://console.aws.amazon.com/billing/home?#/account'
  
  var user = '' // aws account
  var pw = '' // pw
    
  const accountDeletion = await chromeless
    .goto(accountPage)
    .type(user, 'input[id="ap_email"]')
    .type(pw, 'input[id="ap_password"]')
    .click('input[id="signInSubmit-input"]')
    .wait(5000)
    .wait('label.margin-top-10 > span:nth-child(2)')
    .scrollToElement('label.margin-top-10 > span:nth-child(2)')
    .click('label.margin-top-10 > span:nth-child(2)')
    .focus('.btn-danger')
    .screenshot()
    

  console.log(accountDeletion) // prints local file path or S3 url

  await chromeless.end() 
}

run().catch(console.error.bind(console))