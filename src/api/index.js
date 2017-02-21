import { Wit, log, interactive } from 'node-wit'
import moment from 'moment'
import 'moment-round'

import { WIT_TOKEN } from '../config'
import { dbConnect } from '../config/db'
import * as send from './send'
import User from '../models/User'
import QuickReply from '../templates/QuickReply'

const TESTING_MODE = require.main === module

//
// Bot Actions
// ---
//
const actions = {
  async send(req, res) {
    const user = await User.findOne(
      { 'session.id': req.sessionId }
    )

    if (user && user.messenger_id) {
      if (req.context.quick_replies) {
        await send.textMessage(user.messenger_id, res.text, req.context.quick_replies)
      }
      else if (res.quickreplies) {
        let quick_replies = createTextQuickReplies(res.quickreplies)
        await send.textMessage(user.messenger_id, res.text, quick_replies)
      }
      else {
        await send.textMessage(user.messenger_id, res.text)
      }
    } else if (!TESTING_MODE) {
      console.error(`Oops! Couldn\'t find user for session: ${req.sessionId}`)
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

// Helpers
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
const isAnOption = (options, text) => options.some(option => option === text)

export const createTextQuickReplies = (options) => options.map(option => new QuickReply({
  title: option,
  content_type: 'text',
  payload: 'empty'
}))

//
// Initialize Wit.ai
// ---
// API Reference: https://wit.ai/docs
//
export const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions: actions,
  logger: new log.Logger(log.INFO)
})

// BOT TESTING MODE
if (TESTING_MODE) {
	console.log('Bot testing mode!')
  dbConnect()
	interactive(wit)
}
