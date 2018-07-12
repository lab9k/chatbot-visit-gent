const Button = require('./button');

module.exports = function generate_navigate_button(url) {
    return new Button(
        'Toon mij de weg',
        url,
        'web_url'
    )
};