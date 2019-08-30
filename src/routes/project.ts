const Project = require('../models/project')

const get = async (req, res) => {
  try {
    const projects = await Project.find()
    res.status(200).send({ items: projects })
  } catch (error) {
    res.status(400).send(error)
  }
}

const getSingle = async (req, res) => {
  try {
    const project = await Project.findById(req.params._id)
    res.status(200).send(project)
  } catch (error) {
    res.status(400).send(error)
  }
}

const post = async (req, res) => {
  try {
    const newProject = new Project(req.body)
    await newProject.save()
    res.status(200).send(newProject)
  } catch (error) {
    res.status(400).send(error)
  }
}

const patch = async (req, res) => {
  const { _id } = req.params
  console.log(_id, req.body);

  try {
    const updatedProject = await Project.findOneAndUpdate({
      _id
    }, {
        ...req.body
      }, { new: true })
    res.status(200).send(updatedProject)
  } catch (error) {
    res.status(400).send(error)
  }
}

const remove = async (req, res) => {
  const { _id } = req.body
  try {
    await Project.remove({ _id })
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