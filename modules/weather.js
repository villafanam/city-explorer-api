'use strict';

const axios = require('axios');

// let cache = require('./cache.js');
let cache = {};


async function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${latitude}&lon=${longitude}&days=5`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = await axios.get(url)
      .then(response => parseWeather(response.data));
  }

  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day, weatherImg(day));
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

let weatherImg = (weather) => {
  //console.log(`weather code: ${weather.weather.code}`);
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

class Weather {
  constructor(day,imgURL) {
    this.description = day.weather.description;
    this.date = day.datetime;
    this.weatherImg = imgURL;
  }
}

module.exports = getWeather;
