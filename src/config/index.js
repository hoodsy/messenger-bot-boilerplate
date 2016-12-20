require('dotenv').config()

export const db = {
  dev: 'mongodb://localhost/nba-bot-dev',
  prod: 'mongodb://localhost/nba-bot-prod'
}

export const token = process.env.VERIFY_TOKEN
