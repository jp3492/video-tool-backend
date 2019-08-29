const Folder = require('./routes/folder')
const Project = require('./routes/project')
const User = require('./routes/user')

module.exports = function (app) {
  app.get('/folder', Folder.get)
  app.post('/folder', Folder.post)
  app.patch('/folder/:_id', Folder.patch)
  app.delete('/folder/:_id', Folder.delete)

  app.get('/project', Project.get)
  app.post('/project', Project.post)
  app.patch('/project/:_id', Project.patch)
  app.delete('/project/:_id', Project.delete)

  app.get('/user', User.get)
  app.get('/user/:_id', User.getSingle)
  app.post('/user', User.post)
  app.patch('/user/:_id', User.patch)
  app.delete('/user/:_id', User.delete)
}