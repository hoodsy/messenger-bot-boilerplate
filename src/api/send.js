import request from 'request-promise'

import User from '../models/User'
import { Button } from '../templates
import * as actions from '../actions'
import { FB_PAGE_TOKEN } from '../config'

//
// Message Request
// ---
//
async function _send(messageData) {
    await request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: FB_PAGE_TOKEN },
      method: 'POST',
      json: messageData
    })
}

//
// Message Types
// ---
// API Reference:
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
//
export async function textMessage(recipientId, text, quick_replies = null) {
  const messageData = {
    recipient: { id: recipientId },
    message: {
      quick_replies: quick_replies,
      text: text
    }
  }
  await _send(messageData)
}

export async function templateMessage(recipientId, templates, quick_replies = null) {
    const messageData = {
      recipient: { id: recipientId },
      message: {
        quick_replies: quick_replies,
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: templates
          }
        }
      }
    }
    await _send(messageData)
}

export async function buttonMessage(recipientId, buttons, quick_replies = null) {
  const messageData = {
    recipient: { id: recipientId },
    message: {
      quick_replies: quick_replies,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          buttons: buttons
        }
      }
    }
  }
  await _send(messageData)
}

//
// Custom Messages
// ---
//
export async function subscriptionMessage(recipientId) {
  const user = await User.findOne(
    { messenger_id: recipientId },
    { subscription: 1 }
  )

  if (!user) {
    throw new Error(`User with id ${recipientId} doesn't exist.`)
  }

  const button = (user.subscription.active)
    ? new Button({
      type: 'postback',
      title: 'Unsubscribe',
      payload: actions.UNSUBSCRIBE
    })
    : new Button({
      type: 'postback',
      title: 'Subscribe',
      payload: actions.SUBSCRIBE
    })

  await buttonMessage(recipientId, [ button ])
}

export async function scheduledSubscriptionMessage() {
    const users = await User.find({ 'subscription.active': true })
    await Promise.all(users.map(async (user) => {
      await textMessage(user.messenger_id, 'SUBSCRIPTION MESSAGE')
    }))
}
