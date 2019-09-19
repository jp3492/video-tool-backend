const Project = require('../models/project')
const Tag = require('../models/tag')

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

const getMany = async (req, res) => {
  try {
    const projects = await Project.find({ _id: { $in: JSON.parse(req.params.ids) } })
    res.status(200).send({ items: projects })
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
  // get project
  //  get according tags
  // filter tags
  // update project 
  try {
    const links = req.body.links.map(l => l.url)
    console.log(links);

    const tags = await Tag.find({ _id: { $in: req.body.tags } })
    console.log(tags);

    const filteredTags = tags.filter(({ url }) => links.includes(url))
    console.log(filteredTags);

    const updatedProject = await Project.findOneAndUpdate({
      _id
    }, {
      ...req.body,
      tags: filteredTags.map(({ _id }) => _id)
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
  getMany
}