export default class Generic {
  constructor(props) {
    this.title = props.title || null
    this.image_url = props.image_url || null
    this.item_url = props.item_url || null
    this.subtitle = props.subtitle || null
    this.buttons = props.buttons || []
  }
}
