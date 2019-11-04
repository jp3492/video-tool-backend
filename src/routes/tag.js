const Tag = require('../models/tag');
const Project = require('../models/project');

const deleteComment = async (req, res) => {
  try {
    const { tagId, commentId } = req.params;
    console.log(req.params);
    const tagBefore = await Tag.findById(tagId);
    console.log(tagBefore);
    const updatedTag = await Tag.findOneAndUpdate(
      {
        _id: tagId
      },
      {
        comments: {
          $pull: {
            _id: commentId
          }
        }
      },
      {
        new: true
      }
    );
    console.log(updatedTag);
    res.status(200).send(updatedTag);
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
    res.status(200).send(updatedTag);
  } catch (error) {}
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
    res.status(200).send({ items: tags });
  } catch (error) {
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
