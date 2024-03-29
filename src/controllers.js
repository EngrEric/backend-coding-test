const logger = require('../utils/logger')
const containers = require('./containers')

module.exports = db => {
  const { getAllRides, getRideById: rideById, saveRide } = containers(db)

  /**
   * @function createRide Saves rides in the db
   * @param {*} req http request object
   * @param {*} res http response object
   */
  const createRide = async (req, res) => {
    const startLatitude = Number(req.body.start_lat)
    const startLongitude = Number(req.body.start_long)
    const endLatitude = Number(req.body.end_lat)
    const endLongitude = Number(req.body.end_long)
    const riderName = req.body.rider_name
    const driverName = req.body.driver_name
    const driverVehicle = req.body.driver_vehicle

    if (
      startLatitude < -90 ||
      startLatitude > 90 ||
      startLongitude < -180 ||
      startLongitude > 180
    ) {
      logger.error(
        'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      )
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message:
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      })
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
      logger.error(
        'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      )
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message:
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      })
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      logger.error('Rider name must be a non empty string')
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string'
      })
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      logger.error('Driver name must be a non empty string')
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Driver name must be a non empty string'
      })
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      logger.error('Driver vehicle name must be a non empty string')
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Driver vehicle name must be a non empty string'
      })
    }

    const values = [
      req.body.start_lat,
      req.body.start_long,
      req.body.end_lat,
      req.body.end_long,
      req.body.rider_name,
      req.body.driver_name,
      req.body.driver_vehicle
    ]

    try {
      const rows = await saveRide(values)

      res.status(200).send({ data: rows, message: 'Added a ride successfully' })
    } catch (error) {
      logger.error('SERVER_ERROR', [error])
      return res.send({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error'
      })
    }
  }

  /**
   * @function getRides Gets the list of paginated rides
   * @param {*} req http request object
   * @param {*} res http response object
   */
  const getRides = async (req, res) => {
    try {
      const rows = await getAllRides(req.query)
      if (rows.length === 0) {
        logger.error('Could not find any rides')
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides'
        })
      }

      res.send({
        data: { items: rows },
        message: 'Successfully retrives all rides'
      })
    } catch (error) {
      logger.error('SERVER_ERROR', [error])
      return res.status(500).send({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error'
      })
    }
  }

  /**
   * @function getRideById Given an ID, this function gets the requested ride
   * @param {*} req http request object
   * @param {*} res http response object
   */
  const getRideById = async (req, res) => {
    try {
      const rows = await rideById(req.params.id)
      if (rows.length === 0) {
        logger.error('Could not find any rides')
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides'
        })
      }

      res.send({ message: 'Succesfully retrived', data: rows[0] })
    } catch (error) {
      logger.error('SERVER_ERROR', [error])
      return res.send({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error'
      })
    }
  }

  return { createRide, getRideById, getRides }
}
