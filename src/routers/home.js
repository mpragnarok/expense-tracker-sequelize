const { getFormattedDate } = require('../../data-formatting')

const express = require('express')
const router = express.Router()
const db = require('../../models')
const Record = db.Record
const { authenticated } = require('../../config/auth')
// const mongoose = require('mongoose')
// let ObjectId = mongoose.Types.ObjectId


// expense-tracker homepage
router.get('/', authenticated, async (req, res) => {
  let [month, day, year] = getFormattedDate().split('-')
  const monthYear = req.query.monthYear

  try {
    if (monthYear !== undefined) {
      [month, year] = req.query.monthYear.split('-')
    }



    // // sum up all the expense and income
    // const sumupMonth = await Record.aggregate([{
    //     $match: {
    //       $and: [{ 'month': month }, { 'year': year },
    //         { 'userId': new ObjectId(req.user._id) }
    //       ]
    //     }
    //   }, {
    //     $group: {
    //       _id: {
    //         month: { $month: "$date" },
    //         year: { $year: "$date" }
    //       },
    //       expense: {
    //         $sum: {
    //           $cond: [
    //             { $eq: ["$category", "expense"] },
    //             "$amount", 0
    //           ]
    //         },
    //       },
    //       income: {
    //         $sum: {
    //           $cond: [
    //             { $eq: ["$category", "income"] },
    //             "$amount", 0
    //           ]
    //         }
    //       }
    //     }
    //   }, {
    //     $addFields: {
    //       expenseString: { $substr: ["$expense", 0, -1] },
    //       incomeString: { $substr: ["$income", 0, -1] }
    //     }
    //   },
    //   {
    //     $project: {

    //       category: "$_id.category",
    //       expenseWithSign: {
    //         $concat: ["-", "$expenseString"]
    //       },
    //       incomeWithSign: {
    //         $concat: ["+", "$incomeString"]
    //       },
    //       sum: { $subtract: ["$income", "$expense"] }
    //     }
    //   }
    // ])

    // // sumup day balance
    // const sumupDay = await Record.aggregate([{
    //   $match: {
    //     $and: [{ 'month': month }, { 'year': year },
    //       { 'userId': new ObjectId(req.user._id) }
    //     ]
    //   }
    // }, {
    //   $group: {
    //     _id: {
    //       dayOfMonth: { $dayOfMonth: "$date" },
    //       month: { $month: "$date" },
    //       year: { $year: "$date" },
    //       dayOfWeek: { $dayOfWeek: "$date" }
    //     },
    //     expense: {
    //       $sum: {
    //         $cond: [
    //           { $eq: ["$category", "expense"] },
    //           "$amount", 0
    //         ]
    //       },
    //     },
    //     income: {
    //       $sum: {
    //         $cond: [
    //           { $eq: ["$category", "income"] },
    //           "$amount", 0
    //         ]
    //       }
    //     },
    //     record: {
    //       $push: "$$ROOT"
    //     },

    //   }
    // }, {
    //   $project: {
    //     sum: { $subtract: ["$income", "$expense"] },
    //     record: "$record",
    //     year: '$_id.year',
    //     month: '$_id.month',
    //     dayOfMonth: '$_id.dayOfMonth',
    //     dayOfWeek: '$_id.dayOfWeek'
    //   }
    // }, {
    //   $addFields: {
    //     monthName: {
    //       $let: {
    //         vars: {
    //           monthsInString: [, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    //         },
    //         in: {
    //           $arrayElemAt: ['$$monthsInString', '$month']
    //         }
    //       }
    //     },
    //     dayOfWeekName: {
    //       $let: {
    //         vars: {
    //           dayOfWeekInString: [, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    //         },
    //         in: {
    //           $arrayElemAt: ['$$dayOfWeekInString', '$dayOfWeek']
    //         }
    //       }
    //     }
    //   }
    // }, {
    //   $sort: { "dayOfMonth": -1 }
    // }])



    res.render('index', { month, year })
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router