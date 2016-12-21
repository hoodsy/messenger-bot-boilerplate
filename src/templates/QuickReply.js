export default class QuickReply {
  constructor(props) {
    this.content_type = props.content_type || null
    this.title = props.title || null
    this.payload = props.payload || null
    this.image_url = props.image_url || null
  }
}
