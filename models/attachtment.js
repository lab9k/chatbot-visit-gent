class Attachment {
  /**
   *Creates an instance of Card.
   * @param {Object} cards
   */
  constructor(cards) {
    this.attachment = {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: cards
      }
    };
  }
}

module.exports = Attachment;
