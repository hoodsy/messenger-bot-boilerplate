import { Wit, log, interactive } from 'node-wit'
import moment from 'moment'
import 'moment-round'

import { WIT_TOKEN } from '../config'
import { dbConnect } from '../config/db'
import * as send from './send'
import User from '../models/User'
import QuickReply from '../templates/QuickReply'

const TESTING_MODE = require.main === module
const PICKUP_OPTIONS = [ 'ASAP', '2 hours', '3 hours' ]
const DELIVERY_OPTIONS = [ 'ASAP' ]
const TIME_FORMAT = 'LT dddd'
const MIN_CLEANING_HOURS = 6
const OPEN_TIME = moment().startOf('day').add(8, 'hours')
const CLOSE_TIME = moment().endOf('day').subtract(5, 'hours')

//
// Bot Actions
// ---
//
const actions = {
  // async send({ sessionId }, { text }) {
  async send(req, res) {

    if (req.context.quick_replies) {
      res.quickreplies = req.context.quick_replies
    }

    console.log(req)
    console.log('**********************************************************************')
    console.log('**********************************************************************')

    console.log(res)
    console.log('========================================================================')
    console.log('========================================================================')

    const user = await User.findOne(
      { 'session.id': req.sessionId }
    )

    if (user && user.messenger_id) {
      await send.textMessage(user.messenger_id, res.text)
      // await send.textMessage(user.messenger_id, text)
    } else {
      // console.error(`Oops! Couldn\'t find user for session: ${sessionId}`)
      const { quick_replies } = req.context
    }
  },

  // Suggest pickupTime in quick_replies
  async showPickupOptions({ context, text, entities }) {
    // context.quick_replies = PICKUP_OPTIONS.map(option => new QuickReply({
    //   title: option,
    //   content_type: 'text'
    // }))
    context.quick_replies = PICKUP_OPTIONS
    return context
  },

  // Set pickupTime in context
  // Suggest deliveryTime in quick_replies
  async setPickupTime({ context, text, entities }) {
    console.log(entities)
    const now = moment()
    // Quick Replies: pickup 1, 2, or 3 hours from current time
    if (isAnOption(PICKUP_OPTIONS, text)) {
      // const hours = text[0]
      const hours = PICKUP_OPTIONS.indexOf(text) + 1
      context.pickupTime = now.add(hours, 'hours').format(TIME_FORMAT)
      context.pickupDate = now.add(hours, 'hours').valueOf()
    }
    // If given 30mins notice and within business hours
    else if (entities.datetime) {
      const inputTime = moment(entities.datetime[0].value)
      if (isValidPickupTime(inputTime, now)) {
        context.pickupTime = inputTime.format(TIME_FORMAT)
        context.pickupDate = inputTime.valueOf()
      }
      else {
        context.invalidPickupTime = true
        context.quick_replies = PICKUP_OPTIONS
        return context
      }
    }
    // Missing time from User Input
    else {
      context.missingPickupTime = true
      context.quick_replies = PICKUP_OPTIONS
      return context
    }
    context.invalidPickupTime = null
    context.missingPickupTime = null
    context.quick_replies = null
    return context
  },

  async setDeliveryTime({ context, text, entities }) {
    console.log(entities)
    // Quick Replies: pickup 7 hours from current time
    // if (DELIVERY_OPTIONS.some(option => option === text)) {
    //   context.deliveryTime = pickupTime.add(7, 'hours').format(TIME_FORMAT)
    // }
    // User input: at least 7 hours ahead of pickupTime
    if (entities.datetime) {
      const inputTime = moment(entities.datetime[0].value)
      if (isValidDeliveryTime(inputTime, context.pickupDate)) {
        context.deliveryTime = inputTime.format(TIME_FORMAT)
      }
      else {
        context.invalidDeliveryTime = true
        return context
      }
    }
    // Missing time from User Input
    else {
      context.missingDeliveryTime = true
      return context
    }
    context.invalidDeliveryTime = null
    context.missingDeliveryTime = null
    return context
  },

}

// Pick Up Helpers
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
const isAnOption = (options, text) => options.some(option => option === text)
const isValidPickupTime = (inputTime, now) => {
  return (
    inputTime.isSameOrAfter(now.add(30, 'minutes')) &&
    inputTime.isSameOrAfter(OPEN_TIME) &&
    inputTime.isSameOrBefore(CLOSE_TIME)
  )
}

// Delivery Helpers
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
const isValidDeliveryTime = (inputTime, pickupDate) => {
  return (
    inputTime.isSameOrAfter(moment(pickupDate).add(7, 'hours')) &&
    inputTime.hours() >= 8 &&
    inputTime.hours() <= 19
  )
}

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
