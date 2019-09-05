const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

let user = null;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), generateUser);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

async function generateUser(auth){
  console.log('Generating User...');

  //get gmail account
  const gmail = google.gmail({version: 'v1', auth});

  //get list of email raw data points
  const messageList = await gmail.users.messages.list({userId: 'me'}).catch(err => console.log("API ERROR: " + err));

  //get the array of message (id , threadid) pairs
  const emailIds = messageList.data.messages;

  //make user object
  user = {
    "emails": []
  }

  //loop thru pairs of ids and get each email and convert to readable form
  const readableEmails = await Promise.all(emailIds.map( async (emailRawId, idx) => {
    console.log(`Reading in email ${idx}...`);

    //get the email by id
    const emailRawData = await gmail.users.messages.get({auth: auth, userId: 'me', 'id': emailRawId.id}).catch(err => console.log("EMAIL ERROR: " + err));

    console.log(`Successfully read email ${idx}`);

    console.log(`Converting email ${idx} to readable form...`);
  
    //get payload
    const payload = emailRawData.data.payload;
  
    //sender and content to put in readable email object
    let sender = null;
    let content = null;

    //loop thru headers to get sender
    payload.headers.forEach(header =>{
      if(header.name === 'From'){
          sender = header.value
      }
    });
    
    //check if parts array doesnt exist in email payload
    if('parts' in payload){
      //check if content size is > 0
      if(payload.parts[0].body.size > 0){
        const contentEncoded = payload.parts[0].body.data;
        const contentBuffer = Buffer.from(contentEncoded, 'base64');
        content = contentBuffer.toString();
      }
    }else{
      //only body exists in payload
      if(payload.body.size > 0){
        const contentEncoded = payload.body.data;
        const contentBuffer = Buffer.from(contentEncoded, 'base64');
        content = contentBuffer.toString();
      }
    }
      
    //log statement
    console.log(`Successfully converted email sent from: ${sender}`);
      
    //return an object with the email content and the sender
    const emailObj = {
      "from": sender,
      "content": (content == null ? "NO CONTENT" : content)
    };

    return emailObj;
  }))

  user.emails = readableEmails;

  console.log("Successfully Generated User: ");

  module.exports = user;
}


