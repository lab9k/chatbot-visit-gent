const Button = require('../../models/button');

module.exports = function generate_navigate_button(square) {
    return new Button(
        'Toon mij de weg',
        `https://www.google.com/maps/search/?api=1&query=${square.lat},${square.long}`,
        'web_url'
    )
};