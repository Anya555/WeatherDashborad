$(document).ready(function () {

    // declaring my personal api key as a global variable
    var appId = "4711f10374bfd72a56667451d010a86c";

    // dinamically creating an input area for city search
    for (var i = 0; i < 8; i++) {

        var textBlock = $("<div>");
        textBlock.addClass("text-block");

        var textarea = $("<textarea>");
        textBlock.append(textarea);

        $("#city-area").append(textBlock);
    }

    // making an ajax call for a current day weather query and appending received data into browser
    var getInput = function () {
        var search = $("#search-line").val().trim();
        var queryURL = "http://api.openweathermap.org/data/2.5/weather";


        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                q: search,
                APPID: appId,
                units: "imperial"
            }
        }).then(function (response) {
            console.log(response);

            var h1 = $("<h1>");
            h1.text(response.name);
            var icon = $("<img>");
            icon.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            $("#current-city").append(h1);
            $("#current-city").append(icon);

            console.log(icon);


            var li1 = $("<li>");
            li1.addClass("li1");
            li1.text("Temperature: " + response.main.temp + " F");
            li1.val(response.main.temp);
            $("#current-city").append(li1);


            var li2 = $("<li>");
            li2.addClass("li2");
            li2.text("Humidity: " + response.main.humidity + " %");
            li2.val(response.main.humidity);
            $("#current-city").append(li2);

            var li3 = $("<li>");
            li3.addClass("li3");
            li3.text("Wind speed: " + response.wind.speed + " MPH");
            li3.val(response.wind.speed);
            $("#current-city").append(li3);

            // making an ajax call to get data for uv index
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;
            var uvUrl = "http://api.openweathermap.org/data/2.5/uvi";

            $.ajax({
                url: uvUrl,
                method: "GET",
                data: {
                    lat: cityLat,
                    lon: cityLon,
                    APPID: appId
                }
            }).then(function (resp) {
                console.log(resp);
                var li4 = $("<li>");
                li4.css("background-color", "red");
                li4.addClass("li4");
                li4.text("UV: " + resp.value);
                $("#current-city").append(li4);

                var p = $("<p>"); 
                console.log( resp.date_iso.split("T") );
                p.text(resp.date_iso.split("T")[0]);
                $("#current-city").prepend(p);

            });

            // making  an ajax call to get data for 5 day forecat

            var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast";
            $.ajax({
                url: fiveDayURL,
                method: "GET",
                data: {
                    q: search,
                    APPID: appId,
                    units: "imperial"
                }
            }).then(function (result) {
                console.log(result);

                
                for (var i = 0; i < 8; i++) {
                    var day = result.list[i * 8];

                    var display = $("<div>");
                    display.addClass("display");

                    var p = $("<p>");
                    console.log(day.dt_txt.split(" "));
                    p.text(day.dt_txt.split(" ")[0]);
                    display.append(p);
                    $("#five-day").append(display);
                    console.log(display);

                    var image = $("<img>");
                    image.attr("src", "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png");
                    display.append(image);
                    $("#five-day").append(display);


                    var p = $("<p>");
                    p.text("Temp: " + day.main.temp + " F");
                    display.append(p);
                    $("#five-day").append(display);


                    var p = $("<p>");
                    p.text("Humidity: " + day.main.humidity + " %");
                    display.append(p);
                    $("#five-day").append(display);
                }

            });
        });
    }


    $("#search-button").on("click", function (e) {
        e.preventDefault();
        getInput();
    });

});