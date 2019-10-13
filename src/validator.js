const { query, body } = require('express-validator')
// TODO: WHy I got empty result after using validation.queryValidator?
module.exports = {
  queryValidator: [
    query('monthYear')
    .isString().withMessage('Only can be MM-YYYY.')
    .isLength({ max: 7 }).withMessage('Only can be MM-YYYY.'),
    query('subCategoryNum')
    .isInt({ min: 0, max: 9 }).withMessage('Numbers are between 0 to 9.'),
    query('subCategory')
    .trim()
    .isString().withMessage('Only letters and digits allowed in subCategory.')
  ],
  // TODO: check validator is completed or not
  validRecord: [
    // amount should be in numeric format
    body('amount')
    .isNumeric()
    .withMessage('Please provide numbers.'),
    // merchant only can be string format
    body('merchant')
    .isString()
    .withMessage('Merchant only can be string format.')
  ],
  registerUser: [
    body('name')
    .isLength({ min: 1, max: 15 })
    .withMessage('Maximum length of name 15 is characters.'),
    body('email')
    .isEmail()
    .withMessage('Is not a valid email'),
    body('password')
    .isLength({ min: 6, max: 15 })
    .withMessage('The length of password needs to be 6 ~ 15 characters.')
    .custom((value, { req }) => {
      if (value === req.body.name) {
        throw new Error('Password must be different from name.')
      }
      return true
    })
    .isAlphanumeric()
    .withMessage('Password must contains number or letter.'),
    body('password2')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password')
      }
      return true
    })
  ]
}