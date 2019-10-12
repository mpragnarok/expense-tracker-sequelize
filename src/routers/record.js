const { getFormattedDate } = require('../../data-formatting')

const express = require('express')
const router = express.Router()
const db = require('../../models')
const Record = db.Record
const User = db.User
const { authenticated } = require('../../config/auth')
// const mongoose = require('mongoose')
// let ObjectId = mongoose.Types.ObjectId


// fetch all records
router.get('/', authenticated, async (req, res) => {
  // date formatting
  const date = new Date()
  const monthYear = req.query.monthYear
  let [day = (("0" + date.getDate()).slice(-2)), month = ('0' + ((date.getMonth() + 1).toString())).slice(-2), year = date.getFullYear().toString()] = []
  // get category
  // const subCategoryNum = req.query.subCategoryNum
  const subCategory = req.query.subCategory
  // check query string
  let regex = RegExp(/([0-9])$/)

  function checkSubCategory(query) {
    return regex.test(query)
  }

  try {
    if (monthYear !== undefined) {
      month = req.query.monthYear.split('-')[0]
      year = req.query.monthYear.split('-')[1]
    }
    // find all records
    const records = await Record.findAll({
      where: { UserId: req.user.id },
      order: [
        ['date', 'DESC']
      ]
    })
    console.log(records)
    // TODO:Amount sum By month
    // let sumupMonth =
    // income

    // outcome

    // Total amount

    // TODO: sign of amount

    // TODO: convert dayOfMonth to Month name

    // TODO: convert dayOfWeek to dayOfWeekName

    // TODO: Amount sum by day

    // TODO: list all transactions in same day



    res.render('index', { month, year, subCategoryNum, subCategory })
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
router.post('/', authenticated, async (req, res) => {
  let { name, date, subCategoryValue, amount, merchant } = req.body
  let [category, subCategory] = subCategoryValue.split('/')

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
router.put('/:id', authenticated, async (req, res) => {


  let errors = []
  const record = await Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })

  let { name, date, subCategoryValue, amount, merchant } = req.body
  let [month, day, year] = date.split('-')
  let [category, subCategory, icon, subCategoryNum] = subCategoryValue.split('/')
  let sign = '+'

  try {
    if (!name || !date || !subCategoryValue || !amount) {
      errors.push({ message: 'All fields are required' })
    }

    if (errors.length > 0) {
      month += 1
      return res.render('add', {
        errors,
        name,
        date,
        subCategoryValue,
        subCategory,
        amount,
        merchant
      })
    }



    const monthField = month
    const dayField = day
    month -= 1 //new Date() needs month index
    if (dayField === day) {
      day = parseInt(day) + 1
    }
    amount = Math.abs(parseFloat(amount))


    record.name = name
    record.date = date
    record.subCategory = subCategory
    record.category = category
    // record.sign = sign
    // record.icon = icon
    record.amount = amount
    // record.month = monthField
    // record.year = year
    // record.day = dayField
    record.merchant = merchant

    // if (category === 'expense') sign = '-'

    await record.save()
    res.redirect('/')



  } catch (e) {
    res.status(400).send(e)
  }
})
// delete a transaction
router.delete('/:id', authenticated, async (req, res) => {
  try {
    const record = await Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
    if (!record) {
      return res.status(404).send()
    }
    // if that date of record is empty, delete it
    record.remove()
    res.redirect('/')
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router