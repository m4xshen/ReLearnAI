const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/auth', userRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
