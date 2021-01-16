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

var headingDiv = $('#headingDiv')
var headingIcon = $('#headingIcon')
var trendingBtm = $('#trendingHeadlinesBtm')

// Display trending news on side bar upon page load
window.onload = function () {
    displayTrendingNews()
    getCoords()
    }

// Conduct local news search when clicking on website title
$('#title').click(function () {
    clear()
    getCoords()  
})

// Get user's geolocation upon page load to determine which local headlines to display and local weather
function getCoords() {
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

//convert user coordinates to address using Google maps API
function convertCoords(latitude, longitude) {
    
    var latlng = `${latitude}, ${longitude}`
    var apiKey = "AIzaSyDyI5MQ5hTnh-zH-UuVGbih40E5JPQvhdI"
    
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?&latlng=" + latlng + "&key=" + apiKey,
        method: "get"
    }).then(function (response) {
        
        var geoLocation = response.results[0].address_components[0].long_name
        // console.log(geoLocation) working
        displayLocalNews(geoLocation)
    })
}

// Display local headlines using unofficial Google News API (no images)
function displayLocalNews(geoLocation) {
    // console.log(geoLocation) working

        //Header
        headingDiv.text('LOCAL HEADLINES')
        var logo = $('<img>')
        logo.attr('src', './assets/wireless.svg')
        logo.addClass('logo')
        headingDiv.prepend(logo)

    var settings = {
        
        "async": true,
        "crossDomain": true,
        "url": "https://google-news.p.rapidapi.com/v1/geo_headlines?" + "&geo=" + geoLocation,
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
// Trending news - side bar
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
            $('#trendingHeadlines').append(title)
            

        //Publication date
            var date = $("<p>")
            dateStr = date.text(response.data.results[i].date)
            date = moment(dateStr).format("D MMMM YYYY")
            $('#trendingHeadlines').append(date);
    
        //Image
            var image = $("<img>", {
                class: "trendingImage"
            })
            image.attr('src', response.data.results[i].image)
            $('#trendingHeadlines').append(image)
            
        }
        function addSearchResultsBtm() {
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
            $('#trendingHeadlinesBtm').append(title)
            

        //Publication date
            var date = $("<p>")
            dateStr = date.text(response.data.results[i].date)
            date = moment(dateStr).format("D MMMM YYYY")
            $('#trendingHeadlinesBtm').append(date);
    
        //Image
            var image = $("<img>", {
                class: "trendingImage"
            })
            image.attr('src', response.data.results[i].image)
            $('#trendingHeadlinesBtm').append(image)
            
        }
                
        addSearchResults()
        addSearchResultsBtm()
    }
});
}
// Trending news - bottom



//Covid-19 news
$('#covidBtn').click(function () {
    clear()
    covidNews()
})


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
                    var dateStr = response.articles[i].published_date
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
    $('#iconDivC').empty()
    $('#tempDivC').empty()
    $('#conditionDivC').empty()
    latitudeVal = latitude
    longitudeVal = longitude

    //AJAX call to Openweathermap API
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitudeVal + "&lon=" + longitudeVal + "&units=metric&exclude={part}&appid=" + weatherAPIKey
    }).then(function (response) {
        
     //SIDE BAR   
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

        // CENTRAL BAR
        //Temperature
        var temperature = $('<p>')
        var tempRounded = Math.round(response.current.temp)
        temperature.text(`${tempRounded} °C `)
        temperature.addClass("tempClass")
        $('#tempDivC').append(temperature)
    //Weather condition (description)
        var condition = $('<p>')
        condition.text(response.current.weather[0].description)
        condition.addClass('conditionClass')
        $('#conditionDivC').append(condition)
    //Condition (icon)
        var icon = $('<img>')
        icon.attr('src', "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + ".png")
        icon.addClass("iconClass")
        $('#iconDivC').append(icon)
    })
}
 

$('#weatherBtn').click(function () {
    var address = $('#weatherSearch').val()
    getCoordinates(address)
    
})       


