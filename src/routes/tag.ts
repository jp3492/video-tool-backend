const Tag = require('../models/tag')
const Project = require('../models/project')

const get = async (req, res) => {
  try {
    const { _id } = req.params
    const project = await Project.findById(_id)
    const projectTags = project.tags
    const tags = await Tag.find({ _id: { $in: projectTags } })
    res.status(200).send({ items: tags })
  } catch (error) {
    res.status(400).send(error)
  }
}

const post = async (req, res) => {
  try {
    const { _id } = req.params
    const newTag = new Tag(req.body)
    await newTag.save()
    await Project.findOneAndUpdate({ _id }, { $push: { tags: newTag._id } })
    res.status(200).send(newTag)
  } catch (error) {
    res.status(400).send(error)
  }
}

// const patch = async (req, res) => {
//   const { _id } = req.params
//   try {
//     const updatedFolder = await Folder.findOneAndUpdate({
//       _id
//     }, {
//         ...req.body
//       })
//     res.status(200).send(updatedFolder)
//   } catch (error) {
//     res.status(400).send(error)
//   }
// }

// const remove = async (req, res) => {
//   const { _id } = req.body
//   try {
//     await Folder.remove({ _id })
//     res.status(200).send({ _id })
//   } catch (error) {
//     res.status(400).send(error)
//   }
// }

module.exports = {
  get,
  post,
  // patch,
  // delete: remove,
}