const express = require('express')
const router = express.Router()
const db = require('../../models')
const Record = db.Record
const { authenticated } = require('../../config/auth')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const subCategories = ['Home', 'Transportation', 'Entertainment', 'Food', 'Other', 'Gifts', 'Salary', 'Interest', 'Selling', 'Other']
const { getFormattedDate, recordGroupByDay, getSearchMonth, sumMonthAmount, checkSubCategory } = require('../../data-formatting')

// import express-validator setting
const validation = require('../validator')
const { validationResult } = require('express-validator')

// fetch all records
router.get('/', authenticated, validation.queryValidator, async (req, res) => {
  // get req.queries
  let { subCategory, subCategoryNum, monthYear } = req.query
  // month day year default value
  let [month, day, year] = getFormattedDate().split('-')
  const errorsMessage = validationResult(req)
  try {
    // get month year value when user selected
    if (monthYear)[month, year] = [monthYear.split('-')[0], monthYear.split('-')[1]]

    // query validator errors messages
    if (!errorsMessage.isEmpty()) {
      return res.status(422).render('404', {
        warning: errorsMessage.array()
      })
    }

    // fetch the records in default month and year
    const records = await Record.findAll({
      where: {
        date: getSearchMonth(year, month),
        subCategory: checkSubCategory(subCategoryNum) ? subCategories[subCategoryNum] : {
          [Op.or]: subCategories
        },
        UserId: req.user.id
      },
      order: [
        ['date', 'DESC']
      ]
    })
    // console.log(records)
    if (!records || (checkSubCategory(subCategoryNum) === false)) {
      return res.redirect('/404')
    }

    // summarize month income, expense and amount
    const [monthIncome, monthExpense, monthAmount] = sumMonthAmount(records).split('/')

    // records group by day
    const recordsGroupByDay = recordGroupByDay(records, month, year)

    res.render('index', { month, year, recordsGroupByDay, records, monthIncome, monthExpense, monthAmount, subCategoryNum, subCategory, monthYear })
  } catch (e) {
    res.status(500).send(e)
  }
})

// create a new transaction in page
router.get('/add', authenticated, async (req, res) => {
  const formattedDate = getFormattedDate()
  try {
    res.render('add', { formattedDate, category: 'Select a category' })
  } catch (e) {
    res.status(500).send()
  }
})

// create a new transaction
router.post('/', authenticated, validation.validRecord, async (req, res) => {
  let { name, date, subCategoryValue, amount, merchant } = req.body
  let [category, subCategory] = subCategoryValue.split('/')
  const errorsMessage = validationResult(req)
  amount = Math.abs(parseFloat(amount))


  const record = new Record({
    name,
    date: getFormattedDate(date),
    subCategory,
    category,
    amount,
    merchant,
    UserId: req.user.id
  })

  let errors = []
  try {
    if (!errorsMessage.isEmpty()) {
      return res.render('add', {
        warning: errorsMessage.array(),
        name,
        date,
        subCategory,
        category,
        amount,
        merchant,
      })
    }
    if (!name || !date || !subCategoryValue || !amount) {
      errors.push({ message: 'All fields are required' })
    }

    if (errors.length > 0) {
      return res.render('add', {
        errors,
        name,
        date,
        subCategoryValue,
        amount,
        merchant
      })
    }

    await record.save()
    res.redirect('/')
  } catch (e) {
    res.status(400).send(e)
  }
})

// update a transaction in page
router.get('/:id/edit', authenticated, async (req, res) => {
  try {
    const record = await Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
    if (!record) {
      return res.status(404).send()
    }
    res.render('edit', { record })
  } catch (e) {
    res.status(500).send(e)
  }
})

// update a transaction
router.put('/:id', authenticated, validation.validRecord, async (req, res) => {

  const errorsMessage = validationResult(req)
  let errors = []
  const record = await Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })

  let { name, date, subCategoryValue, amount, merchant } = req.body
  let [month, day, year] = date.split('-')
  let [category, subCategory] = subCategoryValue.split('/')

  try {
    if (!errorsMessage.isEmpty()) {
      return res.render('edit', {
        warning: errorsMessage.array(),
        name,
        date,
        subCategory,
        category,
        amount,
        merchant,
      })
    }
    if (!name || !date || !subCategoryValue || !amount) {
      errors.push({ message: 'All fields are required' })
    }

    if (errors.length > 0) {
      return res.render('edit', {
        errors,
        name,
        date,
        category,
        subCategory,
        amount,
        merchant
      })
    }

    amount = Math.abs(parseFloat(amount))

    record.name = name
    record.date = getFormattedDate(date)
    record.subCategory = subCategory
    record.category = category
    record.amount = amount
    record.merchant = merchant

    await record.save()
    res.redirect('/')

  } catch (e) {
    res.status(400).send(e)
  }
})
// delete a transaction
router.delete('/:id', authenticated, async (req, res) => {
  try {
    const record = await Record.destroy({ where: { id: req.params.id, UserId: req.user.id } })
    if (!record) {
      return res.status(404).send()
    }
    res.redirect('/')
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router