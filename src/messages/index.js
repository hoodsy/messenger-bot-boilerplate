//
// Cards
// ---
//
export class Card {
  constructor(props) {
    this.title = props.title || null
    this.image_url = props.image_url || null
    this.item_url = props.item_url || null
    this.subtitle = props.subtitle || null
    this.buttons = props.buttons || []
  }

  button(type, title, data) {
    const button = { type, title }
    if (type === 'web_url') {
      button.url = data
    }
    else if (type === 'postback') {
      button.payload = data
    }
    else if (type === 'element_share') {
      delete button.title
    }
    this.buttons.unshift(button)
  }
}

//
// Quick Replies
// ---
//
export const quick_replies = [
  {
    content_type: 'text',
    title: '',
    payload: 'ACTION NAME',
    image_url: ''
  }
]
