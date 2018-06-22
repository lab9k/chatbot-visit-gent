const CardButton = require('./card_button');

class QuickReply {
    /**
     *Creates an instance of Card.
     * @param {String} title title of the quickreply (The bold text)
     * @param {Array.<Button>} buttons Array of Button objects you want included in this quickreply.
     * @memberof QuickReply
     */
    constructor(title, buttonsTitles) {
      this.title = title;
      this.buttons = [];
      buttonsTitles.forEach(buttonTitle => buttons.push(new CardButton(buttonTitle, buttonTitle, "postback")));
    }
  
    getResponse() {
      const quickReplyObj = {
        title: this.title,
        buttons: this.buttons
      };
      quickReplyObj.buttons.push(...this.buttons.map((el) => el.getResponse()));
      // use JSON.parse(JSON.stringify(object)) to remove all undefined properties.
      return JSON.parse(JSON.stringify(quickReplyObj));
    }
  }
  
  module.exports = QuickReply;