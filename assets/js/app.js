let searchTerm = 'Raleigh';

// let iconUrl = 'https://api.iconfinder.com/v3/icons/search?';
// iconUrl += 'client_id=mXK8DHYcamId9eZ9lMHRipV2zSMQdn3oPi1GkmT12Pq4FmKtTPiNqfmIxsgNb93W&';
// iconUrl += 'client_secret=gV3NcGeUtZlQIpY1peUeGNUJy70dJaojzJ66TBnBiEahY5pPR8xaDiluftnR19Mt&';
// iconUrl += 'count=1&premium=0&query=';

$('#searchIcon').click(function() {
    let status = $('form').css('visibility');
    $('form').attr('style',`visibility: ${status === 'visible' ? 'hidden' : 'visible'}`);
})

$('#runSearch').click(function() {
    searchTerm = $('input').val();
    $('input').val('');
    runSearch();
});

function runSearch() {
    $.get(`https://api.openweathermap.org/data/2.5/weather?APPID=833a5451ef3423413fe6e789b8687cf3&q=${searchTerm}&units=imperial`).then(resp=>{
        console.log(resp);
        const imgHTML = `<img width=300 height=200 src="http://openweathermap.org/img/wn/${resp.weather[0].icon}@2x.png" alt="Current Icon">`;
        $('#currentIcon').append(imgHTML);
        $('#weatherDesc').text(resp.weather[0].description[0].toUpperCase()+resp.weather[0].description.slice(1));
        $('#weatherDetails').append(printWeatherDetails(resp));
        $('#todaysForecast').attr('style', 'visibility: visible');
        printExtendedForecast();
    });
}

function printExtendedForecast() {
    $.get(`https://api.openweathermap.org/data/2.5/forecast?APPID=833a5451ef3423413fe6e789b8687cf3&q=${searchTerm}&units=imperial`).then(resp=>{
        console.log(resp);
        let today = new Date();
        const filteredForecastList = resp.list
            .filter(item=>new Date(item.dt_txt).getDate() != today.getDate())
            .filter(item=>new Date(item.dt_txt).getHours() === 12);
        console.log(filteredForecastList);

        let col1 = $('<div class="col s1"></div>');
        $('#extendedForecast').append(col1);

        for (let i = 0; i < filteredForecastList.length; i++) {

            let middleCol = $('<div class="col s2"></div>');
            let cardRow = $('<div class="row"></div>');
            let cardCol = $('<div class="col s12"></div>');
            let card = $('<div class="card small"></div>');
            card.attr('style', `height: 100%; min-height: 350px; display: flex; flex-direction: column; 
            background-color: lightblue; color: darkblue;box-shadow: 0px 0px 10px 0px white;border-radius:15px;`)
            
            let cardImgDiv = $('<div class="card-image"></div>');
            let cardImg = $(`<img src="http://openweathermap.org/img/wn/${filteredForecastList[i].weather[0].icon.slice(0,2)}d@2x.png" alt=${filteredForecastList[i].weather[0].main}>`);
            let cardSpan = $(`<span class="card-title" style="top: -10%;font-size: 1rem;color: darkblue;
            width: 100%;margin: 0 auto;text-align: center;">
            ${new Date(filteredForecastList[i].dt_txt).toLocaleDateString('en-US')}</span>`);
            cardImgDiv.append(cardImg,cardSpan);
            
            let cardContent = $('<div class="card-content center" style="font-size: 0.8rem;">');
            let contentP = $(`<p style="font-size: 1.3rem;padding-bottom:10px;"></p>`).text(filteredForecastList[i].weather[0].description[0].toUpperCase() + filteredForecastList[i].weather[0].description.slice(1));
            let contentDetails = $(`<div style="display:flex;flex-direction:column;">${printWeatherDetails(filteredForecastList[i])}</div>`);
            let contentPrecip = $(`<p>Precip: ${filteredForecastList[i]['rain'] ? filteredForecastList[i].rain['3h'] : 0}</p>`)
            cardContent.append(contentP,contentDetails,contentPrecip);
            
            let cardAction = $('<div class="card-action" style="position: relative; display: none"></div>');
            let actionA = $('<a href="#"></a>').text('This is a link');
            cardAction.append(actionA);
            
            card.append(cardImgDiv,cardContent,cardAction);
            cardCol.append(card);
            cardRow.append(cardCol);
            middleCol.append(cardRow);

            $('#extendedForecast').append(middleCol);
        }

        let col6 = $('<div class="col s1"></div>');
        $('#extendedForecast').append(col6);
    });
}

function printWeatherDetails(details) {
    return `<span style="font-size:2.2rem">${Math.round(details.main.temp_max)}^F</span><span>Wind Chill: ${Math.round(details.main.feels_like)}^F</span>
    <span>Wind: ${Math.floor(details.wind.speed)} mph</span><span>Humidity: ${details.main.humidity}%</span>`
}
