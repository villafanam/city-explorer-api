'use strict';

// **** REQUIRES ****
const express = require('express');
require('dotenv').config();
const cors = require('cors');

// *** FOR LAB DON'T FORGET TO REQUIRE YOUR STARTER JSON FILE ***
let data = require('./data/weather.json');


// **** Once express is in we need to use it - per express docs
// *** app === server
const app = express();

// **** MIDDLEWARE ****
// *** cors is middleware - security guard that allows us to share resources across the internet **
app.use(cors());

// *** DEFINE A PORT FOR MY SERVER TO RUN ON ***
const PORT = process.env.PORT || 3002;


// **** ENDPOINTS ****

// *** Base endpoint - proof of life
// ** 1st arg - endpoint in quotes
// ** 2nd arg - callback which will execute when someone hits that point

// *** Callback function - 2 parameters: request, response (req,res)

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});

app.get('/weather', (req,res,next)=>{
  try
  {
    // let lat = req.query.lat;
    // let lon = req.query.lon;
    let searchQuery = req.query.searchQuery;
    //let dataToGroom = data.find(element => element.lat === lat && element.lon === lon && element.city_name === searchQuery);
    let dataToGroom = data.find(element => element.city_name.toUpperCase() === searchQuery.toUpperCase());
    let dataToSend = dataToGroom.data.map(element => new Forcast(element));

    res.status(200).send(dataToSend);
  }
  catch (error)
  {
    next(error);
  }
});

// **** CLASS TO GROOM BULKY DATA ****

class Forcast
{
  constructor(obj)
  {
    this.date = obj.datetime;
    this.description = obj.weather.description;
  }
}

// **** CATCH ALL ENDPOINT - NEEDS TO BE YOUR LAST DEFINED ENDPOINT ****
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist');
});


// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});


// ***** SERVER START ******
app.listen(PORT, () => console.log(`We are running on port: ${PORT}`));
