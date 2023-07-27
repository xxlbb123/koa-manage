const jwt = require('jsonwebtoken')

const secret = '123456789poiuytrewqlkjhgfdsa'
const tokenHandler = {}

tokenHandler.createToken = (info) => {
  const token = jwt.sign(info, secret, {
    expiresIn: 60 * 60 * 24 * 3
  })
  return token
}

tokenHandler.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = tokenHandler
