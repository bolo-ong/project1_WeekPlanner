require('dotenv').config();
const port = process.env.PORT;
const dbUrl = process.env.DB_URL;
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const mongoose = require('mongoose');
const path = require('path');


mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("MongoDB Connected!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://weekplanner.kro.kr',
        'http://www.weekplanner.kro.kr',
        'https://weekplanner-394708.du.r.appspot.com'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);


app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});