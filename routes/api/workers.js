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
  const workers = await csv().fromString(file.data.toString());

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

  // change object keys to same as DB entities
  workers.map(worker => {
    delete Object.assign(worker, { ['user_name']: worker['userName'] })[
      'userName'
    ];
    delete Object.assign(worker, { ['first_name']: worker['firstName'] })[
      'firstName'
    ];
    delete Object.assign(worker, { ['last_name']: worker['lastName'] })[
      'lastName'
    ];
  });

  // process
  try {
    await Worker.insertMany(workers);
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
