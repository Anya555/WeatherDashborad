$(document).ready(function () {

    userLocationWeather();
    //  api key  as a global variable so I can use it to make multiple ajax calls
    var appId = "4711f10374bfd72a56667451d010a86c";

    // all query urls needed for making ajax calls
    var queryURL = "https://api.openweathermap.org/data/2.5/weather";
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast";
    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi";

    var cityList = [];
    // moment.js library to display current day
    var currentDay = moment().format('dddd');

    // getting user geolocation
    function userLocationWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                // console.log(lat);
                // console.log(lon);
                getWeather(lat, lon);
            });
        } else {
            alert("Geolocation is not supported by this browser, please search weather by the city name");
        }
    }


    // getting weather for user's location
    function getWeather(lat, lon) {

    // current weather
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                APPID: appId,
                lat: lat,
                lon: lon,
                units: "imperial" // For temperature in Fahrenheits 
            }
        }).then(function (response) {
            console.log(response);

            // current date using moment.js 
            var h6 = $("<h6>");
            h6.text(currentDay);
            $("#current-city").prepend(h6);

            // user's location name
            var h3 = $("<h3>");
            h3.text(response.name);
            $("#current-city").append(h3);

            // weather icon
            var icon = $("<img>");
            icon.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            $("#current-city").append(icon);

            // temperature
            var li1 = $("<li>");
            li1.text("Temperature: " + response.main.temp + " F");
            li1.val(response.main.temp);
            $("#current-city").append(li1);

             // humidity
             var li2 = $("<li>");
             li2.text("Humidity: " + response.main.humidity + " %");
             li2.val(response.main.humidity);
             $("#current-city").append(li2);
 
             // wind speed
             var li3 = $("<li>");
             li3.text("Wind speed: " + response.wind.speed + " MPH");
             li3.val(response.wind.speed);
             $("#current-city").append(li3);
        });

        // ajax call to get data for 5 day forecast

        $.ajax({
            url: fiveDayURL,
            method: "GET",
            data: {
                lat: lat,
                lon: lon,
                APPID: appId,
                units: "imperial" // For temperature in Fahrenheits
            }
        }).then(function (result) {
            console.log(result);

            // looping through list array. it returns  40 objects:
            // 5 days forecast for every 3 hours
            var h2 = $("<h2>");
            h2.text("Five Day Forecast")
            $(".heading").append(h2);


            for (var i = 0; i < 8; i++) {
                var day = result.list[i * 8];

                // placeholders for 5 day forecast
                var display = $("<div>");
                display.addClass("col-md-2 display");

                //  date
                var p = $("<p>");
                console.log(day.dt_txt.split(" "));
                p.text(day.dt_txt.split(" ")[0]); //using split method, so the hour doesn't get displayed
                display.append(p);
                $("#five-day").append(display);
                console.log(display);

                //  weather icon
                var image = $("<img>");
                image.attr("src", "https://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png");
                display.append(image);
                $("#five-day").append(display);

                // temperature
                var p = $("<p>");
                p.text("Temp: " + day.main.temp + " F");
                display.append(p);
                $("#five-day").append(display);

                // humidity
                var p = $("<p>");
                p.text("Humidity: " + day.main.humidity + " %");
                display.append(p);
                $("#five-day").append(display);
            }

        });
    }


    // storing searched cities list into local storage 
    var updateCityList = function () {
        localStorage.setItem("cityList", JSON.stringify(cityList));
    }


    // dynamically generating buttons to display  city search history
    var renderCityList = function () {
        var textBlock = $("div#city-list");
        textBlock.html("").addClass("col-12 text-block");

        if (cityList.length) {
            console.log(cityList);
            for (var i = 0; i < cityList.length; i++) {
                var button = $("<button>");
                button.addClass("btn");
                button.attr("city-name", cityList[i]);
                button.text(cityList[i]);
                $("div#city-list").append(button);
            }

        }
    }

    // getting data from local storage
    var getFromLocalStorage = function () {
        if (localStorage.getItem("cityList")) {
            cityList = JSON.parse(localStorage.getItem("cityList"));
        }
        console.log(cityList);
    }

    // displaying weather for a city that user is searching for
    // adding searched city to a list
    var lookupCity = function (city) {
        if (cityList.indexOf(city) === -1) {
            console.log("adding city: " + city);
            cityList.push(city);
            updateCityList();
        }

        console.log("lookup");

        // clearing previous content
        $("#current-city").html("");
        $("#five-day").html("");
        $(".heading").html("");

        //  ajax call for a current day weather query 

        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                q: city,
                APPID: appId,
                units: "imperial" // For temperature in Fahrenheits 
            }
        }).then(function (response) {
            console.log(response);

            // displaying the city that user is searching for    
            var h3 = $("<h3>");
            h3.text(response.name);
            $("#current-city").append(h3);

            var icon = $("<img>");
            icon.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            $("#current-city").append(icon);

            // temperature
            var li1 = $("<li>");
            li1.addClass("li1");
            li1.text("Temperature: " + response.main.temp + " F");
            li1.val(response.main.temp);
            $("#current-city").append(li1);


            // humidity
            var li2 = $("<li>");
            li2.text("Humidity: " + response.main.humidity + " %");
            li2.val(response.main.humidity);
            $("#current-city").append(li2);

            // wind speed
            var li3 = $("<li>");
            li3.text("Wind speed: " + response.wind.speed + " MPH");
            li3.val(response.wind.speed);
            $("#current-city").append(li3);

            // ajax call to get data for uv index
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

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

                // uv index    
                var li4 = $("<li>");
                li4.css("background-color", "red");
                li4.addClass("li4");
                li4.text("UV: " + resp.value);
                $("#current-city").append(li4);

                var h6 = $("<h6>");
                h6.text(currentDay);
                $("#current-city").prepend(h6);
            });

            // ajax call to get data for 5 day forecast

            $.ajax({
                url: fiveDayURL,
                method: "GET",
                data: {
                    q: city,
                    APPID: appId,
                    units: "imperial" // For temperature in Fahrenheits
                }
            }).then(function (result) {
                console.log(result);

                // looping through list array. it returns  40 objects:
                // 5 days forecast for every 3 hours
                var h2 = $("<h2>");
                h2.text("Five Day Forecast")
                $(".heading").append(h2);


                for (var i = 0; i < 8; i++) {
                    var day = result.list[i * 8];


                    // placeholders for 5 day forecast
                    var display = $("<div>");
                    display.addClass("col-md-2 display");

                    //  date
                    var p = $("<p>");
                    console.log(day.dt_txt.split(" "));
                    p.text(day.dt_txt.split(" ")[0]); //using split method, so the hour doesn't get displayed
                    display.append(p);
                    $("#five-day").append(display);
                    console.log(display);

                    //  weather icon
                    var image = $("<img>");
                    image.attr("src", "https://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png");
                    display.append(image);
                    $("#five-day").append(display);

                    // temperature
                    var p = $("<p>");
                    p.text("Temp: " + day.main.temp + " F");
                    display.append(p);
                    $("#five-day").append(display);

                    // humidity
                    var p = $("<p>");
                    p.text("Humidity: " + day.main.humidity + " %");
                    display.append(p);
                    $("#five-day").append(display);
                }

            });
        });

        renderCityList();
    }

    // search button
    $("#search-button").on("click", function (e) {
        e.preventDefault();
        var city = $("#search-line").val().trim();
        $("#search-line").val("");
        lookupCity(city);
    });

    //history buttons
    $(document).on("click", "button.btn", function (e) {
        e.preventDefault();
        var attrCity = $(this).attr("city-name");
        lookupCity(attrCity);
    });

    getFromLocalStorage();
    renderCityList();
});