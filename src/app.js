'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const logger = require('../utils/logger')
const { createRide, getRideById, getRides } = require('./controllers')

const jsonParser = bodyParser.json()
const app = express()

module.exports = db => {
  app.get('/health', (req, res) => {
    logger.info('Pinged the health api', [{ message: 'Healthy', data: { active: true } }])
    res.send({ message: 'Healthy', data: { active: true } })
  })

  app.post('/rides', jsonParser, (req, res) => createRide(req, res, db))

  app.get('/rides', (req, res) => getRides(req, res, db))

  app.get('/rides/:id', (req, res) => getRideById(req, res, db))

  return app
}
