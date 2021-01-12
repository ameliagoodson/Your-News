var button = $("#searchBtn")
var input = $("#input")
var language = $('#language')
var country = $('#country')
var searchResultsDiv = $("#searchResults")

var searchImg = $('#searchImg')
var googleTranslate = $('#googleTranslate')
var weatherResults = $('#weatherDiv')
var weatherSearch = $('#weatherSearch')
var weatherBtn = $('#weatherBtn')
var tempDiv = $('#tempDiv')
var iconDiv = $('#iconDiv')
var weatherAPIKey = "2c93b8b4f835efd50e9d4694052f2372"


// Conduct local news search when clicking on website title
$('#title').click(function () {
    console.log('test')
    clear()
    displayLocalNews()
})

// Get user's geolocation to determine which local headlines to display and local weather
window.onload =function () {
    displayTrendingNews()
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

// Display local headlines on sidebar using unofficial Google News API (no images)
function displayLocalNews(countryCode) {
    var country = countryCode
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

        for (var i = 0; i < response.articles.length; i++) {
        
        //Heading
            var title = $("<a>")
            title.text(response.articles[i].title)
            title.addClass('articleHeading')
            title.attr("href", response.articles[i].link)
            $("#searchResults").append(title)
          
        //Publication date
            var date = $("<p>")
            dateStr = response.articles[i].published
            date = moment(dateStr).format("D MMMM YYYY")
            date.className ='date'
            $("#searchResults").append(date);
        ////No subheading or summary article available
        }
        });
}
// Trending news
function displayTrendingNews() {
    const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://webit-news-search.p.rapidapi.com/trending?language=en",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "3ff1283524msh220bfc89bcc77a5p1ff266jsnc3c75477f277",
		"x-rapidapi-host": "webit-news-search.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
    
    for (var i = 0; i < response.data.results.length; i++) {
        function addSearchResults() {

            headingDiv.text('LOCAL HEADLINES')
            var logo = $('<img>')
            logo.attr('src', './assets/wireless.svg')
            logo.addClass('logo')
            headingDiv.prepend(logo)
            
        //Title
            var title = $("<a>")
            title.text(response.data.results[i].title)
            title.attr("href", response.data.results[i].url)
            title.addClass('articleHeading')
            $('#localHeadlines').append(title)

        //Publication date
            var date = $("<p>")
            dateStr = date.text(response.data.results[i].date)
            date = moment(dateStr).format("D MMMM YYYY")
            $('#localHeadlines').append(date);
        
        //Image
            var image = $("<img>", {
                class: "trendingImage"
            })
            image.attr('src', response.data.results[i].image)
            $('#localHeadlines').append(image)
        }
                
        addSearchResults()
    }
});
}

//Covid-19 news
$('#covidBtn').click(function () {
    clear()
    covidNews()
})

var headingDiv = $('#headingDiv')
var headingIcon = $('#headingIcon')

function covidNews() {
    const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://coronavirus-smartable.p.rapidapi.com/news/v1/global/",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "3ff1283524msh220bfc89bcc77a5p1ff266jsnc3c75477f277",
		"x-rapidapi-host": "coronavirus-smartable.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
    console.log(response);
     for (var i = 0; i < response.news.length; i++) {
                function addSearchResults() {
                
                //Heading
                    headingDiv.text('COVID-19')
                    var logo = $('<img>')
                    logo.attr('src', './assets/wireless.svg')
                    logo.addClass('logo')
                    headingDiv.prepend(logo)
                   
                //Title
                    var title = $("<a>")
                    title.text(response.news[i].title)
                    title.attr("href", response.news[i].originalUrl)
                    title.addClass('articleHeading')
                    $('#searchResults').append(title)
                    
                //Publication date
                    var date = $("<p>")   
                    dateStr = response.news[i].publishedDateTime
                    dateFormat = moment(dateStr).format("D MMMM YYYY")
                    date.text(dateFormat)
                    date.addClass('articleDate')
                    $("#searchResults").append(date)
                
                //Excerpt
                    var excerpt = $('<p>')
                    excerpt.text(response.news[i].excerpt)
                    $("#searchResults").append(excerpt)

                //Subheading
                    if (response.news[i].images != null) {
                    
                        var image = $("<img>",{
                            class: "newsImage"
                        })
                        image.attr('src', response.news[i].images[0].url)
                        $('#searchResults').append(image)
                }}
                addSearchResults()
            }
});
}

// Conduct search on 'Enter' without pressing search btn

// Execute a function when the user releases a key on the keyboard
$('#input').keypress(function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    $("#searchBtn").click();
  }
});

// News search (taking in user input)
$("#searchBtn").click(function () {
    clear()
    var searchTerm = input.val()
    var languageSearch = language.val()
    var countrySearch = country.val()

    //Use Webit News Search if user selects English as it is a better source of English news. 
    if (languageSearch === "en" && !countrySearch) {
        const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://rapidapi.p.rapidapi.com/search?q=" + searchTerm + "&language=en",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "3ff1283524msh220bfc89bcc77a5p1ff266jsnc3c75477f277",
		"x-rapidapi-host": "webit-news-search.p.rapidapi.com"
	}
};

        
        $.ajax(settings).done(function (response) {
          
            for (var i = 0; i < response.data.results.length; i++) {
                function addSearchResults() {
                //Heading
                    var title = $("<a>")
                    title.text(response.data.results[i].title)
                    title.attr("href", response.data.results[i].url)
                    title.addClass('articleHeading')
                    $('#searchResults').append(title)
                    
                //Publication date
                    var date = $("<p>")
                    dateStr = date.text(response.data.results[i].date)
                    date = moment(dateStr).format("D MMMM YYYY")
                    $("#searchResults").append(date);
                //Subheading
                    var image = $("<img>",{
                        class: "newsImage"
                    })
                    image.attr('src', response.data.results[i].image)
                    
                    $('#searchResults').append(image)
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
            "url": "https://rapidapi.p.rapidapi.com/v1/search?q=" + searchTerm + "&media=True&sort_by=relevancy&lang=" + languageSearch + "&country=" + countrySearch + "&page=1",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "newscatcher.p.rapidapi.com",
                "x-rapidapi-key": "3ff1283524msh220bfc89bcc77a5p1ff266jsnc3c75477f277"
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(settings.url)
            console.log(response)
            for (var i = 0; i < response.articles.length; i++) {
                function addSearchResults() {
                //Heading
                    var title = $("<a>")
                    title.text(response.articles[i].title)
                    title.attr("href", response.articles[i].link)
                    title.addClass('articleHeading')
                    $('#searchResults').append(title)
                    
                //Publication date
                    var date = $("<p>")
                    dateStr.text(response.articles[i].published_date)
                    date = moment(dateStr).format("D MMMM YYYY")
                    date.className = 'date'
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

//Display further search option when '+' button is clicked

$('#btnMore').click(function () {
    event.preventDefault()
        $('#langBtnDiv').toggle()
       
        console.log('button check')

})

//Clear function for news search results
function clear() {
    $("#searchResults").empty() 
    $('#headingDiv').empty()
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
        // console.log(response)
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


