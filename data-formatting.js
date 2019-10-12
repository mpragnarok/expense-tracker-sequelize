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
      if ((record.date.getMonth() + 1).toString() === month && record.date.getFullYear().toString() === year) {
        recordsGroupByDay.push({
          date: record.date,
          dateFormatted: `${record.date.getFullYear()}-${record.date.getMonth()+1}-${record.date.getDate()-1}`,
          record: record.dataValues
        })
      }
    })

    return recordsGroupByDay.reduce((result, {
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
  },


  // search date in period
  getSearchMonth: (year, month) => {
    if (!month) { return {} }
    let nextMonth = new Date(year, month)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return {
      [Op.between]: [new Date(month), nextMonth]
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
    return `+${monthIncome}/-${monthExpense}/=${monthAmount}`
  }

}