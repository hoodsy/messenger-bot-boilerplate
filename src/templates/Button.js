export default class Button {
  constructor(props) {
    this.type = props.type || null
    this.title = props.title || null
    this.url = props.url || null
    this.payload = props.payload || null
  }
}
