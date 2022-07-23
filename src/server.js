require('dotenv').config();
const db = require('./config/database')

const express = require('express');
const cors = require('cors')
const app = express();
const router = require('./routes/index')

app.use(cors());
app.use(express.json())
app.use('/', router)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
