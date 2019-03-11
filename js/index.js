var pageCount = 0;
var request = {};

function handleFetch(searchTerm, callback) {

        request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent(searchTerm).replace(/%20/g, "+"),
            maxResults: 50,
            order: "viewCount",
            publishedAfter: "2015-01-01T00:00:00Z"
        });

    pageCount = 1;

    callback(request)

    $(window).on("resize", resetVideoHeight);
};

function displayResults(request){

    if(pageCount < 2)
        $(".btnPrev").toggleClass("hide",true);
    else
        $(".btnPrev").toggleClass("hide",false);

    if(pageCount == 0 || pageCount >= 5)
        $(".btnNext").toggleClass("hide",true);
    else
        $(".btnNext").toggleClass("hide",false);

    // execute the request
    request.execute(function(response) {
        var results = response.result;
        $(".results").html("");
        for(let i = (pageCount-1)*10; i< pageCount*10; i++)
        {
            let title = results.items[i].snippet.title;
            let videoId = results.items[i].id.videoId;
            $(".results").append(`<div class="item">
                    <h2>${title}</h2>
                    <iframe class="video w100" width="640" height="360" src="//www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                </div>`);
        };
        resetVideoHeight();
    });


};

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}

function handleClientLoad() {
    gapi.client.setApiKey("AIzaSyCM32sZOS4Eyqp45srGU9fS3wKZ3N1_iiM");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}

function watchForm() {

    $("#inputButton").on("click", (event) => {
        event.preventDefault();

        let searchTerm = $("#search").val();
        handleFetch(searchTerm, displayResults);
    })
}

$(watchForm);

$(".btnPrev").on("click", function(event) {
    event.preventDefault();

    pageCount -= 1;
    displayResults(request)
});

$(".btnNext").on("click", function(event) {
    event.preventDefault();

    pageCount += 1;
    displayResults(request)
});