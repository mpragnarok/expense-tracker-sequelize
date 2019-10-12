const Handlebars = require('handlebars')
// TODO: get year
Handlebars.registerHelper('getFormattedYear', function(date, options) {
  const year = date.split('-')[0]
  return year
})

// TODO: get month
Handlebars.registerHelper('getFormattedMonth', function(date, options) {
  const month = date.split('-')[1]
  return month
})

// get day Of Month
Handlebars.registerHelper('getFormattedDay', function(date, options) {
  const dayOfMonth = date.split('-')[2]
  return dayOfMonth
})

// Month name in English

Handlebars.registerHelper('convertMonthName', function(date, options) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const newDate = new Date(date)
  const monthName = monthNames[newDate.getMonth()]
  return monthName
})

// Day of Week name in English

Handlebars.registerHelper('convertDayOfWeekName', function(date, options) {
  const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const newDate = new Date(date)
  const dayOfWeekName = dayOfWeekNames[newDate.getDay()]
  return dayOfWeekName
})


// get icon from category and subCategory
Handlebars.registerHelper('getIcon', function(category, subCategory, options) {
  return category === 'expense' && subCategory === 'Home' ? `<i class="fas fa-home text-danger"></i>` :
    category === 'expense' && subCategory === 'Transportation' ? `<i class="fas fa-shuttle-van text-danger"></i>` :
    category === 'expense' && subCategory === 'Entertainment' ? `<i class="fas fa-grin-beam text-danger"></i>` :
    category === 'expense' && subCategory === 'Food & Beverage' ? `<i class="fas fa-utensils text-danger"></i>` :
    category === 'expense' && subCategory === 'Other' ? `<i class="fas fa-hand-holding-usd text-danger"></i>` :
    category === 'income' && subCategory === 'Gift' ? `<i class="fas fa-gift text-success"></i>` :
    category === 'income' && subCategory === 'Salary' ? `<i class="fas fa-money-check-alt text-success"></i>` :
    category === 'income' && subCategory === 'Interest' ? `<i class="fas fa-coins text-success"></i>` :
    category === 'income' && subCategory === 'Selling' ? `<i class="fas fa-donate text-success"></i>` : `<i class="fas fa-comment-dollar text-success"></i>`
})

// sign of amount

Handlebars.registerHelper('getSign', function(category, options) {
  return category === 'expense' ? `-` : `+`
})

// sum of day amount

Handlebars.registerHelper('sumDayAmount', function(records, prop, category, options) {
  const positiveSumAmount = records.reduce((acc, curr) => {
    if (curr[category] === 'income') {
      return acc + parseFloat(curr[prop])
    }
  }, 0) || 0


  const negativeSumAmount = records.reduce((acc, curr) => {
    if (curr[category] === 'expense') {
      return acc + parseFloat(curr[prop])
    }
  }, 0) || 0

  let sumAmount = positiveSumAmount - negativeSumAmount
  return sumAmount
})

// // sign of amount

// Handlebars.registerHelper('sumMonthAmount', function(input, options) {
//   let [monthAmount, monthIncome, monthExpense] = [0, 0, 0]
//   input.forEach(record => {
//     if (record.category === 'income') {
//       monthIncome += record.amount
//     } else {
//       monthExpense += record.amount
//     }
//   })
//   monthAmount = monthIncome - monthExpense
//   monthExpense = -Math.abs(monthExpense)

//   return [monthIncome, monthExpense, monthAmount]
// })