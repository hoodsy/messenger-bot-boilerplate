import { Wit, log } from 'node-wit'

import { WIT_TOKEN } from '../config'
import * as send from './send'
import User from '../models/User'

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
export const sessions = {};

export const findOrCreateSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

// Our bot actions
const actions = {
  async send({ sessionId }, { text }) {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    // const recipientId = sessions[sessionId].fbid;

    const user = await User.findOne(
      { 'session.id': sessionId }
    )

    // 
    // console.log('user:')
    // console.log('============')
    // console.log(user)
    // console.log('============')



    if (user.messenger_id) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      await send.textMessage(user.messenger_id, text)

    // if (recipientId) {
    //   // Yay, we found our recipient!
    //   // Let's forward our bot response to her.
    //   // We return a promise to let our bot know when we're done sending
    //   await send.textMessage(recipientId.id, text)
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      // return Promise.resolve()
    }
  },
  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
  async getContact({ context, text, entities}) {


    console.log('in getContact')
    console.log('============')

    console.log('context: ', context)
    console.log('text: ', text)
    console.log('entities: ', entities)

    await context
  }

};

// Setting up our bot
export const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});
