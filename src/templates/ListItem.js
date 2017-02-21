//
//
// ---
// API Reference:
// https://developers.facebook.com/docs/messenger-platform/send-api-reference/list-template
//
// EXAMPLE default_action:
// ---
// "default_action": {
//   "type": "web_url",
//   "url": "https://facebook.com/messengerbotboilerplate",
//   "messenger_extensions": true,
//   "webview_height_ratio": "tall",
//   "fallback_url": "https://facebook.com/messengerbotboilerplate"
// }
export default class ListItem {
  constructor(props) {
    this.title = props.title || null
    this.subtitle = props.title || null
    this.image_url = props.image_url || null
    this.buttons = props.buttons || []
    this.default_action = props.default_action || null
  }
}
