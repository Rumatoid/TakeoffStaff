const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get Contacts
router.get('/:id', async (req, res) => {
  try {
    const contacts = await loadContactsCollection();
    await contacts
      .find({
        user_id: req.params.id,
      })
      .toArray(function (err, user_contacts) {
        if (err) res.status(409).send();

        res.status(200).send(user_contacts);
      });
  } catch (err) {
    if (err) res.status(409).send();
  }
});

router.post('/create', async (req, res) => {
  try {
    const contacts = await loadContactsCollection();

    let db_res = {};
    db_res = await contacts.insertOne({
      user_id: req.body._id,
      name: req.body.name,
      phone: req.body.phone,
    });

    res.status(201).send(db_res.ops[0]);
  } catch (err) {
    res.status(409).send();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const contacts = await loadContactsCollection();
    await contacts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });

    res.status(200).send();
  } catch (err) {
    res.status(409).send();
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    const contacts = await loadContactsCollection();

    await contacts.update(
      { _id: new mongodb.ObjectID(req.params.id) },
      { $set: { name: req.body.name, phone: req.body.phone } }
    );
    res.status(200).send();
  } catch (err) {
    res.status(409).send();
  }
});

async function loadContactsCollection() {
  const client = await mongodb.MongoClient.connect(
    'mongodb+srv://Rumatoid:13524313aA@cluster0.vhgwg.mongodb.net/Cluster0?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
    }
  );

  return client.db('Cluster0').collection('contacts');
}

module.exports = router;
