'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import catchPromiseErrors from 'async-error-catcher'
import crypto from 'crypto'

import { handleWebhookPost, handleWebhookGet } from './api/receive'
import { dbConnect } from './config/db'
import { FB_APP_SECRET } from './config/index'

//
// Server Config
// ---
//
const app = express()
app.set('port', (process.env.PORT || 5000))
dbConnect(app)

//
// Server Middleware
// ---
//
app.use(({method, url}, rsp, next) => {
  rsp.on('finish', () => {
    console.log(`${rsp.statusCode} ${method} ${url}`);
  })
  next()
})
app.use(bodyParser.json({ verify: verifyRequestSignature }))

//
// Server Routes
// ---
//
app.get('/', function (req, res) {
  res.send('hello world i am a secret bot')
})
// for facebook verification
app.get('/webhook/', catchPromiseErrors(handleWebhookGet))
app.post('/webhook/', catchPromiseErrors(handleWebhookPost))

//
// Server Error Handler
// ---
//
app.use((err, req, res, next) => {
  console.error('============')
  console.error(err.stack || err)
  console.error('============')
  res.sendStatus(200)
})

//
// Run Server
// ---
//
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}
