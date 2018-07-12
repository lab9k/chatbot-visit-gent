const QuickReplyButton = require('./quickReplyButton');

class QuickReply {
  /**
     *Creates an instance of QuickReply.
     * @param {String} text title of the quickreply (The bold text)
     * @param {Array.<String>} buttons Array of Strings you want included as button in this quickreply.
     * @memberof QuickReply
     */
  constructor(text, buttons) {
    this.text = text;
    this.quick_replies = buttons.forEach(button => new QuickReplyButton(button, button, 'text'));
  }
}

module.exports = QuickReply;
