import request from 'request-promise'
import _ from 'lodash'
require('dotenv').config()

import User from '../models/User'
import { Card, ArticleCard, quick_replies } from '../templates'
import * as actions from '../actions'

//
// Send Message Request
// ---
//
async function _send(messageData) {
    await request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData
    })
}

//
// Message Templates
// ---
//
export async function cardsMessage(recipientId, cards) {
    const messageData = {
      recipient: { id: recipientId },
      message: {
        quick_replies,
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: cards
          }
        }
      }
    }
    await _send(messageData)
}

export async function textMessage(recipientId, text) {
  const messageData = {
    recipient: { id: recipientId },
    message: {
      text: text,
      quick_replies
    }
  }
  await _send(messageData)
}

export async function subscriptionMessage(recipientId) {
    const user = await User.findOne(
      { messenger_id: recipientId },
      { subscription: 1 }
    )

    if (!user) {
      throw new Error(`User with id ${recipientId} doesn't exist.`)
    }

    const card = new Card({
      title: 'Manage Subscription',
      image_url: '',
      subtitle: 'Subscribe or unsubscribe'
    })
    if (user.subscription.active) {
      card.button('postback', 'Unsubscribe', actions.UNSUBSCRIBE)
    }
    else {
      card.button('postback', 'Subscribe', actions.SUBSCRIBE)
    }

    const messageData = {
      recipient: { id: recipientId },
      message: {
        quick_replies,
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [ card ]
          }
        }
      }
    }
    await _send(messageData)
}

export async function scheduledSubscriptionMessage() {
    const users = await User.find({ 'subscription.active': true })
    await Promise.all(users.map(async (user) => {
      await textMessage(user.messenger_id, 'SUBSCRIPTION MESSAGE')
    }))
}
