import { token } from '../config'
import * as send from '../api/send'
import * as actions from '../actions'
import User from '../models/User'
import { timeout } from '../util'

//
// Public Routes
// ---
//
export async function handleWebhookGet (req, res) {
  if (req.query['hub.FB_VERIFY_TOKEN'] === token) {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
}

export async function handleWebhookPost (req, res) {
  let messaging_events = req.body.entry[0].messaging
  if (!messaging_events) {
    return
  }

  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]


    console.log('EVENT: ', event)
    console.log('============')


    if (event.message && event.message.text &&
        !event.message.is_echo && !event.delivery) {
      await handleMessage(event)
      continue
    }

    if (event.postback) {
      await handlePostback(event)
      continue
    }
  }
  res.sendStatus(200)
}

//
// Post Helpers
// ---
//
import { sessions, wit, findOrCreateSession } from './index'
async function handleMessage({ message, sender }) {

  // const text = message.text.toLowerCase()
  // if (text.includes('help')) {
  //   await send.textMessage(sender.id, 'That\'s what I\'m here for! 😎')
  // }
  // else if (message.quick_reply) {
  //   await handleQuickReply(message, sender)
  // }
  // else {
  //   await send.textMessage(sender.id, 'Message Received: ' + message.text)
  // }

  // const sessionId = findOrCreateSession(sender);
  const user = await User.findOrCreateSession(sender.id)

  await wit.runActions(
    user.session.id, // the user's current session
    message.text, // the user's message
    user.session.context // the user's current session state
  )
  .then(context => console.log('IN THEN: ', context))

  // const context = await wit.runActions(
  //   sessionId, // the user's current session
  //   message.text, // the user's message
  //   sessions[sessionId].context // the user's current session state
  // )
  // ).then((context) => {
  //   // Our bot did everything it has to do.
  //   // Now it's waiting for further messages to proceed.
  //   console.log('Waiting for next user messages');
  //
  //   sessions[sessionId].context = context;
  // })

  await send.textMessage(sender.id, 'Message Received: ' + message.text)
}

async function handleQuickReply({ quick_reply }, sender) {
  switch(quick_reply.payload) {

    // case actions.GET_FEATURED_ARTICLES:
    //   await send.featuredMessage(sender.id)
    //   return

  }
}

async function handlePostback({ postback, sender }) {
  switch(postback.payload) {

    case actions.START:
      await User.createUnique(sender.id)
      await send.textMessage(sender.id, 'Hey there! 😁 I\'ll bring you Politics and NBA news daily - if you get lost just say "help".')

      await timeout(1000)
      await send.textMessage(sender.id, 'Here are the daily headlines, for your viewing pleasure:')
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
