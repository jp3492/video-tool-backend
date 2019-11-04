const Request = require('../models/request')
const User = require('../models/user')

const get = async (req, res) => {
  try {
    const requests = await Request.find({ $or: [{ from: req.user }, { to: req.user }] })
    const userIds = requests.reduce((res, r) => res.includes(r.from === req.user ? r.to : r.from) ? res : [...res, r.from === req.user ? r.to : r.from], [])
    const user = await User.find({ _id: { $in: userIds } })
    const expandedRequests = requests.map(r => ({ ...r._doc, fromMe: r.from === req.user, userEmail: user.find(u => u._id === (r.from === req.user ? r.to : r.from)) }))
    res.status(200).send({ items: expandedRequests })
  } catch (error) {
    console.error(error)
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