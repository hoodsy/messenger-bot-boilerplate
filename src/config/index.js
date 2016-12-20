require('dotenv').config()

export const db = {
  dev: 'mongodb://localhost/bot-bp-dev',
  prod: 'mongodb://localhost/bot-bp-prod'
}

export const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN
export const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
export const WIT_TOKEN = process.env.WIT_TOKEN
