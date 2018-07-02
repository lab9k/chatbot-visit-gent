class ShareButton {
    /**
     *Creates an instance of Button.
     *  @param {String} title title of the card (The bold text)
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
        type: "element_share",
      };
    }
    
  
  }
  module.exports = ShareButton;
  