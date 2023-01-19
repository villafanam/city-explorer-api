'use strict';

// **** REQUIRES ****
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

// *** FOR LAB DON'T FORGET TO REQUIRE YOUR STARTER JSON FILE ***
//let data = require('./data/weather.json');


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

app.get('/weather', async (req, res, next) => {
  try
  {
    // TODO: accept my queries
    let lat = req.query.lat;
    let lon = req.query.lon;

    // TODO: use those queries and build out an URL to hit the api
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

    let weatherData = await axios.get(url);
    //console.log(weatherData.data);

    // TODO: groom that data
    let groomData = weatherData.data.data.map(element => new Forcast(element));

    // TODO: send that to the front end
    res.status(200).send(groomData);
  }
  catch (error)
  {
    next(error);
  }
});

app.get('/movie', async (req, res, next) => {
  try {
    // TODO: accept my queries
    let cityName = req.query.cityName;

    // TODO: use those queries and build out an URL to hit the api
    let url =  `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;

    let movieData = await axios.get(url);
    console.log(movieData.data.results);

    // TODO: groom that data
    let groomData = movieData.data.results.map(element => new Movies(element));

    // TODO: send that to the front end
    res.status(200).send(groomData);

  } catch (error) {
    next(error);
  }
   
});

// **** CLASS TO GROOM BULKY DATA ****

class Movies
{
  constructor(movieObj)
  {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.image_url = 'https://image.tmdb.org/t/p/w500' + movieObj.poster_path;
    this.popularity = movieObj.popularity;
    this.released_on= movieObj.release_date;
  }
}

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
