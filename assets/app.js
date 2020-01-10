let searchTerm = 'Raleigh';

let col1 = $('<div class="col s1"></div>');
$('#extendedForecast').append(col1);

for (let i = 0; i < 5; i++) {
    let middleCol = $('<div class="col s2"></div>');
    let cardRow = $('<div class="row"></div>');
    let cardCol = $('<div class="col s12"></div>');
    let card = $('<div class="card small"></div>');
    
    let cardImgDiv = $('<div class="card-image"></div>');
    let cardImg = $('<img src="images/sample-1.jpg">');
    let cardSpan = $('<span class="card-title"></span>').text('Card Title');
    cardImgDiv.append(cardImg,cardSpan);
    
    let cardContent = $('<div class="card-content">');
    let contentP = $(`<p></p>`).text(`I am a very simple card. I am good at containing small bits of information.
        I am convenient because I require little markup to use effectively.`);
    cardContent.append(contentP);
    
    let cardAction = $('<div class="card-action"></div>');
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

$('#searchIcon').click(function() {
    let status = $('form').css('visibility');
    $('form').attr('style',`visibility: ${status === 'visible' ? 'hidden' : 'visible'}`);
})

$('#runSearch').click(function() {
    searchTerm = $('input').val();
    $('input').val('');
    runSearch(searchTerm);
});

function runSearch(query) {
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}`).then(resp=>{
        console.log(resp);
    });
}
