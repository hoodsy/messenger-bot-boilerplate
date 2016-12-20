'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import schedule from 'node-schedule'
import catchPromiseErrors from 'async-error-catcher'

import { handleWebhookPost, handleWebhookGet } from './api/receive'
import { dbConnect } from './config/db'

const app = express()

app.set('port', (process.env.PORT || 5000))
dbConnect(app)

// schedule.scheduleJob('0 30 12 * * *', sendDailySubscription)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', catchPromiseErrors(handleWebhookGet))
app.post('/webhook/', catchPromiseErrors(handleWebhookPost))

//
// Error Handler
// ---
//
app.use((err, req, res, next) => {
  console.error('============')
  console.error(err)
  console.error('============')
  res.status(500)
})

// spin spin sugar
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})
