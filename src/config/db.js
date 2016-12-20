import mongoose from 'mongoose'
import Promise from 'bluebird'

import { db } from '../config'

global.Promise = Promise
Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
});

export function dbConnect(app) {
  let dbUrl
  if (process.env.NODE_ENV == 'production') {
    dbUrl = db.prod
  }
  else {
    dbUrl = db.dev
  }

  mongoose.connection
    .on('error', error => error)
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
      const dbInfo = mongoose.connections[0]
      console.log(`Connected to ${dbInfo.host}:${dbInfo.port}/${dbInfo.name}`)
    })

  // Use Bluebird Promises
  mongoose.Promise = Promise
  mongoose.connect(dbUrl, { db: { safe: false } })
}
