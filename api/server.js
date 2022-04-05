const express = require('express');
const path = require('path');
const app = express();
const routes = require("./routes.json");
const {getSubscriptions, getMetadata, getMessageIds, log} = require("./email.js");


// App config 
app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, routes.build))); // get static directory

// SERVER 

// log stmt
app.use(function (req, res, next) {
  log("call:", req.originalUrl.split("?")[0]);
  next();
})

// ping route
app.get('/ping', function (req, res) {
  return res.send('pong');
});

// index routing
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, routes.index));
});

// API ENDPOINTS

app.get('/api/getMessageIds', async function (req, res) {
  // extract params
  const {userId, access_token, numIds} = req.query;
  try {
    // await function call
    const messageIds = await getMessageIds(userId, access_token, numIds);
    log("message ids retrieved successfully!");
    log("sending response to getMessageIds");
    res.json(messageIds);
  } catch(err) {
    // print error and send back to login
    console.error(err);
    res.status(500).send({message: err});
  }
});


app.post('/api/getMetadata',async function (req, res) {
  try {
    // extract body from req
    const {userId, access_token, ids, chunkId} = req.body;
    log("params: ", {userId, numIds: ids.length, chunkId});

    // await function call
    const metadata = await getMetadata(userId, access_token, ids);
    log("metadata retrieved successfully!");
    log("sending response to getMetadata");
    res.json(metadata);
  } catch(err) {
    // print error and send back to login
    console.error(err);
    res.status(501).send({message: err});
  }
})

app.post('/api/getSubscriptions',async function (req, res) {
  try {
    // extract body from req
    const {userId, access_token, ids, chunkId} = req.body;
    log("params: ", {userId, numIds: ids.length, chunkId});

    // await function call
    const subscriptionObj = await getSubscriptions(userId, access_token, ids);
    log("subscriptions retrieved successfully!");
    log("sending response to getSubscriptions");
    res.json(subscriptionObj);
  } catch(err) {
    // print error and send back to login
    console.error(err);
    res.status(501).send({message: err});
  }
})


// default routing
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, routes.index));
});

// run server
app.listen((process.env.PORT || 8080), function(err) {
  if(err) console.error("error starting server", err);
  console.log("server listening on port 8080...");
});

// END SERVER




