class CardButton {
  /**
   *Creates an instance of Button.
   * @param {String} text text to be displayed in the button
   * @param {String} payload url which the button points to
   * @param {String} type type of button you want to define.
   * @memberof Button
   */
  constructor(text, payload, type) {
    this.text = text;
    this.payload = payload;
    this.type = type;
  }

  getResponse() {
    return {
      payload: this.payload,
      title: this.text,
      type: this.type,
    };
  }
}
module.exports = CardButton;
