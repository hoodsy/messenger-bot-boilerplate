//
//
// ---
// API Reference:
// https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template
//
export default class Generic {
  constructor(props) {
    this.title = props.title || null
    this.image_url = props.image_url || null
    this.default_action = props.default_action || null
    this.subtitle = props.subtitle || null
    this.buttons = props.buttons || []
  }
}
