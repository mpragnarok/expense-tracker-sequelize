const Handlebars = require('handlebars')
// TODO: get year
Handlebars.registerHelper('getFormattedYear', function(date, options) {
  const year = date.getFullYear()
  return year
})

// TODO: get month
Handlebars.registerHelper('getFormattedMonth', function(date, options) {
  const month = date.getMonth() + 1
  return month
})

// TODO: get day Of Month
Handlebars.registerHelper('getFormattedDay', function(date, options) {
  const dayOfMonth = date.getDate()
  return dayOfMonth
})

// TODO: Month name in English

Handlebars.registerHelper('convertMonthName', function(date, options) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const monthName = monthNames[date.getMonth()]
  return monthName
})

// TODO: Day of Week name in English

Handlebars.registerHelper('convertDayOfWeekName', function(date, options) {
  const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayOfWeekName = dayOfWeekNames[date.getDay()]
  return dayOfWeekName
})

// TODO: convert date to dayOfMonth
Handlebars.registerHelper('convertDayOfMonth', function(date, options) {
  const dayOfMonth = date.getDate()
  return dayOfMonth
})

// TODO: Icon
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

// TODO: sign of amount

Handlebars.registerHelper('getSign', function(category, options) {
  return category === 'expense' ? `+` : `-`
})