import mongoose, { Schema } from 'mongoose'
import request from 'request-promise'

const UserSchema = new Schema({
  messenger_id: { type: String, index: 1 },
  subscription: {
    active: { type: Boolean, default: true }
  },
  profiles: {
    messenger: { type: Object }
  },
  session: {
    id: { type: String },
    context: { type: Object },
    default: {}
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

UserSchema.statics.createUnique = async function(messenger_id) {
  if (!await this.exists(messenger_id)) {
    const profile = await request({
      url: `https://graph.facebook.com/v2.6/${messenger_id}`,
      qs: {
        access_token: process.env.FB_PAGE_TOKEN,
        fields: 'first_name,last_name,profile_pic,locale,timezone,gender,is_payment_enabled'
      },
      method: 'GET'
    })

    await new this({
      messenger_id,
      profiles: {
        messenger: JSON.parse(profile)
      }
    }).save()
  }
}

UserSchema.statics.findOrCreateSession = async function (messenger_id) {
  const user = await this.findOne(
    { messenger_id },
    { session: 1 }
  )

  if (!user) {
    throw new Error(`No User found for ${messenger_id} in findOrCreateSession()`)
  }

  if (!user.session.id) {
    console.log('USER PRE SESSION CREATE')
    console.log('============')

    return await this.findOneAndUpdate(
      { messenger_id },
      {
        $set: {
          session: {
            id: new Date().toISOString(),
            context: {}
          }
        }
      },
      { new: true }
    )
  }
  else {

    console.log('SENDING SESSIONLESS USER')
    console.log('============')

    return user
  }
}

UserSchema.statics.exists = async function (messenger_id) {
  const count = await this.count({ messenger_id })
  return count > 0
}

UserSchema.statics.subscribe = async function (messenger_id) {
  await this.update(
    { messenger_id },
    { $set: { 'subscription.active': true } }
  )
}

UserSchema.statics.unsubscribe = async function (messenger_id) {
  await this.update(
    { messenger_id },
    { $set: { 'subscription.active': false } }
  )
}

export default mongoose.model('User', UserSchema)
