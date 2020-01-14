let searchTerm = 'Raleigh';

// let iconUrl = 'https://api.iconfinder.com/v3/icons/search?';
// iconUrl += 'client_id=mXK8DHYcamId9eZ9lMHRipV2zSMQdn3oPi1GkmT12Pq4FmKtTPiNqfmIxsgNb93W&';
// iconUrl += 'client_secret=gV3NcGeUtZlQIpY1peUeGNUJy70dJaojzJ66TBnBiEahY5pPR8xaDiluftnR19Mt&';
// iconUrl += 'count=1&premium=0&query=';

$('#searchIcon').click(() => {
  let status = $('form').css('visibility');
  $('form').attr(
    'style',
    `visibility: ${status === 'visible' ? 'hidden' : 'visible'}`
  );
});

$('#runSearch').click(() => {
  searchTerm = $('input').val();
  $('input').val('');
  runSearch();
});

function runSearch() {
  for (el in ['h2', '#weatherDesc']) {
    $(el).text('');
  }
  $('#weatherDetails').empty();
  $('#currentIcon img').remove();

  let searchUrl =
    'https://api.openweathermap.org/data/2.5/weather?APPID=833a5451ef3423413fe6e789b8687cf3';
  searchUrl += `&q=${searchTerm}&units=imperial`;

  $.get(searchUrl).then(resp => {
    console.log(resp);
    $('h2').text(resp.name);
    let imgHTML =
      '<img width=300 height=200 src="http://openweathermap.org/img/wn/';
    imgHTML += `${resp.weather[0].icon}@2x.png" alt="Current Icon">`;
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
    printExtendedForecast();
  });
}

function printExtendedForecast() {
  $('#extendedForecast').empty();
  let forecastUrl =
    'https://api.openweathermap.org/data/2.5/forecast?APPID=833a5451ef3423413fe6e789b8687cf3';
  forecastUrl += `&q=${searchTerm}&units=imperial`;
  $.get(forecastUrl).then(resp => {
    console.log(resp);
    let today = new Date();
    const filteredForecastList = resp.list
      .filter(item => new Date(item.dt_txt).getDate() != today.getDate())
      .filter(item => new Date(item.dt_txt).getHours() === 12);

    let col1 = $('<div class="col s1"></div>');
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

      middleCol.addClass('col s2');
      cardRow.addClass('row');
      cardCol.addClass('col s12');
      card.addClass('card small forecastCard');

      cardImgDiv.addClass('card-image');
      cardImg.attr(
        'src',
        `http://openweathermap.org/img/wn/${filteredForecastList[
          i
        ].weather[0].icon.slice(0, 2)}d@2x.png`
      );
      cardImg.attr('alt', `${filteredForecastList[i].weather[0].main}`);
      cardSpan.addClass('card-title');
      cardSpan.attr(
        'style',
        'top: -10%;font-size: 1rem;color: darkblue;width: 100%;margin: 0 auto;text-align: center;'
      );
      cardSpan.text(
        new Date(filteredForecastList[i].dt_txt).toLocaleDateString('en-US')
      );
      cardImgDiv.append(cardImg, cardSpan);

      cardContent.addClass('card-content center');
      cardContent.attr('style', 'font-size: 0.8rem;');
      contentP.attr('style', 'font-size: 1.3rem;padding-bottom:10px;');
      let todaysWeather = filteredForecastList[i].weather[0];
      contentP.text(
        todaysWeather.description[0].toUpperCase() +
          todaysWeather.description.slice(1)
      );
      contentDetails.attr('style', 'display:flex;flex-direction:column;');
      contentDetails.html(
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
        .attr('style', 'position: relative; display: none');
      let actionA = $('<a href="#"></a>').text('This is a link');
      cardAction.append(actionA);

      card.append(cardImgDiv, cardContent, cardAction);
      cardCol.append(card);
      cardRow.append(cardCol);
      middleCol.append(cardRow);

      $('#extendedForecast').append(middleCol);
    }

    let col6 = $('<div class="col s1"></div>');
    $('#extendedForecast').append(col6);
  });
}
