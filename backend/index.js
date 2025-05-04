const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
