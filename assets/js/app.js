// let iconUrl = 'https://api.iconfinder.com/v3/icons/search?';
// iconUrl += 'client_id=mXK8DHYcamId9eZ9lMHRipV2zSMQdn3oPi1GkmT12Pq4FmKtTPiNqfmIxsgNb93W&';
// iconUrl += 'client_secret=gV3NcGeUtZlQIpY1peUeGNUJy70dJaojzJ66TBnBiEahY5pPR8xaDiluftnR19Mt&';
// iconUrl += 'count=1&premium=0&query=';

function buildUrl(baseUrl, extendedUrl) {
  return baseUrl + extendedUrl;
}

class OWAPI {
  constructor() {
    this.searchUrl = 'https://api.openweathermap.org/data/2.5/weather?APPID=833a5451ef3423413fe6e789b8687cf3&units=imperial';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/onecall?APPID=833a5451ef3423413fe6e789b8687cf3&units=imperial&exclude=hourly,minutely';
  }
  getWeather = (searchTerm) => $.get(buildUrl(this.searchUrl, `&q=${searchTerm}`));
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
class Screen {
  constructor() {
    this.searchedList = JSON.parse(localStorage.getItem('searchedList')) || [];
    this.lastSearch = localStorage.getItem('lastSearch') || 'Raleigh';
    this.searchEl = $('#searchIcon');
    this.form = $('form');
    this.cityInputEl = $('input');
    this.cityCollectionEl = $('.collection');
    this.weatherDetailsEl = $('#weatherDetails');
  }
  getInputCity = (e) => {
    e.preventDefault();
    const lastSearch = this.cityInputEl.val().trim();
    this.cityInputEl.val('');
    return lastSearch;
  };
  hideSearch = () => {
    this.form.attr(
      'style',
      `visibility: ${
        this.form.css('visibility') === 'visible' ? 'hidden' : 'visible'
      }`
    );
  };
  setLastSearch = (city) => {
    this.lastSearch = city;
  };
  clearWeather = () => {
    // for (el in ['h2', '#weatherDesc']) {
    //   $(el).text('');
    // }
    this.weatherDetailsEl.empty();
    $('#currentIcon img').remove();
  };
  printSearchedCities = () => {
    this.cityCollectionEl.empty();
    this.cityCollectionEl.attr('style', 'visibility: visible');
    this.searchedList.forEach((city) => {
      this.cityCollectionEl.append(
        `<li class="collection-item searchListItem">${city.toUpperCase()}</li>`
      );
    });
  };
  printTodaysForecast = (data) => {
    $('h2').text(data.name.toUpperCase());
    let imgHTML = `<img width=300 height=200 src=${
      iconData[data.weather[0].main.toLowerCase()].day
    } alt="Current Icon">`;
    $('#currentIcon').append(imgHTML);
    $('#weatherDesc').text(
      data.weather[0].description[0].toUpperCase() +
        data.weather[0].description.slice(1)
    );
    $('#weatherDetails').append(
      `<span style="font-size:3.2rem;padding-bottom:12px">${Math.round(
        data.main.temp_max
      )}°F</span>
      <div style="display: flex;flex-direction: column;justify-content: space-around;">
      <span>Wind Chill: ${Math.round(data.main.feels_like)}°F</span>
      <span>Wind: ${Math.floor(data.wind.speed)} mph</span>
      <span>Humidity: ${data.main.humidity}%</span>
      </div>`
    );
    $('#todaysForecast').attr('style', 'visibility: visible');
  };
  printExtendedForecast = (data) => {
    $('#extendedForecast').empty();

    const filteredForecastList = data.daily;
    $('#weatherDetails')
      .find('div')
      .append(`<span>UV Index: ${filteredForecastList[0].uvi}</span>`);
    let col1 = $('<div class="col s12 l1"></div>');
    $('#extendedForecast').append(col1);

    for (let i = 1; i < 6; i++) {
      let middleCol = $('<div></div>');
      let cardRow = $('<div></div>');
      let cardCol = $('<div></div>');
      let card = $('<div></div>');
      let cardImgDiv = $('<div></div>');
      let cardContent = $('<div></div>');
      let contentDetails = $('<div></div>');
      let cardAction = $('<div></div>');
      let cardImg = $(`<img>`);
      let cardSpan = $('<span></span');
      let contentP = $('<p></p>');
      let contentPrecip = $('<p></p>');

      middleCol.addClass('col s12 l2 extendedCol');
      cardRow.addClass('row');
      cardCol.addClass('col s12');
      card.addClass('card small forecastCard');

      cardImgDiv.addClass('card-image');
      cardImg.attr(
        'src',
        iconData[filteredForecastList[i].weather[0].main.toLowerCase()].day
      );
      cardImg.attr('alt', `${filteredForecastList[i].weather[0].main}`);
      cardImg
        .attr('width', 130)
        .attr('height', 130)
        .attr('style', 'width: auto !important; margin: 0 auto');
      cardSpan.addClass('card-title extendedTitle');
      cardSpan.text(new Date(filteredForecastList[i].dt * 1000).toDateString());
      cardImgDiv.append(cardSpan, cardImg);

      cardContent.addClass('card-content center extendedContent');
      contentP.addClass('extendedText');
      contentP.attr('style', 'font-size:1.1rem;');
      let weather = filteredForecastList[i].weather[0];
      contentP.text(
        weather.description[0].toUpperCase() + weather.description.slice(1)
      );
      contentDetails.addClass('extendedDetails').html(
        `<span style="font-size:2.2rem">${Math.round(
          filteredForecastList[i].temp.max
        )}°F</span>
        <span>Wind Chill: ${Math.round(
          filteredForecastList[i].feels_like.day
        )}°F</span>
        <span>Wind: ${Math.floor(filteredForecastList[i].wind_speed)} mph</span>
        <span>Humidity: ${filteredForecastList[i].humidity}%</span>`
      );
      contentPrecip.text(
        `Precip: ${
          filteredForecastList[i]['rain']
            ? (filteredForecastList[i].rain / 25.4).toFixed(2)
            : 0
        }`
      );
      cardContent.append(contentP, contentDetails, contentPrecip);

      cardAction.addClass('card-action');
      let actionA = $('<a href="#">This is a link</a>');
      cardAction.append(actionA);

      card.append(cardImgDiv, cardContent, cardAction);
      cardCol.append(card);
      cardRow.append(cardCol);
      middleCol.append(cardRow);

      $('#extendedForecast').append(middleCol);
    }

    let col6 = $('<div class="col s12 l1"></div>');
    $('#extendedForecast').append(col6);
  };
  rerenderWholeForecast = ({ forecastData, weatherData }) => {
    this.clearWeather();
    this.updateCityInfo();
    this.printTodaysForecast(weatherData);
    this.printExtendedForecast(forecastData);
  };
  updateCityInfo = () => {
    this.searchedList.indexOf(this.lastSearch.toLowerCase()) === -1 &&
      this.searchedList.push(this.lastSearch.toLowerCase()) &&
      this.printSearchedCities();
    localStorage.setItem('lastSearch', this.lastSearch.toLowerCase());
    localStorage.setItem('searchedList', JSON.stringify(this.searchedList));
  };
}

class App {
  constructor() {
    this.API = new OWAPI();
    this.screen = new Screen();
  }
  init = async () => {
    let self = this;
    this.screen.searchEl.click(this.screen.hideSearch);

    this.screen.form.submit(async function (e) {
      const input = self.screen.getInputCity(e);
      if (input) {
        self.screen.setLastSearch(input);
        const data = await self.API.runSearch(input);
        data.weatherData && self.screen.rerenderWholeForecast(data);
      }
    });

    this.screen.cityCollectionEl.on(
      'click',
      '.searchListItem',
      async function () {
        let input = $(this).text().trim();
        self.screen.setLastSearch(input);
        const data = await self.API.runSearch(input);
        data.weatherData && self.screen.rerenderWholeForecast(data);
      }
    );

    this.screen.searchedList && this.screen.printSearchedCities();
    const data = await this.API.runSearch(this.screen.lastSearch);
    console.log(data);
    data.weatherData && this.screen.rerenderWholeForecast(data);
  };
}

const WeatherDashboard = new App();
WeatherDashboard.init();

// data &&
//   searchedList.indexOf(searchTerm.toLowerCase()) === -1 &&
//   searchedList.push(searchTerm.toLowerCase()) &&
//   printSearchedCities();
// resp && localStorage.setItem('lastSearch', searchTerm.toLowerCase());
// resp && localStorage.setItem('searchedList', JSON.stringify(searchedList));
// resp && printTodaysForecast(resp);
// resp && printExtendedForecast(searchTerm, resp.coord.lat, resp.coord.lon);
