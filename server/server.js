const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('./schemas');
const port = process.env.PORT;

const routineRouter = require('./routes/routine')


app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use('/routine', routineRouter)

console.log(process.env.PORT)