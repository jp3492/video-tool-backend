const Request = require('../models/request')

const get = async (req, res) => {
  try {
    const requests = await Request.find({ $or: [{ from: req.user }, { to: req.user }] })
    res.status(200).send({ items: requests })
  } catch (error) {
    res.status(400).send(error)
  }
}

const post = async (req, res) => {
  try {
    const newRequest = new Request({ ...req.body, from: req.user })
    await newRequest.save()
    res.status(200).send(newRequest)
  } catch (error) {
    res.status(400).send(error)
  }
}

const patch = async (req, res) => {
  const { accepted } = req.body
  const { _id } = req.params
  try {
    if (accepted) {
      const request = await Request.findOneAndUpdate({ _id }, { status: accepted ? "ACCEPTED" : "REJECTED" }, { new: true })
      await User.findOneAndUpate({ _id: request.from }, { $push: { connections: request.to } })
      await User.findOneAndUpate({ _id: request.to }, { $push: { connections: request.from } })
      res.status(200).send(request)
    } else {
      await Request.remove({ _id })
      res.status(200)
      res.send("Request denied")
    }
  } catch (error) {
    res.status(400).send(error)
  }
}

const remove = async (req, res) => {
  const { _id } = req.body
  try {
    await Request.remove({ _id })
    res.status(200).send({ _id })
  } catch (error) {
    res.status(400).send(error)
  }
}

module.exports = {
  get,
  post,
  patch,
  delete: remove
}