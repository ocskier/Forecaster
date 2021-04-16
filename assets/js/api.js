// let iconUrl = 'https://api.iconfinder.com/v3/icons/search?';
// iconUrl += 'client_id=mXK8DHYcamId9eZ9lMHRipV2zSMQdn3oPi1GkmT12Pq4FmKtTPiNqfmIxsgNb93W&';
// iconUrl += 'client_secret=gV3NcGeUtZlQIpY1peUeGNUJy70dJaojzJ66TBnBiEahY5pPR8xaDiluftnR19Mt&';
// iconUrl += 'count=1&premium=0&query=';

function buildUrl(baseUrl, extendedUrl) {
  return baseUrl + extendedUrl;
}

class OWAPI {
  constructor() {
    this.searchUrl =
      'https://api.openweathermap.org/data/2.5/weather?APPID=833a5451ef3423413fe6e789b8687cf3&units=imperial';
    this.forecastUrl =
      'https://api.openweathermap.org/data/2.5/onecall?APPID=833a5451ef3423413fe6e789b8687cf3&units=imperial&exclude=hourly,minutely';
  }
  getWeather = (searchTerm) =>
    $.get(buildUrl(this.searchUrl, `&q=${searchTerm}`));
  getForecast = (lat, lon) =>
    $.get(buildUrl(this.forecastUrl, `&lat=${lat}&lon=${lon}`));
  runSearch = (city) => {
    const search = async () => {
      try {
        const weatherData = await this.getWeather(city);

        const forecastData = await this.getForecast(
          weatherData.coord.lat,
          weatherData.coord.lon
        );
        return { weatherData, forecastData };
      } catch (err) {
        console.log(err);
      }
    };
    return search();
  };
}
