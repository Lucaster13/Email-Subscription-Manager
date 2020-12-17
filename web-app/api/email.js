const fetch = require("node-fetch");
const htmlparser2 = require("htmlparser2");
const { useEffect, useState } = require("react");
const e = require("express");

const API_URL = "https://www.googleapis.com/gmail/v1/users/"
const LIST_MESSAGE_IDS_URL = (userId, access_token, pageToken = "") => `${API_URL}${userId}/messages?access_token=${access_token}&pageToken=${pageToken}`;
const GET_MESSAGE_URL = (userId, access_token, id) => `${API_URL}${userId}/messages/${id}?access_token=${access_token}&format=full`;

const headersOptions = ['from', 'to', 'subject'];
const headers = () => headersOptions.reduce((queryStr, op) => queryStr + `&metadata&metadataHeaders=${op}`, "");
const GET_METADATA_URL = (userId, access_token, id) => `${API_URL}${userId}/messages/${id}?access_token=${access_token}&format=metadata${headers()}`;

const ERR_messageIds = "getMessageIds error: ";
const ERR_metadata = "getMetadata error: ";
const ERR_subscriptions= "getSubscriptions error: ";

const handle_error = (message,  code) => {
    throw new Error(`${message} | Error code: ${code}`);
}


const getMessageIds = async (userId, access_token, numIds = 0) => {
    // validate params
    if(!userId || !access_token || numIds < 0) handle_error(ERR_messageIds + "invalid params", 501);

    // make initial call to gmail api
    const messageIdsRes = await (await fetch(LIST_MESSAGE_IDS_URL(userId, access_token))).json();

    // check for errors exist
    const {errors, message} = messageIdsRes;
    if(errors) handle_error(ERR_messageIds + message, 500);

    // no errors, retrieve first batch of id's and next page token
    var {messages, nextPageToken} = messageIdsRes;

    // paginate subsequent calls
    
    while(nextPageToken) {
        // log("nextPageToken:", nextPageToken);
        const paginatedMessageIdsRes = await (await fetch(LIST_MESSAGE_IDS_URL(userId, access_token, nextPageToken))).json();

        const {errors, message}  = paginatedMessageIdsRes;
        if(errors){
            handle_error(ERR_messageIds + message, 500);
        } else {
            // concat new messages
            try{
                messages = [...messages, ...paginatedMessageIdsRes.messages];
            }catch(e){}
           

            // return if numId's reached
            if(numIds && messages.length >= numIds)  return messages;

            // otherwise loop
            nextPageToken = paginatedMessageIdsRes.nextPageToken;
        }
    }

    return messages;
} 

const getMetadata = async (userId, access_token, ids) => {
    // validate params
    if(!userId || !access_token || !ids || ids.length === 0) handle_error(ERR_metadata + "invalid params", 501);

    // get all responses
    log("awaiting metadata responses...");
    const metaResponses = await Promise.all(ids.reduce((promiseArry, id, idx) => {
        
        // sleep every 40 calls to prevent exceeding call rate
        if(!(idx % 40)) sleep(1000);

        promiseArry.push(fetch(GET_METADATA_URL(userId, access_token, id)));
        return promiseArry;
    },[]));

    // get responses into json
    log("converting metadata responses to json...");
    const metadata = await Promise.all(metaResponses.reduce((promiseArry, metaRes) => {
        promiseArry.push(metaRes.json());
        return promiseArry;
    },[])); 


    return metadata;
}

// retrieves all emails for user and formats a subscriptions object
const getSubscriptions = async (userId, access_token, ids) => {

    // validate params
    if(!userId || !access_token || !ids || ids.length === 0) handle_error(ERR_subscriptions + "invalid params", 501);

    // get all emails
    log("awaiting email responses...");
    const emailResponses = await Promise.all(ids.reduce((promiseArry, id, idx) => {
        // sleep every 40 calls to prevent exceeding call rate
        if(!(idx % 40)) sleep(1000);

        promiseArry.push(fetch(GET_MESSAGE_URL(userId, access_token, id)));
        return promiseArry;
    },[]));

    log("converting email responses to json...");
    const emails = await Promise.all(emailResponses.reduce((promiseArry, emailRes) => {
        promiseArry.push(emailRes.json());
        return promiseArry;
    },[])); 

    
    log("formatting subscriptions object...");
    const subscriptionObj = emails.reduce((subs, email) => {
        // extract relevant data from email
        const {id, payload} = email;
        if(!payload) return subs;
        const {headers, body} = payload;

        // check if there is a subscribe link
        const links = hasSubscribe(body.data);
        if(!links || links.length === 0) return subs;

        // extract headers from payload
        const {to, from, subject} = headers.reduce((r, h) => {
            switch(h.name){
                case("To") : {r.to = h.value; break}
                case("From") : {r.from = h.value; break}
                case("Subject") : {r.subject = h.value; break}
                default : return r;
            }
            return r;
        },{to: null, from: null, subject: null});
        const [fromName, fromEmail] = from.replace(">","").split("<").map((f) => f.trim());

        log("links found for email from:", {
            fromName, 
            fromEmail, 
            links
        });
        
        // check if group exists yet, if not create it
        if(!subs[fromEmail]) subs[fromEmail] = {name: fromName, emails: [], unsubLinks: []};

        // add entry to subGroup
        subs[fromEmail].emails.push({to, subject, fromName, fromEmail, id});
        subs[fromEmail].unsubLinks = [...subs[fromEmail].unsubLinks, ...links];

        return subs;
    }, {})

    // prune duplicate links
    // const prunedSubscriptions = Object.keys(subscriptionObj).reduce((subs, email) => {
    //     const {name, emails, unsubLinks} = subscriptionObj[email];
    //     const prunedSub = {name, emails, unsubLinks: [...(new Set(unsubLinks))]};
    //     subs[email] = prunedSub;
    //     return subs;
    // }, {})

    return subscriptionObj;
    
};

const hasSubscribe = (encodedEmailData) => {
    if(!encodedEmailData) return null;

    // DONT TOUCH
    const emailHTML = Buffer.from((encodedEmailData.replace('/-/g', '+').replace('/_/g', '/')), 'base64').toString();

    var subLinks = [];
    var currLink = null;
    var linkFound = false;

    // parser will find the links in html and retrieve links into array (typically one link per email)
    const parser = new htmlparser2.Parser({
        onopentag(name, attributes) {
            if (name === "a" && attributes.href) {
                linkFound = true;
                currLink = attributes.href;
            }
        },
        ontext(text) {
            // must be link and pass checks
            if(linkFound){
                log("link found:", text);
            }
            
            if(linkFound && validateSubLinkText(text) && currLink){   
                log("link valid");
                subLinks.push(currLink);
            }
            linkFound = false;
            currLink = null;
        },
    });
    parser.write(emailHTML);
    parser.end();

    return subLinks;
}


const validateSubLinkText = (text) => {
    const unsubscribe = text.toLowerCase().includes("unsubscribe");
    // if more than this number of words in link text, then most likely not a link
    const valid = text.trim().split(" ").length <= 7;

    return unsubscribe && valid;
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const time = () => 'Time:' + Date.now();
const log = (l, data = "") => console.log(time(), l, data);
  

module.exports = {
    getSubscriptions,
    getMetadata,
    getMessageIds,
    log,
}
