const { getFormattedDate, recordGroupByDay, getSearchMonth, sumMonthAmount } = require('../../data-formatting')

const express = require('express')
const router = express.Router()

const db = require('../../models')
const Record = db.Record
const { authenticated } = require('../../config/auth')


// expense-tracker homepage
router.get('/', authenticated, async (req, res) => {
  let [month, day, year] = getFormattedDate().split('-')
  const monthYear = req.query.monthYear



  try {
    if (monthYear !== undefined) {
      [month, year] = req.query.monthYear.split('-')
    }
    // fetch the records in default month and year
    const records = await Record.findAll({
      where: {
        date: getSearchMonth(year, month),
        UserId: req.user.id
      },
      order: [
        ['date', 'DESC']
      ]
    })
    const [monthIncome, monthExpense, monthAmount] = sumMonthAmount(records).split('/')

    // records.forEach(record => {
    //   if (record.category === 'income') {
    //     monthIncome += record.amount
    //   }
    //   if (record.category === 'expense') {
    //     monthExpense += record.amount
    //   }
    // })
    // monthAmount = monthIncome - monthExpense
    // monthExpense = -Math.abs(monthExpense)

    const recordsGroupByDay = recordGroupByDay(records, month, year)


    res.render('index', { month, year, recordsGroupByDay, records, monthIncome, monthExpense, monthAmount })
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router