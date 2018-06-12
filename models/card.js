class Card {
  /**
   *Creates an instance of Card.
   * @param {String} imgUrl - url to the image you want displayed in the card
   * @param {String} title - title of the card (The bold text)
   * @param {Array} location - location constructed as follow: [lon,lat]
   * @param {Object} options - different options you want to use. e.g. subtitle
   * @param {Array} buttons - Array of Button objects
   * @memberof Card
   */
  constructor(imgUrl, title, location, options, buttons) {
    this.imgUrl = imgUrl;
    this.title = title;
    this.location = location;
    this.subtitle = options.subtitle;
    this.buttons = [...buttons];
  }

  getObject() {
    const obj = {};
    obj.card = {
      title: this.title,
      subtitle: this.subtitle,
    };
    return this.imgUrl;
  }
  getResponse() {
    const cardObj = {
      buttons: [],
      image_url: this.imgUrl,
      // platform: 'facebook',
      subtitle: (this.subtitle || '') + this.location,
      title: this.title,
      // type: 1,
    };
    cardObj.buttons.push(...this.buttons.map((el) => el.getResponse()));
    return cardObj;
  }
}

module.exports = Card;
