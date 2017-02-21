import request from 'request-promise'

import User from '../models/User'
import Generic from '../templates/Generic'
import Button from '../templates/Button'
import QuickReply from '../templates/QuickReply'
import ListItem from '../templates/ListItem'
import * as actions from '../actions'
import { choosePageToken, dashbot } from '../config'

//
// Message Request
// ---
//
async function _send(messageData) {
  const requestData = {
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: choosePageToken() },
    method: 'POST',
    json: messageData
  }
  const body = await request(requestData)
  // Track outbound messages
  dashbot.logOutgoing(requestData, body)
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

export async function buttonMessage(recipientId, text, buttons, quick_replies = null) {
  const messageData = {
    recipient: { id: recipientId },
    message: {
      quick_replies: quick_replies,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: text,
          buttons: buttons
        }
      }
    }
  }
  await _send(messageData)
}

export async function listMessage(recipientId, listItems, buttons, quick_replies = null) {
  const messageData = {
    recipient: { id: recipientId },
    message: {
      quick_replies: quick_replies,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'list',
          elements: listItems,
          buttons: buttons
        }
      }
    }
  }
  await _send(messageData)
}

//
// Custom Messages
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// ---------------------------------------------------------------
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

export async function startMessage(recipientId) {
  await User.createUnique(recipientId)

  await textMessage(recipientId, 'Hey there ✌️')
  await textMessage(recipientId, 'Let\'s have a look at our message templates 🌝')

  await textMessage(recipientId, '▶️ Button Template ▶️')
  const exampleButton = new Button({
    type: 'web_url',
    title: 'Click All The Buttons',
    url: 'http://giphy.com/gifs/nfl-football-celebration-3o7TKUWvGbDJp46i08'
  })
  await buttonMessage(recipientId, 'What to do now? 🤔', [ exampleButton ])

  await textMessage(recipientId, '✉️ Generic Template ✉️')
  const exampleTemplate = new Generic({
    title: 'Templates on Templates',
    subtitle: 'You can also use List, Receipt, and Airline templates... 👌',
    image_url: 'https://s-media-cache-ak0.pinimg.com/736x/13/e0/ce/13e0cef23c4323e8d32be0e6322be99a.jpg',
    buttons: [ exampleButton ]
  })
  await templateMessage(recipientId, [ exampleTemplate ])

  const exampleListItem1 = new ListItem({
    title: 'Item #1',
    subtitle: 'The firstest of items.',
    image_url: 'https://s-media-cache-ak0.pinimg.com/736x/13/e0/ce/13e0cef23c4323e8d32be0e6322be99a.jpg',
    default_action: {
      type: 'web_url',
      url: 'https://facebook.com/messengerbotboilerplate',
      messenger_extensions: true,
      webview_height_ratio: 'tall',
      fallback_url: 'https://facebook.com/messengerbotboilerplate'
    }
  })
  const exampleListItem2 = new ListItem({
    title: 'Item #2',
    subtitle: 'The secondest of items.',
    image_url: 'https://s-media-cache-ak0.pinimg.com/736x/13/e0/ce/13e0cef23c4323e8d32be0e6322be99a.jpg',
    buttons: [ exampleButton ]
  })

  await listMessage(
    recipientId,
    [ exampleListItem1, exampleListItem2 ]
  )

  const quickReply = new QuickReply({
    content_type: 'text',
    title: '💎 Free Stuff',
    payload: 'EXAMPLE_ACTION'
  })
  await textMessage(recipientId, 'Toss some Quick Replies in for good measure...', [ quickReply ])
}
