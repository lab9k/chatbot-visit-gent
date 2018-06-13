
class Card {
  /**
   *Creates an instance of Card.
   * @param {String} imgUrl url to the image you want displayed in the card
   * @param {String} title title of the card (The bold text)
   * @param {number[]} location location constructed as follow: [lon,lat]
   * @param {Object} options different options you want to use. e.g. subtitle
   * @param {Array.<Button>} buttons Array of Button objects you want included in this card.
   * @memberof Card
   */
  constructor(imgUrl, title, location, options, buttons) {
    this.imgUrl = imgUrl;
    this.title = title;
    this.location = location;
    this.subtitle = options.subtitle;
    this.buttons = [...buttons];
  }

  getResponse() {
    const cardObj = {
      buttons: [],
      image_url: this.imgUrl,
      subtitle: this.subtitle,
      title: this.title,
    };
    cardObj.buttons.push(...this.buttons.map((el) => el.getResponse()));
    // use JSON.parse(JSON.stringify(object)) to remove all undefined properties.
    return JSON.parse(JSON.stringify(cardObj));
  }
}

module.exports = Card;
