const { Chromeless } = require('chromeless')


async function run() {
    
  const chromeless = new Chromeless()
  var captchaUrl = ''
  
  const accountPage = 'https://console.aws.amazon.com/billing/home?#/account'
  
  var user = '' // aws account username
    
  const forgotPassword = await chromeless
    
    // Navigate to account page of the AWS Console
    .goto(accountPage)
    console.log('console login page open')
    
    // Click 'forgot password' button
    await chromeless.click('#ap_signin1a_forgot_password_row > span:nth-child(2) > a:nth-child(1)') 
    console.log('forgot password button clicked')
    
    // Type in email address in the email field
    await chromeless.type(user, 'input[id="ap_email"]')
    console.log('email typed')
    
    // Wait until captcha img is visible on the next page
    await chromeless.wait('#ap_captcha_img')
    console.log('captcha img visible on page')
  
    // Grab the src attribute of the captcha img
    var captchaUrl = await chromeless.evaluate(() => {
        var captchaImg = document.querySelector('#ap_captcha_img > img')
        var captchaImgSrc = captchaImg.getAttribute('src')
        return captchaImgSrc
  })
  
  console.log('captcha img url grabbed')
    

    
    
    

  var https = require('https') 
  var writeCaptchaImgStream = require('fs')
  
  // GET the captcha img using the src grabbed above and the response to the GET request
  var captchaGetRequest = https.get(captchaUrl, function(response) {
      var captchaImgData = ''
      response.setEncoding('binary')
      response.on('data', function(chunk) {
          
          // append the actual body of the response to captchaImgData variable
          captchaImgData += chunk
      })
      response.on('end', function() {
          
          // write the body of the response into a file called captcha.jpeg which will be saved locally
          writeCaptchaImgStream.writeFile('captcha.jpeg', captchaImgData, 'binary', function(err) {
              
              // if there's an error writing to the stream, throw error
              if(err) throw err
              
              // otherwise, log that the captcha img is saved locally
              console.log('captcha img saved locally')
              
              // the next step is a POST to the Death By Captcha API 
              var util = require('util')
              var exec = require('child_process').exec
              
              // this is the curl request
              var postCaptchaToDbc = 'curl --header "Expect: " -F username='' \ -F password='' \ -F captchafile=@captcha.jpeg \ http://api.dbcapi.me/api/captcha'
    
              // execute curl request to DBC API
              child = exec(postCaptchaToDbc, function(error, stdout, stderr){
                  console.log('captcha posted to dbc')

                  // stringify stdout
                  var stdoutStr = stdout.toString()

                  // remove everything before 'captcha=' in stdoutStr 
                  var stdoutSplit = stdoutStr.split('captcha=').pop()

                  // remove everything after '&' in stdoutSplit to get the captchaId
                  var captchaId = stdoutSplit.substring(0, stdoutSplit.indexOf('&'))
                  console.log('captcha id value is ' + captchaId)
                  

                  // post a GET request to DBC for the solved captcha for this captchaId
                  var http = require('http')
                  var actualCaptchaWriteStream = require('fs')
                  var breakCaptchaTxt
                  var pollCaptchaUrl = 'http://api.dbcapi.me/api/captcha/' + captchaId + '/' 
                  console.log(pollCaptchaUrl)
                  
                  
                  function requestActualCaptchaTxt(url, callback) {
                      
                      var request = http.get(url, function(response) {
                          response.on('data', function(chunk) {
                              breakCaptchaTxt += chunk
                              console.log(breakCaptchaTxt)
                          })
                          response.on('end', function() {
                                  var actualCaptchaTxt = breakCaptchaTxt.split('text=').pop()
                                  var finalCaptchaTxt = actualCaptchaTxt.substring(0, actualCaptchaTxt.indexOf('&'))
                                  console.log('captcha solved is ' + finalCaptchaTxt)
                                  actualCaptchaWriteStream.writeFile('finalCaptcha.txt', finalCaptchaTxt, function(err) {
                                      console.log('finalCaptcha.txt saved locally')
                                  if (err) throw err
                              })
                          })
                      })
                  }
                  
                  setTimeout(requestActualCaptchaTxt, 20000, pollCaptchaUrl)  
                  

                  
                  
                  
                  
                  

        if(error !== null)
        {
            console.log('exec error: ' + error);
        }
        
        });
    })
    })
  })
  
  
  
  // CODE BELOW IS NOT EXECUTING AT ALL
  await chromeless.evaluate(() => {
                    console.log('IS THIS GETTING REACHED')
                    function completePasswordRetrieval(text, callback) {
                    
                        var fs = require('fs')
                        var path = process.cwd()
                        var buffer = fs.readFileSync(path + '/finalCaptcha.txt')
                        var captchaGuess = buffer.toString()
                        console.log(captchaGuess)
                    
                    
                        return async function typeCaptcha(text, callback) {
                            await chromeless
                            .type(captchaGuess, 'input[id="#ap_captcha_guess"]')
                            .click('#continue-input')
                            console.log('ddddddddd')
                        
                }
                  setTimeout(completePasswordRetrieval, 18000, 'blah')
                  
            }
        })
  

  

  
    
    

  console.log(forgotPassword) // prints local file path or S3 url

  //await chromeless.end() 
}

run().catch(console.error.bind(console))