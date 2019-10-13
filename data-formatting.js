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
  },
  // formatted records
  recordGroupByDay: (input, month, year) => {
    let recordsGroupByDay = []
    input.forEach(record => {
      recordsGroupByDay.push({
        date: record.date,
        dateFormatted: `${record.date.getFullYear()}-${record.date.getMonth()+1}-${record.date.getDate()-1}`,
        record: record.dataValues
      })
    })

    recordsGroupByDay = recordsGroupByDay.reduce((result, {
      dateFormatted,
      record
    }) => {
      if (!result[dateFormatted]) result[dateFormatted] = {
        records: []
      }
      result[dateFormatted].records.push({
        ...record
      })
      return result
    }, {})
    // console.log(recordsGroupByDay)
    return recordsGroupByDay
  },


  // search date in period
  getSearchMonth: (year, month) => {
    if (!month) { return {} }
    let thisMonth = new Date(year, month)
    thisMonth.setMonth(thisMonth.getMonth() - 1)
    let nextMonth = new Date(year, month)
    return {
      [Op.gte]: thisMonth,
      [Op.lt]: nextMonth
    }
  },

  sumMonthAmount: (records) => {
    let [monthIncome, monthExpense, monthAmount] = [0, 0, 0]
    records.forEach(record => {
      if (record.category === 'income') {
        monthIncome += record.amount
      }
      if (record.category === 'expense') {
        monthExpense += record.amount
      }
    })
    monthAmount = monthIncome - monthExpense
    console.log(monthExpense)
    return `+${monthIncome}/-${monthExpense}/${monthAmount}`
  },

  checkSubCategory: (query) => {
    let regex = RegExp(/([0-9])$/)
    return regex.test(query)
  }
}