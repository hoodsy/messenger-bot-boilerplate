
import * as send from '../api/send'
import * as actions from '../actions'
import { wit } from './index'
import User from '../models/User'
import { timeout } from '../util'
import { FB_VERIFY_TOKEN, dashbot } from '../config'

//
// Public Routes
// ---
//
export async function handleWebhookGet (req, res) {
  if (req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  }
  else {
    res.send('Error, wrong token')
  }
}

export async function handleWebhookPost (req, res) {
  // Track inbound messages
  dashbot.logIncoming(req.body)
  let messaging_events = req.body.entry[0].messaging
  if (!messaging_events) {
    return
  }

  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    // Handle button clicks,
    if (event.postback) {
      await handlePostback(event)
    }
    // text messages,
    else if (event.message && event.message.text &&
            !event.message.is_echo && !event.delivery) {
      await handleMessage(event)
    }
    // attachments,
    else if (event.message && event.message.attachments) {
      await handleAttachment(event)
    }
    // and quick replies.
    else if (event.quick_reply) {
      await handleQuickReply(event)
    }
  }
  res.sendStatus(200)
}

//
// Post Helpers
// ---
//
async function handleMessage({ message, sender }) {
  const user = await User.findOrCreateSession(sender.id)

  await wit.runActions(
    user.session.id, // the user's current session
    message.text, // the user's message
    user.session.context // the user's current session state
  )
}

async function handleAttachment({ message, sender }) {
  const user = await User.findOne({ messenger_id: sender.id })

  if (user && message.attachments.length > 0) {
    const [ location ] = message.attachments.filter(attachment => attachment.type === 'location')
    user.coordinates = {
      lat: location.payload.coordinates.lat,
      long: location.payload.coordinates.long,
      url: location.url
    }
    await user.save()
  }
}

async function handleQuickReply({ quick_reply, sender }) {
  // switch(quick_reply.payload) {
    // case actions.GET_FEATURED_ARTICLES:
    //   await send.featuredMessage(sender.id)
    //   return
  // }
}

async function handlePostback({ postback, sender }) {
  switch(postback.payload) {

    case actions.START:
      await send.startMessage(sender.id)
      return

    case actions.EDIT_SUBSCRIPTION:
      await send.subscriptionMessage(sender.id)
      return

    case actions.SUBSCRIBE:
      await User.subscribe(sender.id)
      await send.textMessage(sender.id, '🙌 Good choice!.')
      return

    case actions.UNSUBSCRIBE:
      await User.unsubscribe(sender.id)
      await send.textMessage(sender.id, 'It\'s sad to see you go 😿')
      return

    default:
      return

  }
}
