const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// SignUp (return user id or 409 status)
router.post('/signup', async (req, res) => {
  const users = await loadUsersCollection();
  const user = await users.findOne({ login: req.body.login });
  let db_res = {};
  if (user == null) {
    db_res = await users.insertOne({
      login: req.body.login,
      password: req.body.password,
    });
  } else {
    res.status(409).send();
  }
  res.status(201).send(db_res.ops[0]._id);
});

// SignIn (return user id or 404 status)
router.post('/signin', async (req, res) => {
  const users = await loadUsersCollection();
  const user = await users.findOne({ login: req.body.login });
  if (user != null) {
    res.status(200).send(user._id);
  } else {
    res.status(404).send();
  }
});

// Delete Post
router.delete('/:id', async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send({});
});

async function loadUsersCollection() {
  const client = await mongodb.MongoClient.connect(
    'mongodb+srv://Rumatoid:13524313aA@cluster0.vhgwg.mongodb.net/Cluster0?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
    }
  );

  return client.db('Cluster0').collection('users');
}

module.exports = router;
