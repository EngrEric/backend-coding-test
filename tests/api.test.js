'use strict'

const request = require('supertest')
const assert = require('assert')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const app = require('../src/app')(db)
const buildSchemas = require('../src/schemas')

describe('API tests', () => {
  before(done => {
    db.serialize(err => {
      if (err) {
        return done(err)
      }

      buildSchemas(db)

      done()
    })
  })

  describe('GET /health', () => {
    it('should return an object with data and message', done => {
      request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.message, 'Healthy')
          assert.strictEqual(response.body.data.active, true)
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /rides', () => {
    it('should create new rides with given information', done => {
      request(app)
        .post('/rides')
        .set('Content-Type', 'application/json')
        .send({
          start_lat: 80,
          start_long: 80,
          end_lat: 60,
          end_long: 80,
          rider_name: 'eric',
          driver_name: 'okemmadu',
          driver_vehicle: 'veosd'
        })
        .expect(200)
        .then(response => {
          assert(response.body.data.length == 1)
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /rides', () => {
    it('should return validation error if start latitude and longitude is not between -90 - 90 and -180 to 180 degrees respectively', done => {
      request(app)
        .post('/rides')
        .set('Content-Type', 'application/json')
        .send({
          start_lat: 120,
          start_long: 120,
          end_lat: 80,
          end_long: 80,
          rider_name: 'eric',
          driver_name: 'okemmadu',
          driver_vehicle: 'veosd'
        })
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.error_code, 'VALIDATION_ERROR')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /rides', () => {
    it('should return validation error if end latitude and longitude is not between -90 - 90 and -180 to 180 degrees respectivel', done => {
      request(app)
        .post('/rides')
        .set('Content-Type', 'application/json')
        .send({
          start_lat: 60,
          start_long: 60,
          end_lat: 200,
          end_long: 200,
          rider_name: 'eric',
          driver_name: 'okemmadu',
          driver_vehicle: 'veosd'
        })
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.error_code, 'VALIDATION_ERROR')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /rides', () => {
    it('should return validation error if rider name is empty string', done => {
      request(app)
        .post('/rides')
        .set('Content-Type', 'application/json')
        .send({
          start_lat: 60,
          start_long: 60,
          end_lat: 80,
          end_long: 80,
          rider_name: '',
          driver_name: 'okemmadu',
          driver_vehicle: 'veosd'
        })
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.error_code, 'VALIDATION_ERROR')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /rides', () => {
    it('should return validation error if driver name is empty string', done => {
      request(app)
        .post('/rides')
        .set('Content-Type', 'application/json')
        .send({
          start_lat: 60,
          start_long: 60,
          end_lat: 80,
          end_long: 80,
          rider_name: 'eric',
          driver_name: '',
          driver_vehicle: 'veosd'
        })
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.error_code, 'VALIDATION_ERROR')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /rides', () => {
    it('should return validation error if driver vehicle is empty string', done => {
      request(app)
        .post('/rides')
        .set('Content-Type', 'application/json')
        .send({
          start_lat: 60,
          start_long: 60,
          end_lat: 80,
          end_long: 80,
          rider_name: 'eric',
          driver_name: 'okemmadu',
          driver_vehicle: ''
        })
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.error_code, 'VALIDATION_ERROR')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('GET /rides', () => {
    it('should return an array of rides based on paginated values', done => {
      request(app)
        .get('/rides')
        .query({ lastID: 0, limit: 1 })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert(response.body.data.items.length <= 1)
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('GET /rides', () => {
    it('should not return server error if query valaues are not provided', done => {
      request(app)
        .get('/rides')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert(response.body.data.items.length >= 1)
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('GET /rides/1', () => {
    it('should return one item with the given id', done => {
      request(app)
        .get('/rides/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert(Object.keys(response.body.data).includes('driverName'))
          done()
        })
        .catch(err => done(err))
    })
  }),
    describe('should return not found error given that the ride is not found', done => {
      request(app)
        .get(`/rides/1000`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.error_code, 'RIDES_NOT_FOUND_ERROR')
          done()
        })
        .catch(err => done(err))
    })
})
