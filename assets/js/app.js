const iconData = {
  clear: {
    day:'assets/icons/iconfinder_weather-clear_118959.png',
    night: 'assets/icons/iconfinder_weather-icons-night-clear_2087717.png'
  },
  clouds: {
    day: 'assets/icons/iconfinder_icon-20-clouds_316271.png'
  },
  rain: {
    day: 'assets/icons/iconfinder_weather-showers-scattered_118964.png'
  },
  thunderstorm: {
    day: 'assets/icons/iconfinder_thunderstorm-ranny_1221016.png'
  },
  snow: {
    day: 'assets/icons/iconfinder_cloud_snow_367530.png'
  },
  mist: {
    day: 'assets/icons/iconfinder_weather_30_2682821.png'
  },
  drizzle: {
    day: 'assets/icons/iconfinder_weather-showers-scattered_118964.png'
  }
};

let searchedList = JSON.parse(localStorage.getItem('searchedList')) || [];
let lastSearch = localStorage.getItem('lastSearch') || 'Raleigh';

const searchUrl =
  'https://api.openweathermap.org/data/2.5/weather?APPID=833a5451ef3423413fe6e789b8687cf3&units=imperial';
const forecastUrl =
  'https://api.openweathermap.org/data/2.5/forecast?APPID=833a5451ef3423413fe6e789b8687cf3&units=imperial';

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

$('form').submit((e)=>{
  e.preventDefault();
  lastSearch = $('input').val().trim();
  $('input').val('');
  console.log(lastSearch);
  lastSearch && runSearch(lastSearch);
});

$('.collection').on('click','.searchListItem', function() {
  console.log($(this).text());
  lastSearch = $(this).text();
  lastSearch && runSearch(lastSearch);
});

async function init() {
    searchedList && printSearchedCities();  
    runSearch(lastSearch);  
}

function printSearchedCities() {
  $('.collection').empty();
  let collection = $('.collection');
  collection.attr('style', 'visibility: visible');
  for (let i = 0; i < searchedList.length; i++) {
    collection.append(`<li class="collection-item searchListItem">${searchedList[i]}</li>`)
  }
}

function buildUrl(baseUrl,extendedUrl) {
  return baseUrl+extendedUrl
}

function runSearch(searchTerm) {
  for (el in ['h2', '#weatherDesc']) {
    $(el).text('');
  }
  $('#weatherDetails').empty();
  $('#currentIcon img').remove();

  $.get(buildUrl(searchUrl,`&q=${searchTerm}`)).then(resp => {
    if (searchedList.indexOf(searchTerm) === -1) {
      searchedList.push(searchTerm);
      localStorage.setItem('searchedList', JSON.stringify(searchedList));
      printSearchedCities();
    }
    localStorage.setItem('lastSearch', searchTerm);
    $('h2').text(resp.name);
    let imgHTML =
      `<img width=300 height=200 src=${iconData[resp.weather[0].main.toLowerCase()].day} alt="Current Icon">`;
    $('#currentIcon').append(imgHTML);
    $('#weatherDesc').text(
      resp.weather[0].description[0].toUpperCase() +
        resp.weather[0].description.slice(1)
    );
    $('#weatherDetails').append(
      `<span style="font-size:3.2rem;padding-bottom:12px">${Math.round(
        resp.main.temp_max
      )}°F</span>
      <div style="display: flex;display: flex;justify-content: space-around;">
      <span>Wind Chill: ${Math.round(resp.main.feels_like)}°F</span>
      <span>Wind: ${Math.floor(resp.wind.speed)} mph</span>
      <span>Humidity: ${resp.main.humidity}%</span>
      </div>`
    );
    $('#todaysForecast').attr('style', 'visibility: visible');
    printExtendedForecast(searchTerm);
  }).catch((err) => {
    console.log(err);
  });
}

function printExtendedForecast(searchTerm) {
  $('#extendedForecast').empty();

  $.get(buildUrl(forecastUrl,`&q=${searchTerm}`)).then(resp => {
    let today = new Date();
    const filteredForecastList = resp.list
      .filter(item => new Date(item.dt_txt).getDate() != today.getDate())
      .filter(item => new Date(item.dt_txt).getHours() === 12);

    let col1 = $('<div class="col s12 l1"></div>');
    $('#extendedForecast').append(col1);

    for (let i = 0; i < filteredForecastList.length; i++) {
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
      cardImg.attr('width', 130).attr('height', 130).attr('style','width: auto !important; margin: 0 auto');
      cardSpan.addClass('card-title extendedTitle');
      cardSpan.text(
        new Date(filteredForecastList[i].dt_txt).toLocaleDateString('en-US')
      );
      cardImgDiv.append(cardSpan, cardImg);

      cardContent.addClass('card-content center extendedContent');
      contentP.addClass('extendedText');
      let todaysWeather = filteredForecastList[i].weather[0];
      contentP.text(
        todaysWeather.description[0].toUpperCase() +
          todaysWeather.description.slice(1)
      );
      contentDetails.addClass('extendedDetails').html(
        `<span style="font-size:2.2rem">${Math.round(
          filteredForecastList[i].main.temp_max
        )}°F</span>
        <span>Wind Chill: ${Math.round(
          filteredForecastList[i].main.feels_like
        )}°F</span>
        <span>Wind: ${Math.floor(filteredForecastList[i].wind.speed)} mph</span>
        <span>Humidity: ${filteredForecastList[i].main.humidity}%</span>`
      );
      contentPrecip.text(
        `Precip: ${
          filteredForecastList[i]['rain']
            ? filteredForecastList[i].rain['3h']
            : 0
        }`
      );
      cardContent.append(contentP, contentDetails, contentPrecip);

      cardAction
        .addClass('card-action')
      let actionA = $('<a href="#"></a>').text('This is a link');
      cardAction.append(actionA);

      card.append(cardImgDiv, cardContent, cardAction);
      cardCol.append(card);
      cardRow.append(cardCol);
      middleCol.append(cardRow);

      $('#extendedForecast').append(middleCol);
    }

    let col6 = $('<div class="col s12 l1"></div>');
    $('#extendedForecast').append(col6);
  }).catch((err) => {
    console.log(err);
  });
}

