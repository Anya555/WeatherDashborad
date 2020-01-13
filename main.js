$(document).ready(function () {

    var appId = "4711f10374bfd72a56667451d010a86c";

    for (var i = 0; i < 8; i++) {

        var textBlock = $("<div>");
        textBlock.addClass("text-block");

        var textarea = $("<textarea>");
        textBlock.append(textarea);

        $("#city-area").append(textBlock);
    }

    var getInput = function () {
        var search = $("#search-line").val().trim();
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast"

        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                q: search,
                APPID: appId,
                units: "imperial"
            }
        }).then(function (response) {

            var h1 = $("<h1>");
            h1.text(response.city.name);
           
            // var p = $("<p>");
            // p.text(response.date_iso);
            $("#current-city").append(h1);
            // $("#current-city").append(p);

        
            var li1 = $("<li>");
            li1.text("Temperature: " + response.list[0].main.temp + " F");
            li1.val(response.list[0].main.temp);
            $("#current-city").append(li1);
            

            var li2 = $("<li>");
            li2.text("Humidity: " + response.list[i].main.humidity + " %");
            li2.val(response.list[i].main.humidity);
            $("#current-city").append(li2);

            var li3 = $("<li>");
            li3.text("Wind speed: " + response.list[i].wind.speed + " MPH");
            li3.val(response.list[i].wind.speed);
            $("#current-city").append(li3);

            // Do second API call
            var cityLon = response.city.coord.lon;
            var cityLat = response.city.coord.lat;
            var uvUrl = "http://api.openweathermap.org/data/2.5/uvi";

            $.ajax({
                url: uvUrl,
                method: "GET",
                data: {
                    lat: cityLat,
                    lon: cityLon,
                    APPID: "4711f10374bfd72a56667451d010a86c"
                }
            }).then(function (resp) {
                console.log(resp);
                var li4 = $("<li>");
                li4.text("UV: " + resp.value);
                $("#current-city").append(li4);
            });
        });
    }


    $("#search-button").on("click", function (e) {
        e.preventDefault();
        getInput();
    });

});