require('dotenv').config()
import Dashbot from 'dashbot'

export const db = {
  dev: 'mongodb://localhost/bot-bp-dev',
  prod: 'mongodb://localhost/bot-bp-prod'
}

export const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN
export const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
export const FB_APP_SECRET = process.env.FB_APP_SECRET
export const FB_PAGE_TEST_TOKEN = process.env.FB_PAGE_TEST_TOKEN
export const FB_APP_TEST_SECRET = process.env.FB_APP_TEST_SECRET
export const WIT_TOKEN = process.env.WIT_TOKEN
const DASHBOT_KEY = process.env.DASHBOT_KEY
export const NODE_ENV = process.env.NODE_ENV

//
// Analytics
// ---
// Facebook Messenger
//
export const dashbot = Dashbot(DASHBOT_KEY).facebook

export function choosePageToken() {
  return (NODE_ENV === 'production')
    ? FB_PAGE_TOKEN
    : FB_PAGE_TEST_TOKEN
}

export function chooseAppSecret() {
  return (NODE_ENV === 'production')
    ? FB_APP_SECRET
    : FB_APP_TEST_SECRET
}
