var button = $("#searchBtn")
var input = $("#input")
var language = $('#language')
var searchResultsDiv = $("#searchResults")

var searchImg = $('#searchImg')
var googleTranslate = $('#googleTranslate')
var weatherResults = $('#weatherDiv')
var weatherSearch = $('#weatherSearch')
var weatherBtn = $('#weatherBtn')
var tempDiv = $('#tempDiv')
var iconDiv = $('#iconDiv')
var weatherAPIKey = "2c93b8b4f835efd50e9d4694052f2372"

// Get user's geolocation to determine which local headlines to display
function getLocation() {
    if (navigator.location) {
        navigator.geolocation.getCurrentPosition(success)
     
    }
    else {
        console.log("Geolocation is not supported by this browser.")
    }
}
function showPosition(success) { 
    console.log("success")
}
getLocation()

// Search local headlines using unofficial Google News API
function searchLocalNews() {
    var country = "" 
    var geo = ""
    var language = ""
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://google-news.p.rapidapi.com/v1/geo_headlines?country=FR&geo=Paris&lang=fr",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "google-news.p.rapidapi.com",
            "x-rapidapi-key": "3ff1283524msh220bfc89bcc77a5p1ff266jsnc3c75477f277"
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);

        for (var i = 0; i < response.articles.length; i++) {
        //Heading
            var title = $("<a>")
            var lineBreak = $("<br>");
            title.text(response.articles[i].title)
            title.attr("href", response.articles[i].link)
            $('#searchResults').append(title)
            $("#searchResults").append(lineBreak)
        //Publication date
            var date = $("<p>")
            dateStr = response.articles[i].published
            date = moment(dateStr).format("D MMMM YYYY")
            $("#searchResults").append(date);
            $("#searchResults").append(lineBreak)
        ////No subheading or summary article available
        }
        });
}
searchLocalNews() 

$("#searchBtn").click(function () {
    clear()
    var searchTerm = input.val()
    var languageSearch = language.val()

    //Use Contextual News Search API if user selects English as it is a better source of English news
    if (languageSearch === "en") {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://rapidapi.p.rapidapi.com/api/search/NewsSearchAPI?pageSize=25&q=" + searchTerm + "&autoCorrect=true&pageNumber=1&toPublishedDate=null&fromPublishedDate=null",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
                "x-rapidapi-key": "3ff1283524msh220bfc89bcc77a5p1ff266jsnc3c75477f277"
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response);
            for (var i = 0; i < response.value.length; i++) {
                function addSearchResults() {
                //Heading
                    var title = $("<a>")
                    var lineBreak = $("<br>");
                    title.text(response.value[i].title)
                    title.attr("href", response.value[i].url)
                    $('#searchResults').append(title)
                    $("#searchResults").append(lineBreak)
                //Publication date
                    var date = $("<p>")
                    dateStr = response.value[i].datePublished
                    date = moment(dateStr).format("D MMMM YYYY")
                    $("#searchResults").append(date);
                //Subheading
                    var subheading = $("<p>")
                    subheading.text(response.value[i].description)
                    $('#searchResults').append(subheading)
                }
                addSearchResults()
            }
        });
    }
    // If user selects another language, use Newscatcher API, which is multi-lingual
    else {
        const settings = {
            "async": true,
            "crossDomain": true,
            "searchTerm": searchTerm,
            "language": language,
            "url": "https://rapidapi.p.rapidapi.com/v1/search?q=" + searchTerm + "&media=True&sort_by=relevancy&lang=" + languageSearch + "&page=1",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "newscatcher.p.rapidapi.com",
                "x-rapidapi-key": "3ff1283524msh220bfc89bcc77a5p1ff266jsnc3c75477f277"
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response)
            for (var i = 0; i < response.articles.length; i++) {
                function addSearchResults() {
                    //Heading
                    var title = $("<a>")
                    var lineBreak = $("<br>");
                    title.text(response.articles[i].title)
                    title.attr("href", response.articles[i].link)
                    $('#searchResults').append(title)
                    $("#searchResults").append(lineBreak)
                    //Publication date
                    var date = $("<p>")
                    dateStr = response.articles[i].published_date
                    date = moment(dateStr).format("D MMMM YYYY")
                    $("#searchResults").append(date);
                    //Summary
                    var summary = $("<p>")
                    summary.text(response.articles[i].summary)
                    $('#searchResults').append(summary)
                }
                addSearchResults()
            }
         
        })
    };
})
//Clear function for news search results
function clear() {
    $("#searchResults").empty()    
}

function getCoordinates(addressSearch) {
    
    var address = addressSearch
    var geocoder = new google.maps.Geocoder()
    
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {

            var latitudeVal = results[0].geometry.location.lat()
            var longitudeVal = results[0].geometry.location.lng()
            
            getForecast(latitudeVal, longitudeVal)
            
        }
        else {
            console.log('Geocode was not successful for the following reason: ' + status)
        }
    })
}

function getForecast(latitude, longitude) {
   
    //Clear fields before search
    $('#iconDiv').empty()
    $('#tempDiv').empty()
    $('#conditionDiv').empty()
    latitudeVal = latitude
    longitudeVal = longitude

    //AJAX call to Openweathermap API
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitudeVal + "&lon=" + longitudeVal + "&units=metric&exclude={part}&appid=" + weatherAPIKey
    }).then(function (response) {
        console.log(response)
    //Temperature
        var temperature = $('<p>')
        var tempRounded = Math.round(response.current.temp)
        temperature.text(`${tempRounded} °C  `)
        temperature.addClass("tempClass")
        $('#tempDiv').append(temperature)
    //Weather condition (description)
        var condition = $('<p>')
        condition.text(response.current.weather[0].description)
        condition.addClass('conditionClass')
        $('#conditionDiv').append(condition)
    //Condition (icon)
        var icon = $('<img>')
        icon.attr('src', "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + ".png")
        icon.addClass("iconClass")
        $('#iconDiv').append(icon)
    })
}
 

$('#weatherBtn').click(function () {
    var address = $('#weatherSearch').val()
    getCoordinates(address)
    
})       


