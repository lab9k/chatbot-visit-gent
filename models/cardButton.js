class CardButton {
  /**
   *Creates an instance of CardButton.
   * @param {String} text text to be displayed in the button
   * @param {String} payload text which will be passed in backend
   * @param {String} type type of button you want to define.
   * @memberof Button
   */
  constructor(text, payload, type) {
    this.title = text;
    this.payload = payload;
    this.type = type;
  }
}

module.exports = CardButton;
