import { Wit, log } from 'node-wit'

import { WIT_TOKEN } from '../config'
import * as send from './send'
import User from '../models/User'

//
// Initialize Wit.ai
// ---
// API Reference: https://wit.ai/docs
//
export const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
})

//
// Bot Actions
// ---
//
const actions = {
  async send({ sessionId }, { text }) {
    const user = await User.findOne(
      { 'session.id': sessionId }
    )

    if (user.messenger_id) {
      await send.textMessage(user.messenger_id, text)
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId)
    }
  },

  async getContact({ context, text, entities}) {
    if (entities.contact && Array.isArray(entities.contact)) {
      // Choose first entity
      entities.contact.map(entity => context.contact = entity.value)
    }
    return context
  }
}
