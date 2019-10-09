const Folder = require('./routes/folder')
const Project = require('./routes/project')
const User = require('./routes/user')
const Tag = require('./routes/tag')
const Search = require('./routes/search')
const Request = require('./routes/request')

const auth = require('./services/cognito')

module.exports = function (app) {
  app.get('/folder', auth, Folder.get)
  app.post('/folder', auth, Folder.post)
  app.patch('/folder/:_id', auth, Folder.patch)
  app.delete('/folder/:_id', auth, Folder.delete)

  app.get('/project', auth, Project.get)
  app.get('/project/:_id', Project.getSingle)
  app.post('/project', auth, Project.post)
  app.patch('/project/:_id', auth, Project.patch)
  app.delete('/project/:_id', auth, Project.delete)
  app.get('/projects/:ids', Project.getMany)

  app.get('/tag', auth, Tag.getAll)
  app.get('/tag/:ids', auth, Tag.get)
  app.post('/tag/:_id', auth, Tag.post)
  app.patch('/tag/:_id', auth, Tag.patch)

  app.get('/user', auth, User.get)
  app.get('/user/:cognitoId', auth, User.getSingle)
  app.post('/user', User.post)
  app.patch('/user/:_id', auth, User.patch)
  app.delete('/user/:_id', auth, User.delete)

  app.post('/search', Search.post)

  app.get('/request', auth, Request.get)
  app.post('/request', auth, Request.post)
  app.patch('/request/:_id', auth, Request.patch)
}