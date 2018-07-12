class Payload {
    /**
     *Creates an instance of Card.
     * @param {Object} attachment
     */
    constructor(attachment) {
        this.payload = {
            facebook: attachment
        }
    }
}

module.exports = Payload;