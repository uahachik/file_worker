const express = require('express');
const csv = require('csvtojson');
const { parseAsync } = require('json2csv');

const validator = require('../../middleware/validator');
const Worker = require('../../models/Worker');

const router = express.Router();

// @rout   POST api/workers/upload
// @desc   Upload csv file and insert data to the DB
router.post('/upload', async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ errors: 'The file not found' });
  }

  const file = req.files.file;

  // check file extension
  const ext = file.name.split('.').pop();
  if (ext !== 'csv') {
    return res.status(400).json({ errors: 'only CSV extension file allowed' });
  }

  // get data from request body
  let workers = await csv().fromString(file.data.toString());

  // validate csv data if need
  let errors = [];
  workers.forEach((worker, i) => {
    const userError = validator(worker);
    if (userError) {
      const error = `${userError} on row ${i + 1}`;
      errors = [...errors, error];
    }
  });

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  // change csv file header fields to same as DB entities
  let handledWorkers = [];
  workers.forEach(worker => {
    const user_name = Object.keys(worker)[0];
    const first_name = Object.keys(worker)[1];
    const last_name = Object.keys(worker)[2];
    const age = Object.keys(worker)[3];

    let firstPair = { ['user_name']: worker[user_name] };
    let secondPair = { ['first_name']: worker[first_name] };
    let thirdPair = { ['last_name']: worker[last_name] };
    let fourthPair = { ['age']: worker[age] };
    if (
      'user_name' !== user_name ||
      'first_name' !== first_name ||
      'last_name' !== last_name ||
      'age' !== age
    ) {
      worker = {
        ...firstPair,
        ...secondPair,
        ...thirdPair,
        ...fourthPair
      };
    } else {
      worker;
    }

    handledWorkers.push(worker);
  });

  // process
  try {
    await Worker.insertMany(handledWorkers);
    res.json({ msg: 'data has put in the MongoDB successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @rout    GET api/workers/download
// @desc    Get all users from DB and download csv file to user
router.get('/download', async (req, res) => {
  let users = [];
  try {
    users = await Worker.find();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }

  // change csv header
  const fields = [
    {
      label: 'userName',
      value: 'user_name'
    },
    {
      label: 'firstName',
      value: 'first_name'
    },
    {
      label: 'lastName',
      value: 'last_name'
    },
    'age'
  ];

  // remove quotes
  const opts = { fields, quote: '' };

  // process
  parseAsync(users, opts)
    .then(csv => {
      res.attachment('dowloaded.csv');
      res
        .status(200)
        // .json({ msg: 'Success!' })
        .send(csv);
    })
    .catch(err => console.error(err));
});

module.exports = router;
