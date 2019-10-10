const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
  // formatted date
  getFormattedDate: (input) => {
    const date = new Date()
    const year = input ? input.split('-')[2] : date.getFullYear()
    const month = input ? input.split('-')[0] : date.getMonth() + 1
    const day = input ? (parseInt((input.split('-')[1])) + 1).toString() : date.getDate()
    return `${month}-${day}-${year}`
  }
  // TODO: search date in period


}