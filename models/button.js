class Button {
  /**
   *Creates an instance of Button.
   * @param {String} text text to be displayed in the button
   * @param {String} postback url which the button points to
   * @param {String} type type of button you want to define.
   * @memberof Button
   */
  constructor(text, postback, type) {
    this.title = text;
    this.url = postback;
    this.type = type;
  }
}

module.exports = Button;
