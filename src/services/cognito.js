const Verifier = require('verify-cognito-token')

const User = require('../models/user')

const cognitoPool = "eu-central-1_dIWJ035GS"

const params = {
  region: 'eu-central-1',
  userPoolId: cognitoPool
}

const verifier = new Verifier(params);

module.exports = async (req, res, next) => {
  const { authorization, identity } = req.headers

  let verified
  try {
    verified = await verifier.verify(authorization)
  } catch (error) {
    console.error(error)
    res.status(400)
    return res.send({
      message: 'Couldnt verify accesstoken',
      error
    })
  }
  if (!verified) {
    console.error("not authorized")
    res.status(401)
    return res.send({ message: "You shall not pass - 'Gandalf'(long time ago)" })
  } else {
    try {
      const user = await User.findOne({ cognitoId: identity })
      req.user = user._id
      next()
    } catch (error) {
      res.status(404)
      res.send({
        error,
        message: "User not found in database"
      })
    }
  }
}