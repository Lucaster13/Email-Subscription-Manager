const API_URL = "https://www.googleapis.com/gmail/v1/users/"

//processes initial email request and then subsequest pages of emails
//returns full list of emails
const initialRequest = async (userId, accessToken) => {
    //emails array to hold all emails, and page token for multiple pages
    let allEmails = [];
    let nextPageToken = null;

    //attempting first fetch call
    console.log("Initial email request");
    
    //fetch first page of emails
    await fetch(`${API_URL}${userId}/messages?access_token=${accessToken}`).then(async (firstPageEmailPromise,err) => {
        if(err){
            console.error("There was an error retrieving first page of emails: ", err);
        }
        //read the response as json format
        await firstPageEmailPromise.json().then((response) => {
            //get next page token
            nextPageToken = response.nextPageToken;
            //iterate over each email id and get the actual email
            response.messages.forEach(async (emailIds, index) => {
                let emailId = emailIds.id;
                await getEmail(userId, accessToken, emailId).then((email) =>{
                    allEmails.push(email);
                })
            })
        })
    })

    //check if more pages
    if(nextPageToken){
        //call recursive function to loop over next pages
        console.log("Retrieving rest of pages of emails");
        await getPageOfMessages(userId, accessToken, nextPageToken, []).then((restOfEmails) => {
            allEmails.push(restOfEmails);
        });
    }

    return allEmails;
}

//gets next page of messages from account
const getPageOfMessages = async (userId, accessToken, pageToken, restOfEmails) => {
    //fetch next page of emails
    await fetch(`${API_URL}${userId}/messages?pageToken=${pageToken}&access_token=${accessToken}`).then(async (nextPageEmails,err) => {
        if(err){
            console.error("There was an error retrieving first page of emails: ", err);
        }
        //convert next page to json format
        await nextPageEmails.json().then((response)=>{
            //update page token
            pageToken = response.nextPageToken;
            //iterate over email ids and fetch actual emails
            response.messages.forEach(async (emailIds, index) => {
                let emailId = emailIds.id;
                await getEmail(userId, accessToken, emailId).then((email) =>{
                    restOfEmails.push(email);
                });
            })
        })
    })

    //check for nextPageToken and recurse, or return allEmails
    if(pageToken){
        return await getPageOfMessages(userId, accessToken, pageToken, restOfEmails);
    }else{
        return restOfEmails;
    }
}

//gets email corresponding to email id provided
const getEmail = async (userId, accessToken, emailId) => {
    let emailObj;
    //fetch individual email and return it 
    await fetch(`${API_URL}${userId}/messages/${emailId}?access_token=${accessToken}`).then(async (email, err) => {
        if(err){
            console.error("There was an error retrieving individual email: ", err);
        }
        //convert email to json format and process
        await email.json().then((response) => {
            emailObj = response;
        });
    })

    return emailObj;
}

//high level function that does the job
const getAllUserEmails = async (userId, accessToken) => {
    let emails;
    //get initial page of emails, and loop thru rest of pages
    await initialRequest(userId, accessToken).then(async (response) => {
        console.log("Recieved full emails array");
        emails = response;
    });

    return emails;
}


export default getAllUserEmails;


