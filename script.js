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

// Get user's geolocation to determine which local headlines to display and local weather
window.onload =function () {
    
    if (navigator.geolocation) {
    function success(position) {
        var latitude = position.coords.latitude
        var longitude = position.coords.longitude

        convertCoords(latitude, longitude)
        getForecast(latitude, longitude)
        }
    }
    else {
        console.log('geolocation not supported by browsers')
    }
navigator.geolocation.getCurrentPosition(success)
    }

//convert user coordinates to address
function convertCoords(latitude, longitude) {
    console.log(latitude, longitude) 

    var latlng = `${latitude}, ${longitude}`
    var apiKey = "AIzaSyDyI5MQ5hTnh-zH-UuVGbih40E5JPQvhdI"
    
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?&latlng=" + latlng + "&key=" + apiKey,
        method: "get"
    }).then(function (response) {
        var countryCode = response.results[0].address_components[5].short_name
        
        displayLocalNews(countryCode)
    })
}

// Display local headlines using unofficial Google News API
function displayLocalNews(countryCode) {
    var country = countryCode
    console.log(country)
    var city = ""
    var language = ""
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://google-news.p.rapidapi.com/v1/geo_headlines?country=" + country + "&geo=" + city + "&lang=" + language,
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

// News search (taking in user input)
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
//Get coordinates for weather search
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

//Get weather forecast for user current city on page load

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
        temperature.text(`${tempRounded} °C `)
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


