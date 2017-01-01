require('dotenv').config()
import Dashbot from 'dashbot'

export const db = {
  dev: 'mongodb://localhost/messenger-bot-boilerplate',
  prod: 'mongodb://localhost/messenger-bot-boilerplate'
}

export const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN
export const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
export const FB_APP_SECRET = process.env.FB_APP_SECRET
export const WIT_TOKEN = process.env.WIT_TOKEN
const DASHBOT_KEY = process.env.DASHBOT_KEY

//
// Analytics
// ---
// Facebook Messenger
//
export const dashbot = Dashbot(DASHBOT_KEY).facebook
