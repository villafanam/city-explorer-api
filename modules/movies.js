'use strict';

const axios = require('axios');

let cache = {};

async function getMovies(req, res, next) {
  try {
    // TODO: accept my queries
    let cityName = req.query.cityName;

    // **** CREATE MY KEY *****
    let key = `${cityName}Movies`;

    if (cache[key] && (Date.now() - cache[key].timeStamp) < 50000) {
      console.log('Cache was hit, images are present');
      res.status(200).send(cache[key].data);
    }
    else {
      console.log('cache missed -- no Movies present');
      // TODO: use those queries and build out an URL to hit the api
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;

      let movieData = await axios.get(url);
      //console.log(movieData.data.results);

      // TODO: groom that data
      let groomData = movieData.data.results.map(element => new Movies(element));

      cache[key] = {
        data: groomData,
        timeStamp: Date.now()
      };

      // TODO: send that to the front end
      res.status(200).send(groomData);
    }

  } catch (error) {
    next(error);
  }
}

// **** CLASS TO GROOM BULKY DATA ****

class Movies {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.image_url = movieObj.poster_path;
    this.popularity = movieObj.popularity;
    this.released_on = movieObj.release_date;
  }
}

module.exports = getMovies;
