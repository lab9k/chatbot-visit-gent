class Button {
  constructor(text, postback) {
    this.text = text;
    this.postback = postback;
  }

  getResponse() {
    return {
      postback: this.postback,
      text: this.text,
    };
  }
}
module.exports = Button;
