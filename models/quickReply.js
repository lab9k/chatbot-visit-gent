const CardButton = require('./card_button');

class QuickReply {
    /**
     *Creates an instance of Card.
     * @param {String} title title of the quickreply (The bold text)
     * @param {Array.<Button>} buttons Array of Button objects you want included in this quickreply.
     * @memberof QuickReply
     */
    constructor(title = "Waarmee kan ik jou nog verder helpen?", buttons = [new CardButton("feestpleinen","feestpleinen","postback"),new CardButton("toiletten","toiletten","postback"),new CardButton("feedback","feedback","postback")]) {
      this.title = title;
      this.buttons = [...buttons];
    }
  
    getResponse() {
      const quickReplyObj = {
        title: this.title,
        buttons: []
      };
      quickReplyObj.buttons.push(...this.buttons.map((el) => el.getResponse()));
      // use JSON.parse(JSON.stringify(object)) to remove all undefined properties.
      return JSON.parse(JSON.stringify(quickReplyObj));
    }
  }
  
  module.exports = QuickReply;