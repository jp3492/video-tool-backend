const User = require('../models/user')

const get = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).send({ items: users })
  } catch (error) {
    res.status(400).send(error)
  }
}

const getSingle = async (req, res) => {
  const { _id } = req.params
  try {
    const user = await User.findById(_id)
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
}

const post = async (req, res) => {
  try {
    const newUser = new User(req.body)
    await newUser.save()
    res.status(200).send(newUser)
  } catch (error) {
    res.status(400).send(error)
  }
}

const patch = async (req, res) => {
  const {
    _id,
    ...updatedProperties
  } = req.body
  try {
    const updatedUser = await User.findOneAndUpdate({
      _id
    }, {
        ...updatedProperties
      })
    res.status(200).send(updatedUser)
  } catch (error) {
    res.status(400).send(error)
  }
}

const remove = async (req, res) => {
  const { _id } = req.body
  try {
    await User.remove({ _id })
    res.status(200).send({ _id })
  } catch (error) {
    res.status(400).send(error)
  }
}

module.exports = {
  get,
  getSingle,
  post,
  patch,
  delete: remove,
}