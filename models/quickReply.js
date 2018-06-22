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
      buttonsTitles.forEach(buttonTitle => this.buttons.push(new CardButton(buttonTitle, buttonTitle, "postback")));
    }
  
    getResponse() {
      const quickReplyObj = {
        text: this.title,
        quick_replies: this.buttons
      };
      quickReplyObj.buttons.push(...this.buttons.map((el) => el.getResponseQuickReply()));
      // use JSON.parse(JSON.stringify(object)) to remove all undefined properties.
      return JSON.parse(JSON.stringify(quickReplyObj));
    }
  }
  

  /*
  "facebook": {
         "text": "Pick a color:",
         "quick_replies": [
            {
               "content_type": "text",
               "title": "Red",
               "payload": "red"
            },
            {
               "content_type": "text",
               "title": "Green",
               "payload": "green"
            }
         ]
      }


  */
  module.exports = QuickReply;