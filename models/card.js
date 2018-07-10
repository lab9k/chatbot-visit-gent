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
        this.image_url = imgUrl;
        this.title = title;
        this.subtitle = options.subtitle;
        this.buttons = [...buttons];
        if (defaultUrl.length !== 0) {
            this.default_action = {
                type: "web_url",
                url: defaultUrl,
                messenger_extensions: "false",
                webview_height_ratio: "tall"
            }
        }
    }
}

module.exports = Card;