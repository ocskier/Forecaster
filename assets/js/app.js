const iconData = {
  clear: {
    day: 'assets/icons/iconfinder_weather-clear_118959.png',
    night: 'assets/icons/iconfinder_weather-icons-night-clear_2087717.png',
  },
  clouds: {
    day: 'assets/icons/iconfinder_icon-20-clouds_316271.png',
  },
  rain: {
    day: 'assets/icons/iconfinder_weather-showers-scattered_118964.png',
  },
  thunderstorm: {
    day: 'assets/icons/iconfinder_thunderstorm-ranny_1221016.png',
  },
  snow: {
    day: 'assets/icons/iconfinder_cloud_snow_367530.png',
  },
  mist: {
    day: 'assets/icons/iconfinder_weather_30_2682821.png',
  },
  drizzle: {
    day: 'assets/icons/iconfinder_weather-showers-scattered_118964.png',
  },
};

let searchedList = JSON.parse(localStorage.getItem('searchedList')) || [];
let lastSearch = localStorage.getItem('lastSearch') || 'Raleigh';

const searchUrl =
  'https://api.openweathermap.org/data/2.5/weather?APPID=833a5451ef3423413fe6e789b8687cf3&units=imperial';
const forecastUrl =
  'https://api.openweathermap.org/data/2.5/onecall?APPID=833a5451ef3423413fe6e789b8687cf3&units=imperial&exclude=hourly,minutely';

// let iconUrl = 'https://api.iconfinder.com/v3/icons/search?';
// iconUrl += 'client_id=mXK8DHYcamId9eZ9lMHRipV2zSMQdn3oPi1GkmT12Pq4FmKtTPiNqfmIxsgNb93W&';
// iconUrl += 'client_secret=gV3NcGeUtZlQIpY1peUeGNUJy70dJaojzJ66TBnBiEahY5pPR8xaDiluftnR19Mt&';
// iconUrl += 'count=1&premium=0&query=';

init();

$('#searchIcon').click(() => {
  let status = $('form').css('visibility');
  $('form').attr(
    'style',
    `visibility: ${status === 'visible' ? 'hidden' : 'visible'}`
  );
});

$('form').submit(e => {
  e.preventDefault();
  lastSearch = $('input')
    .val()
    .trim();
  $('input').val('');
  lastSearch && runSearch(lastSearch);
});

$('.collection').on('click', '.searchListItem', function() {
  lastSearch = $(this).text();
  lastSearch && runSearch(lastSearch);
});

function init() {
  searchedList && printSearchedCities();
  runSearch(lastSearch);
}

function printSearchedCities() {
  let collection = $('.collection');
  collection.empty();
  collection.attr('style', 'visibility: visible');
  for (let i = 0; i < searchedList.length; i++) {
    collection.append(
      `<li class="collection-item searchListItem">${searchedList[i].toUpperCase()}</li>`
    );
  }
}

function buildUrl(baseUrl, extendedUrl) {
  return baseUrl + extendedUrl;
}

async function runSearch(searchTerm) {
  for (el in ['h2', '#weatherDesc']) {
    $(el).text('');
  }
  $('#weatherDetails').empty();
  $('#currentIcon img').remove();

  try {
    let resp = await $.get(buildUrl(searchUrl, `&q=${searchTerm}`));
    resp &&
      searchedList.indexOf(searchTerm.toLowerCase()) === -1 &&
      searchedList.push(searchTerm.toLowerCase()) &&
      printSearchedCities();
    resp && localStorage.setItem('lastSearch', searchTerm.toLowerCase());
    resp && localStorage.setItem('searchedList', JSON.stringify(searchedList));
    resp && printTodaysForecast(resp);
    resp && printExtendedForecast(searchTerm,resp.coord.lat,resp.coord.lon);
  } catch (err) {
    console.log(err);
  }
}

function printTodaysForecast(data) {
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
}

async function printExtendedForecast(searchTerm,lat,lon) {
  $('#extendedForecast').empty();

  try {
    let resp = await $.get(buildUrl(forecastUrl, `&lat=${lat}&lon=${lon}`));
    // old code for the 40 3hr increments of forecast data
    // let today = new Date();
    // const filteredForecastList = resp.list
    //   .filter(item => new Date(item.dt_txt).getDate() != today.getDate())
    //   .filter(item => new Date(item.dt_txt).getHours() === 12);
    const filteredForecastList = resp.daily;
    $('#weatherDetails').find('div').append(`<span>UV Index: ${filteredForecastList[0].uvi}</span>`);
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
      cardSpan.text(
        new Date(filteredForecastList[i].dt*1000).toDateString()
      );
      cardImgDiv.append(cardSpan, cardImg);

      cardContent.addClass('card-content center extendedContent');
      contentP.addClass('extendedText');
      contentP.attr('style', 'font-size:1.1rem;');
      let weather = filteredForecastList[i].weather[0];
      contentP.text(
        weather.description[0].toUpperCase() +
        weather.description.slice(1)
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
            ? (filteredForecastList[i].rain/25.4).toFixed(2)
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
  } catch (err) {
    console.log(err);
  }
}
