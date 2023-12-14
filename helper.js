const { copyPasta, users } = require('./constants')

module.exports = {
  parseKeywordList: function (keywordList = [], message, parseType) {
    const self = this

    if (parseType) {
      return keywordList.some((keyword) => {
        if (parseType) {
          try {
            return message[parseType](keyword)
          } catch (err) {
            console.error(err)
            return false
          }
        }

        return keyword === message
      })
    }

    return self.isMessageIncluded(keywordList, message)
  },

  isMessageValid: function (message) {
    const self = this

    const messageObj = copyPasta.find(function (pastaObj) {
      const { keywords, parseType, chance } = pastaObj
      const isChanceSuccess = chance ? self.isRandomSuccess(chance) : true

      return isChanceSuccess
        ? self.parseKeywordList(keywords, message, parseType)
        : false
    })

    return messageObj || false
  },

  isMessageExact: function (message, keyword) {
    return keyword === message
  },

  isMessageIncluded: function (keywordList = [], message) {
    return keywordList.includes(message)
  },

  isRandomSuccess: function (chance = 100) {
    return Number((Math.random() * 100).toFixed()) <= chance
  },

  /**
   * Get value of a random index in an array
   * @param {Array} arr
   * @returns {any} value of array
   */
  getRandomMessage: function (arr = []) {
    const randomNum = Number((Math.random() * arr.length).toFixed())
    return arr[randomNum - 1]
  },

  // getEmbed: function(title = '', imageUrl = '') {
  // 	const msgEmbed = new Discord.MessageEmbed();
  // 	title && msgEmbed.setTitle(title);
  // 	imageUrl && msgEmbed.setImage(imageUrl);

  // 	return { embeds: [msgEmbed] };
  // },

  trimMessage: function (message = '') {
    return message.substring(0, 2000) || ''
  },

  formatMessage: function (messageObj) {
    const self = this

    const { isQueue } = messageObj
    const isMutipleMessage = Array.isArray(messageObj.message)
    const parsedMessage =
      isMutipleMessage && !isQueue
        ? self.getRandomMessage(messageObj.message)
        : self.trimMessage(messageObj.message)

    if (messageObj.mention) {
      const userID = users.find((user) => user.name === messageObj.mention)

      if (userID) {
        return `${parsedMessage} <@${userID.id}>`
      }

      return ''
    }

    return parsedMessage
  },
}
