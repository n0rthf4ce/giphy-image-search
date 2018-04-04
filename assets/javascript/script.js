
$(document).ready(function () {

    var topics = ["chicken", "pokemon", "grass", "cash", "kangaroo"], queryURL, numberOfFavorites;

    if (localStorage.getItem("numberOfFavorites") == null) {
        numberOfFavorites = 0;
    }
    else {
        numberOfFavorites = localStorage.getItem("numberOfFavorites");
    }

    function populateFavorites(totalFavorites) {
        $("#favorites").empty();
        for (let i = 0; i < totalFavorites; i++) {
            const htmlCode = localStorage.getItem("favorite" + i);
            var newCard = $("<div>");
            newCard.addClass("card gif-card").attr("style", "width: 18rem;").append(htmlCode);
            $("#favorites").prepend(newCard);
        }
        $("#favorites .card-body .save-to-favorites").remove();
    }
    function populateButtons() {
        $("#buttons").empty();
        for (let i = 0; i < topics.length; i++) {
            const element = topics[i];
            var newButton = $("<button>");
            newButton.text(element);
            newButton.attr("id", element);
            newButton.addClass("btn btn-success topic-button");
            newButton.attr("type", "button");
            newButton.attr("data-offset", "0");
            $("#buttons").append(newButton);
        }
    }
    populateFavorites(numberOfFavorites);
    populateButtons();

    $("#add-topic").on("click", function (event) {
        event.preventDefault();
        const topicName = $("#topic-name").val().trim();
        topics.push(topicName);
        populateButtons();
    });

    $("#buttons").on("click", "button", function () {
        var offset = parseInt($(this).attr("data-offset")), topic = $(this).attr("id");
        queryURL = "https://api.giphy.com/v1/gifs/search?api_key=lMe2wQmiZwZuiS8yqrRYkH3jOsIRvqwi&q=" + topic + "&limit=10&offset=" + offset + "&lang=en";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];

                var newCard = $("<div>"), newImage = $("<img>"), cardBody = $("<div>"), cardText = $("<p>");
                cardText.addClass("card-text").append("Title: " + element.title)
                cardBody.addClass("card-body").append(cardText).append("<p class='card-text'>Rating: " + element.rating + "</p>")
                    .append("<p class='card-text'>Source: " + element.source_tld + "</p>")
                    .append("<button data-target='" + topic + (i + offset) + "' class='btn btn-primary save-to-favorites'>Save to Favorites</button>");
                newImage.addClass("card-img-top clickable-gif")
                    .attr("src", element.images.fixed_height_still.url)
                    .attr("data-still", element.images.fixed_height_still.url)
                    .attr("data-animated", element.images.fixed_height.url)
                    .attr("data-state", "still")
                    .attr("alt", element.title);
                newCard.attr("id", topic + (i + offset)).addClass("card gif-card").attr("style", "width: 18rem;").append(newImage).append(cardBody);
                if (i % 2 == 0) {
                    $("#display-1").prepend(newCard);
                } else {
                    $("#display-2").prepend(newCard);
                }
            }
        });
        $(this).attr("data-offset", (parseInt($(this).attr("data-offset")) + 10) + "");
    });

    $("#clear-favorites").on("click", function () {
        localStorage.clear();
        numberOfFavorites = 0;
        populateFavorites(numberOfFavorites);
    });

    $(".container").on("click", ".save-to-favorites", function () {
        var targetId = "#" + $(this).attr("data-target");
        const htmlCode = $(targetId).html();
        localStorage.setItem("favorite" + numberOfFavorites, htmlCode);
        numberOfFavorites++;
        localStorage.setItem("numberOfFavorites", numberOfFavorites);
        populateFavorites(numberOfFavorites);
    });

    $(".container").on("click", ".clickable-gif", function () {
        if ($(this).attr("data-state") == "still") {
            $(this).attr("src", $(this).attr("data-animated"));
            $(this).attr("data-state", "animated");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });
});

