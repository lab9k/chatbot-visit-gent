class Button {
  /**
   *Creates an instance of Button.
   * @param {String} text text to be displayed in the button
   * @param {String} postback url which the button points to
   * @param {String} type type of button you want to define.
   * @memberof Button
   */
  constructor(text, postback, type) {
    this.text = text;
    this.postback = postback;
    this.type = type;
  }

  getResponse() {
    return {
      url: this.postback,
      title: this.text,
      type: this.type
    };
  }
}
module.exports = Button;
