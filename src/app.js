/**
 * The product exposes endpoints for booking rides and related operation
 * Get the swagger docs at /api-docs of the root url e.g http://localhost:8010/api-docs or https://backend-test-coding.herokuapp.com/api-docs
 * @module routes for the rides api
 */

'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const logger = require('../utils/logger')
const controllers = require('./controllers')

const jsonParser = bodyParser.json()
const app = express()

module.exports = db => {
  const { createRide, getRideById, getRides } = controllers(db)

  /**
   * Enpoint for health check "/health"
   *
   */
  app.get('/health', (req, res) => {
    logger.info('Pinged the health api', [{ message: 'Healthy', data: { active: true } }])
    res.send({ message: 'Healthy', data: { active: true } })
  })

  /**
   * Enpoint for creating rides
   */
  app.post('/rides', jsonParser, createRide)

  /**
   * Enpoint to get rides
   */
  app.get('/rides', getRides)

  /**
   * Enpoint to get rides by id
   */
  app.get('/rides/:id', getRideById)

  return app
}
