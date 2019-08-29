const Folder = require('../models/folder')

const get = async (req, res) => {
  try {
    const folders = await Folder.find()
    res.status(200).send({ items: folders })
  } catch (error) {
    res.status(400).send(error)
  }
}

const post = async (req, res) => {
  try {
    const newFolder = new Folder(req.body)
    await newFolder.save()
    res.status(200).send(newFolder)
  } catch (error) {
    res.status(400).send(error)
  }
}

const patch = async (req, res) => {
  const { _id } = req.params
  try {
    const updatedFolder = await Folder.findOneAndUpdate({
      _id
    }, {
        ...req.body
      })
    res.status(200).send(updatedFolder)
  } catch (error) {
    res.status(400).send(error)
  }
}

const remove = async (req, res) => {
  const { _id } = req.body
  try {
    await Folder.remove({ _id })
    res.status(200).send({ _id })
  } catch (error) {
    res.status(400).send(error)
  }
}

module.exports = {
  get,
  post,
  patch,
  delete: remove,
}