class Button {
  constructor(text, postback, type) {
    this.text = text;
    this.postback = postback;
    this.type = type;
  }

  getResponse() {
    return {
      postback: this.postback,
      text: this.text,
      type: this.type,
    };
  }
}
module.exports = Button;
