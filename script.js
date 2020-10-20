var button = $("#searchBtn")
var input = $("#input")
var language = $('#language')
var searchResultsDiv = $("#searchResults")

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
function clear() {
    $("#searchResults").empty()    
}

