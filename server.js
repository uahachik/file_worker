const express = require('express');
const connectDB = require('./config/db');

const fileUpload = require('express-fileupload');

const app = express();

//Connect Database
connectDB();

// enable files upload
app.use(
  fileUpload(
    { createParentPath: true },
    { limits: { fileSize: 50 * 1024 * 1024 } }
  )
);

// Define Routes
app.use('/api/workers', require('./routes/api/workers'));
app.use('/api/users', require('./routes/api/users'));

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
