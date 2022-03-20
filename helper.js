const { copyPasta } = require('./constants');

module.exports = {
  parseKeywordList: function(keywordList = [], message, parseType) {
    const self = this;

    if (parseType) {
      return keywordList.some(keyword => {
        if (parseType) {
          try {
            return message[parseType](keyword);
          } catch(err) {
            console.error(err);
            return false
          }
        }

        return keyword === message;
      });
    }

    return self.isMessageIncluded(keywordList, message);
  },

  isMessageValid: function(message) {
    const self = this;
    const messageObj = copyPasta.find(function (pastaObj) {
      const { keywords, parseType } = pastaObj;

      return self.parseKeywordList(keywords, message, parseType);
    });

    return messageObj || false;
  },

  /**
   * @param {String} message - message sent by user
   * @returns {String} message to be sent 
   */
  getMessage: function(message) {
    copyPasta.forEach(function (pastaObj) {
      const self = this;
      const isMatched = self.isMessageValid(message, pastaObj);
      return isChanceSuccess && isMatched ? pastaObj.message : false;

      // keywords.forEach(function (keyword) {
      //   if (interactionType) {
      //     const isMatched = message[interactionType]();
      //     const isChanceSuccess = chance ? self.isRandomSuccess(chance) : true;
      //     return isChanceSuccess && isMatched ? pastaObj.message : false;
      //   }

      //   return message === keyword ? pastaObj.message : false;
      // })
    });

    return false;
  },

  isMessageExact: function(message, keyword) {
    return keyword === message;
  },

  isMessageIncluded: function(keywordList = [], message) {
    return keywordList.includes(message);
  },

  isRandomSuccess: function(chance = 100) {
    return Number((Math.random() * 100).toFixed()) <= chance;
  },

  getEmbed: function(title = '', imageUrl = '') {
    const msgEmbed = new Discord.MessageEmbed();
    title && msgEmbed.setTitle(title);
    imageUrl && msgEmbed.setImage(imageUrl);

    return { embeds: [msgEmbed] };
  }
}