let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/afspraken', () => console.log("DB Connected"));

const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');

//Middleware//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

//Import Routes//
const afsprakenRoute = require('./routes/afsprakenRoute');
const afspraakRoute = require('./routes/afspraakRoute'); 

app.use('/api/afspraken', afsprakenRoute);
app.use('/api/afspraak', afspraakRoute);

//Routes//
app.get('/', (req, res) => {
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send("{ \"message\": \"Hello World!\" }");
});

app.use('/', async (req, res, next) => {
    res.status(405).send();
});

//start de app//
app.listen(port, () => {
    console.log(`App started`)
});