const {Chromeless} = require('chromeless')
const request = require('request-promise')
const fs = require('fs')
const path = require( 'path' );

const timeout = ms => new Promise(res => setTimeout(res, ms))

async function run() {

  const chromeless = new Chromeless()
  const accountPage = 'https://console.aws.amazon.com/billing/home?#/account'
  const user = 'jcv@amazon.com' // aws account username

  await chromeless
    .goto(accountPage)
    .wait('#ap_signin1a_forgot_password_row')
    .click('#ap_signin1a_forgot_password_row > span.ap_col2 > a')
    .wait('#ap_captcha_img')
    .type(user, 'input[id="ap_email"]')

  // Wait until captcha img is visible on the next page
  await chromeless.wait('#ap_captcha_img')
  // Grab the src attribute of the captcha img
  var captchaUrl = await chromeless.evaluate(() => {
    var captchaImg = document.querySelector('#ap_captcha_img > img')
    var captchaImgSrc = captchaImg.getAttribute('src')
    return captchaImgSrc
  })
  console.log('captcha img url grabbed:', captchaUrl)

  // get captch image
  const waitStream = fs.createWriteStream('captcha.jpg');
  const response = await request(captchaUrl).pipe(waitStream);
  await new Promise((resolve, reject) => {
    waitStream.on('close', (err) => {
      if (err) reject(err);
      resolve();
    })
  })
  // make request to dbc to decode
  // success will return a 303 code which request interprets as an error
  // so we catch the error and ignore it :)
  let captchaRequestId = '';
  try {
    const dbcResponse1 = await request.post({
      url: 'http://api.dbcapi.me/api/captcha',
      formData: {
        username: 'chmuser',
        password: 'baconbacon',
        captchafile: fs.createReadStream('captcha.jpg')
      }
    });
  } catch (err) {
    // extract the id from the location headers in the response
    // location header looks like: http://api.dbcapi.me/api/captcha/165036720
    captchaRequestId = path.parse(err.response.headers.location).name;
    console.log('Location Id', captchaRequestId);    
  }
  // wait at least 3 seconds
  console.log('Waiting 3 seconds...');
  await timeout(3000);
  // query response
  let decodedCaptcha = '';
  do {
    try {
      let dbcResponse2 = await request.get({
        'url': `http://api.dbcapi.me/api/captcha/${captchaRequestId}`,
        json: true
      });
      decodedCaptcha = dbcResponse2.text;
    } catch(err) {
      console.log('Captcha response not available yet', err);
      await timeout(2000);
    }
  } while (!decodedCaptcha)

  console.log('Got captcha response:', decodedCaptcha);

  // type captcha
  await chromeless
    .type(decodedCaptcha, 'input[id="ap_captcha_guess"]')
    .click('#continue-input')

  // more stuff?

  await chromeless.end() 
}

run().catch(console.error.bind(console))