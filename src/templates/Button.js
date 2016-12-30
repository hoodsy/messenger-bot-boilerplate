//
//
// ---
// API Reference:
// https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template
//
// Types:
// postback, web_url, ...
//
// Example:
// new Button({
//   title: 'Click All The Buttons'
//   type: 'web_url',
//   url: 'http://giphy.com/gifs/nfl-football-celebration-3o7TKUWvGbDJp46i08'
// })
export default class Button {
  constructor(props) {
    this.type = props.type || null
    this.title = props.title || null
    this.url = props.url || null
    this.payload = props.payload
  }
}
