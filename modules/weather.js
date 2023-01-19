'use strict';

const axios = require('axios');

let weatherImg = (weather) => {
  console.log(`weather code: ${weather.weather.code}`)
  if(weather.weather.code >= 300 && weather.weather.code <= 522)
  {
    return 'https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3-day.svg';
  }
  else if(weather.weather.code >= 200 && weather.weather.code <= 233)
  {
    return 'https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/scattered-thunderstorms-day.svg';
  }
  else if(weather.weather.code >= 600 && weather.weather.code <= 623)
  {
    return 'https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-3.svg';
  }
  else if(weather.weather.code >= 700 && weather.weather.code <= 751)
  {
    return 'https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/fog.svg';
  }
  else if(weather.weather.code === 800)
  {
    return 'https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-day.svg';
  }
  else if(weather.weather.code >= 801 && weather.weather.code <= 900)
  {
    return 'https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy.svg';
  }
  else
  {
    return 'https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-night.svg';
  }
};

async function getWeather (req, res, next)
{
  try
  {
    // TODO: accept my queries
    let lat = req.query.lat;
    let lon = req.query.lon;

    // TODO: use those queries and build out an URL to hit the api
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

    let weatherData = await axios.get(url);
    console.log(weatherData.data);

    // TODO: groom that data
    let groomData = weatherData.data.data.map(element => new Forcast(element,weatherImg(element)));

    // TODO: send that to the front end
    res.status(200).send(groomData);
  }
  catch (error)
  {
    next(error);
  }
}

class Forcast
{
  constructor(obj,imgURL)
  {
    this.date = obj.datetime;
    this.description = obj.weather.description;
    this.weatherImg = imgURL;
  }
}

module.exports = getWeather;
