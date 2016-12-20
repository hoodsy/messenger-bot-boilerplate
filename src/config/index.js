require('dotenv').config()

export const db = {
  dev: 'mongodb://localhost/nba-bot-dev',
  prod: 'mongodb://localhost/nba-bot-prod'
}

export const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN
export const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
export const WIT_TOKEN = process.env.WIT_TOKEN
