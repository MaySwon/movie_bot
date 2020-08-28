function  debug(obj = {}) {
    return JSON.stringify(obj, null,4)
}

module.exports = debug
module.exports = {
logStart(){
    console.log('Bot has been  started ....')
},
getChatId(msg) {
    return msg.chat.id
},
getItemUuid(source) {
    return source.substr(2, source.length)
}
}