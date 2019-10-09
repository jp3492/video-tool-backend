// const Folder = require('../models/folder')
const Project = require('../models/project')
const Tag = require('../models/tag')
const User = require('../models/user')

const targets = async (option, search) => {
  switch (option) {
    case "user": return await User.find({ email: { $regex: search, $options: 'i' } })
    case "project": return await Project.find({ label: { $regex: search, $options: 'i' } })
    case "tag": return await Tag.find({ text: { $regex: search, $options: 'i' } })
    default: return []
  }
}

const post = async (req, res) => {
  try {
    const { search, options } = req.body
    const activeOptions = Object.keys(options).reduce((res, o) => options[o] ? [...res, o] : res, [])
    let result = {}
    for (let index = 0; index < activeOptions.length; index++) {
      const optionResult = await targets(activeOptions[index], search)
      if (optionResult.length !== 0) {
        result = {
          ...result,
          [activeOptions[index]]: optionResult
        }
      }
    }
    res.status(200)
    res.send(result)
  } catch (error) {
    console.error(error)
    res.status(400)
    res.send(error)
  }
}

module.exports = {
  post
}