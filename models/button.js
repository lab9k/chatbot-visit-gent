class Button {
  constructor(text, postback, type) {
    this.text = text;
    this.postback = postback;
    this.type = type;
  }

  getResponse() {
    return {
      url: this.postback,
      title: this.text,
      type: this.type,
    };
  }
}
module.exports = Button;
