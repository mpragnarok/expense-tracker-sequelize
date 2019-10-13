const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
// import express-validator setting
const validation = require('../validator')
const { validationResult } = require('express-validator')


// show login page
router.get('/login', async (req, res) => {
  try {
    res.render('login', { message: req.flash('error') })
  } catch (e) {
    res.status(500).send(e)
  }
})

// login authentication
router.post('/login', async (req, res, next) => {
  try {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      badRequestMessage: 'The email does not match any account',
      failureFlash: true
    })(req, res, next)
  } catch (e) {
    res.status(400).send(e)
  }
})
// show register page
router.get('/register', async (req, res) => {

  try {

    res.render('register')
  } catch (e) {
    res.status(500).send(e)
  }
})


// register authentication
router.post('/register', validation.registerUser, async (req, res) => {
  const { name, email, password, password2 } = req.body
  const errorsMessage = validationResult(req)
  try {
    // query validator errors messages
    if (!errorsMessage.isEmpty()) {
      return res.render('register', {
        warning: errorsMessage.array(),
        name,
        email,
        password,
        password2
      })
    }

    let errors = []
    if (!email || !password || !password2) {
      errors.push({ message: 'All fields are required' })
    }

    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      })
    } else {
      const user = await User.findOne({ where: { email } })
      // user already exists 
      if (user) {
        errors.push({ message: 'This Email is already registered' })
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        })
      } else {
        const hash = await bcrypt.hash(password, 8)
        // Add new user if user not exists
        const newUser =
          await User.create({
            name,
            email,
            password: hash
          })
        await newUser.save()
        res.redirect('/', {
          email
        })
      }
    }

  } catch (e) {
    res.status(400).send(e)
  }
})

// logout
router.get('/logout', async (req, res) => {
  try {
    req.logout()
    req.flash('success_msg', 'Logout successfully')
    res.redirect('/users/login')
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router