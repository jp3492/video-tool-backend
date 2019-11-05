const Tag = require('../models/tag');
const Project = require('../models/project');
const User = require('../models/user');

const deleteComment = async (req, res) => {
  try {
    const { tagId, commentId } = req.params;
    let thisTag = await Tag.findById(tagId);
    thisTag.comments.pull(commentId);
    await thisTag.save();
    res.status(200).send(thisTag);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

const patchComment = async (req, res) => {
  try {
    const { tagId, commentId } = req.params;
    const updatedTag = await Tag.findOneAndUpdate(
      {
        _id: tagId,
        'comments._id': commentId
      },
      {
        $set: {
          'comments.$.text': req.body.text
        }
      },
      {
        new: true
      }
    );
    res.status(200).send(updatedTag);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

const postComment = async (req, res) => {
  try {
    const { _id } = req.params;
    const { text } = req.body;
    const updatedTag = await Tag.findOneAndUpdate(
      {
        _id
      },
      {
        $push: {
          comments: {
            author: req.user,
            text
          }
        }
      },
      {
        new: true
      }
    );
    const commentUsers = updatedTag.comments.reduce((re, c) => {
      if (!re.includes(c.author)) {
        return [...re, c.author];
      } else {
        return re;
      }
    }, []);

    const users = await User.find({ _id: { $in: commentUsers } });
    const namesAdded = updatedTag.comments.map(c => {
      const user = users.find(u => String(u._id) === String(c.author));
      const name =
        user.information.firstName || user.information.lastName
          ? `${user.information.firstName}${
              user.information.firstName && user.information.lastName ? ',' : ''
            }${user.information.lastName}`
          : user.email;
      return {
        ...c._doc,
        name
      };
    });
    res.status(200).send({
      ...updatedTag._doc,
      comments: namesAdded
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

const getAll = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user });
    const links = projects.reduce((res, p) => {
      const newLinks = p.links.filter(l => !res.includes(l.url));
      return [...res, ...newLinks];
    }, []);
    const tagIds = projects.reduce((res, p) => {
      return [...res, ...p.tags];
    }, []);
    const tags = await Tag.find({ _id: { $in: tagIds } });
    res.status(200).send({
      items: tags.map(t => ({
        ...t._doc,
        videoName: links.find(l => l.url === t.url).label
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

const get = async (req, res) => {
  try {
    const { ids } = req.params;
    const projects = await Project.find({ _id: { $in: JSON.parse(ids) } });
    const projectTags = projects.reduce((res, p) => [...res, ...p.tags], []);
    const tags = await Tag.find({ _id: { $in: projectTags } });
    const commentUsers = tags.reduce((res, t) => {
      return [
        ...res,
        ...t.comments.reduce((re, c) => {
          if (!res.includes(c.author) && !re.includes(c.author)) {
            return [...re, c.author];
          } else {
            return re;
          }
        }, [])
      ];
    }, []);
    const users = await User.find({ _id: { $in: commentUsers } });
    const namesAdded = tags.map(t => ({
      ...t._doc,
      comments: t.comments.map(c => {
        const user = users.find(u => String(u._id) === String(c.author));
        const name =
          user.information.firstName || user.information.lastName
            ? `${user.information.firstName}${
                user.information.firstName && user.information.lastName
                  ? ','
                  : ''
              }${user.information.lastName}`
            : user.email;
        return {
          ...c._doc,
          name
        };
      })
    }));
    res.status(200).send({ items: namesAdded });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

const post = async (req, res) => {
  try {
    const { _id } = req.params;
    const newTag = new Tag({ ...req.body, author: req.user });
    await newTag.save();
    await Project.findOneAndUpdate({ _id }, { $push: { tags: newTag._id } });
    res.status(200).send(newTag);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

const patch = async (req, res) => {
  try {
    const { _id } = req.params;
    const updatedTag = await Tag.findOneAndUpdate(
      { _id },
      { ...req.body },
      { new: true }
    );
    res.status(200).send(updatedTag);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// const remove = async (req, res) => {
//   try {
//     const { projectId, tagIds }
//   } catch (error) {

//   }
// }

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
  patch,
  getAll,
  // delete: remove,
  postComment,
  patchComment,
  deleteComment
};
