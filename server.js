const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

// allow cross-origin
app.use(cors());

// enable files upload
app.use(
  fileUpload(
    { createParentPath: true },
    { limits: { fileSize: 50 * 1024 * 1024 } }
  )
);

// Define Routes
app.use('/api/workers', require('./routes/api/workers'));

const pid = process.pid;

const PORT = process.env.PORT || 9000;

let count = 0;

// Emit message from workers
process.on('message', msg => {
  const count = msg.count;
  const { id } = msg;
  // eslint-disable-next-line no-console
  console.log(`Worker number ${id}! We have ${count} counts in cluster`);
});

app
  .get('/', async (req, res) => {
    res.write(`Handled by process ${pid}\n`);
    res.end(`Users: ${count}`);
  })
  .listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Started process ${pid} on port ${PORT}`);
  });

// // test of restarting process
// setTimeout(() => {
//   process.exit(1);
// }, Math.random() * 60000);
