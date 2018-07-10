
class Card {
  /**
   *Creates an instance of Card.
   * @param {String} imgUrl url to the image you want displayed in the card
   * @param {String} title title of the card (The bold text)
   * @param {number[]} options location constructed as follow: [lon,lat]
   * @param {Object} options different options you want to use. e.g. subtitle
   * @param {Array.<Button>} buttons Array of Button objects you want included in this card.
   * @param {String} defaultUrl url for default action.
   * @memberof Card
   */
  constructor(imgUrl, title, options, buttons, defaultUrl = []) {
    this.imgUrl = imgUrl;
    this.title = title;
    this.subtitle = options.subtitle;
    this.buttons = [...buttons];
    this.defaultUrl = defaultUrl;
  }

  getResponse() {
    const cardObj = {
      buttons: [],
      image_url: this.imgUrl,
      subtitle: this.subtitle,
      title: this.title,      
    };
    if(this.defaultUrl.length !== 0){
      cardObj["default_action"] = {
        type: "web_url",
          url: this.defaultUrl,
          messenger_extensions: "false",
        webview_height_ratio: "tall"
      }
    }
    cardObj.buttons.push(...this.buttons.map((el) => el.getResponse()));
    // use JSON.parse(JSON.stringify(object)) to remove all undefined properties.
    return JSON.parse(JSON.stringify(cardObj));
  }
}

module.exports = Card;