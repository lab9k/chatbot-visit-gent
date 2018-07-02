class ShareButton {
    /**
     *Creates an instance of Button.
     * @param {String} text text to be displayed in the button
     * @param {String} title title of the card (The bold text)
     * @param {String} subtitle subtitle of the card
     * @param {String} imgUrl url to the image you want displayed in the card     
     * @param {String} share_url url which the button points to
     * @memberof Button
     */
    constructor(title, image_url, [buttons]) {
      this.title = title;
      this.image_url = image_url;
      this.buttons = buttons;
    }
  
    getResponse() {
      return {
        "type": "element_share",
            "share_contents": { 
              "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                      {
                        "title": title,
                        "subtitle": subtitle,
                        "image_url": image_url,
                        "buttons": this.buttons,
                      }
                    ]
                  }
              }
            }
      };
    }
    
  
  }
  module.exports = ShareButton;
  