const Folder = require('./routes/folder')
const Project = require('./routes/project')
const User = require('./routes/user')
const Tag = require('./routes/tag')

module.exports = function (app) {
  app.get('/folder', Folder.get)
  app.post('/folder', Folder.post)
  app.patch('/folder/:_id', Folder.patch)
  app.delete('/folder/:_id', Folder.delete)

  app.get('/project', Project.get)
  app.get('/project/:_id', Project.getSingle)
  app.post('/project', Project.post)
  app.patch('/project/:_id', Project.patch)
  app.delete('/project/:_id', Project.delete)

  app.get('/tag/:_id', Tag.get)
  app.post('/tag/:_id', Tag.post)

  app.get('/user', User.get)
  app.get('/user/:_id', User.getSingle)
  app.post('/user', User.post)
  app.patch('/user/:_id', User.patch)
  app.delete('/user/:_id', User.delete)
}