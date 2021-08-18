'use strict'

const swaggerUi = require('swagger-ui-express')
const sqlite3 = require('sqlite3').verbose()
const express = require('express')
const helmet = require('helmet')

const buildSchemas = require('./src/schemas')
const swaggerDocS = require('./src/swagger.json')

const port = process.env.PORT || 8010

const db = new sqlite3.Database(':memory:')

db.serialize(() => {
  buildSchemas(db)

  const app = require('./src/app')(db)
  app.use(express.static(`${__dirname}/docs`))
  // Helmet helps you secure your Express apps by setting various HTTP headers.
  app.use(helmet())

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocS))

  app.listen(port, () => console.log(`App started and listening on port ${port}`))
})
