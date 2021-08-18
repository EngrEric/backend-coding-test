module.exports = db => {
  /**
   * @function createRide : is a function that creates rides
   * @param {Object} rideDetails the details of the ride to be created
   * @returns {Array}  An array containing the item created
   */
  const saveRide = rideDetails => {
    return new Promise((res, rej) => {
      db.run(
        'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
        rideDetails,
        function (err) {
          if (err) {
            rej(err)
          }

          db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
            if (err) {
              rej(err)
            }

            res(rows)
          })
        }
      )
    })
  }

  /**
   * @function getAll : Is a function  that gets rides using the provided information or use a fallback of 20 items per page
   * @param {Object} paginationInfo The required query params for the pagination
   * @returns {Array} array of rides or an error
   */
  const getAllRides = paginationInfo => {
    const lastID = paginationInfo.lastID || 0
    const limit = paginationInfo.limit || 20
    const query = 'SELECT * FROM Rides WHERE rideID > ? ORDER BY rideID LIMIT ?'

    return new Promise((resolve, reject) => {
      db.all(query, [lastID, limit], (error, rows) => {
        if (error) {
          reject(error)
        }

        resolve(rows)
      })
    })
  }

  /**
   * @function getRideById : Is a function that gets a ride by given ID
   * @param {number} rideID The ride id to be retrived
   */
  const getRideById = rideID => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM Rides WHERE rideID = ?`, rideID, function (err, rows) {
        if (err) {
          reject(err)
        }

        resolve(rows)
      })
    })
  }

  return {
    saveRide,
    getRideById,
    getAllRides
  }
}
