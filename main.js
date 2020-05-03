$(document).ready(function () {

    var appId = "4711f10374bfd72a56667451d010a86c";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather";
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast";
    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi";

    var cityList = [];
    // moment.js
    var currentDay = moment().format('dddd');

    userLocationWeather();
    // getting user geolocation
    function userLocationWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (resp) {
                var lat = resp.coords.latitude;
                var lon = resp.coords.longitude;
                getWeather(lat, lon);
            });
        } else {
            alert("Geolocation is not supported by this browser, please search weather by the city name");
        }
    }

    //  user's geolocation weather
    function getWeather(lat, lon) {
        // current weather
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                APPID: appId,
                lat: lat,
                lon: lon,
                units: "imperial", // For temperature in Fahrenheits 
            }
        }).then(function (response) {
            console.log(response);

            // current date
            var p = $("<p>");
            p.text(currentDay);
            p.addClass("city");
            $("#current-city").prepend(p);

            // user's location name
            var h4 = $("<h4>");
            h4.text(response.name);
            $("#current-city").append(h4);

            // weather icon
            var icon = $("<img>");
            icon.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            $("#current-city").append(icon);

            // temperature
            var li1 = $("<li>");
            li1.text("Temperature: " + (response.main.temp).toFixed(0) + "°F");
            li1.addClass("temp");
            $("#current-city").append(li1);

            // humidity
            var li2 = $("<li>");
            li2.text("Humidity: " + response.main.humidity + "%");
            $("#current-city").append(li2);

            // wind speed
            var li3 = $("<li>");
            li3.text("Wind speed: " + (response.wind.speed).toFixed(0) + " MPH");
            li3.addClass("li3");
            $("#current-city").append(li3);
        });


        //  5 day forecast
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
            // console.log(result);

            var h3 = $("<h3>");
            h3.text("Five Day Forecast");
            $(".heading").append(h3);

            for (var i = 0; i < 8; i++) {
                var day = result.list[i * 8];

                var display = $("<div>");
                display.addClass("col-md-2 display");

                //  date
                var p = $("<p>");
                let m = moment(day.dt_txt.split(" ")[0]).format('dddd');
                p.text(m);
                display.append(p);
                $("#five-day").append(display);

                //  weather icon
                var image = $("<img>");
                image.attr("src", "https://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png");
                display.append(image);
                $("#five-day").append(display);

                // temperature
                var p = $("<p>");
                p.text("Temp: " + (day.main.temp).toFixed(0) + "°F");
                display.append(p);
                p.addClass("temp");
                $("#five-day").append(display);

                // humidity
                var p = $("<p>");
                p.text("Humidity: " + day.main.humidity + "%");
                display.append(p);
                $("#five-day").append(display);
            }
        });
    }

    // searcher city list
    var renderCityList = function () {
        var textBlock = $("div#city-list");
        textBlock.html("").addClass("text-block");

        if (cityList.length) {
            // console.log(cityList);
            for (var i = 0; i < cityList.length; i++) {

                var button = $("<button>");
                button.addClass("col-10 btn");
                button.attr("city-name", cityList[i]);
                button.text(cityList[i]);
                $("div#city-list").append(button);

                // city delete button
                var del = $("<button>");
                del.text("x");
                del.attr("city-name", cityList[i]);
                del.addClass("col-1 delete");
                $("div#city-list").append(del);
            }
        }
    }

    var updateCityList = function () {
        localStorage.setItem("cityList", JSON.stringify(cityList));
    }

    var getFromLocalStorage = function () {
        if (localStorage.getItem("cityList")) {
            cityList = JSON.parse(localStorage.getItem("cityList"));
        }
    }

    //----------------- searched city weather------------//

    var lookupCity = function (city) {
        // adding searched city to a list
        if (cityList.indexOf(city) === -1) {
            // console.log("adding city: " + city);
            cityList.push(city);
            updateCityList();
        }

        // clearing previous content
        $("#current-city").html("");
        $("#five-day").html("");
        $(".heading").html("");

        //  current day weather 
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                q: city,
                APPID: appId,
                units: "imperial" // For temperature in Fahrenheits 
            }
        }).then(function (response) {
            // console.log(response);

            // city name   
            var h4 = $("<h4>");
            h4.text(response.name);
            h4.addClass("city");
            $("#current-city").append(h4);

            // weather icon
            var icon = $("<img>");
            icon.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            $("#current-city").append(icon);

            // temperature
            var li1 = $("<li>");
            li1.addClass("li1");
            li1.text("Temperature: " + (response.main.temp).toFixed(0) + "°F");
            li1.addClass("temp");
            $("#current-city").append(li1);

            // humidity
            var li2 = $("<li>");
            li2.text("Humidity: " + response.main.humidity + "%");
            $("#current-city").append(li2);

            // wind speed
            var li3 = $("<li>");
            li3.text("Wind speed: " + (response.wind.speed).toFixed(0) + " MPH");
            $("#current-city").append(li3);

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

            // 5 day forecast
            $.ajax({
                url: fiveDayURL,
                method: "GET",
                data: {
                    q: city,
                    APPID: appId,
                    units: "imperial" // For temperature in Fahrenheits
                }
            }).then(function (result) {
                // console.log(result);

                var h3 = $("<h3>");
                h3.text("Five Day Forecast")
                $(".heading").append(h3);


                for (var i = 0; i < 8; i++) {
                    var day = result.list[i * 8];

                    var display = $("<div>");
                    display.addClass("col-md-2 display");

                    //  date
                    var p = $("<p>");
                    let m = moment(day.dt_txt.split(" ")[0]).format('dddd');
                    p.text(m);
                    display.append(p);
                    $("#five-day").append(display);

                    //  weather icon
                    var image = $("<img>");
                    image.attr("src", "https://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png");
                    display.append(image);
                    $("#five-day").append(display);

                    // temperature
                    var p = $("<p>");
                    p.text("Temp: " + (day.main.temp).toFixed(0) + "°F");
                    display.append(p);
                    p.addClass("temp");
                    $("#five-day").append(display);

                    // humidity
                    var p = $("<p>");
                    p.text("Humidity: " + day.main.humidity + "%");
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

    // displaying weather for each city in a list on click
    $(document).on("click", "button.btn", function (e) {
        e.preventDefault();
        var attrCity = $(this).attr("city-name");
        lookupCity(attrCity);
    });

    // delete button for city
    $(document).on("click", "button.delete", function (e) {
        e.preventDefault();

        // current city list
        updateCityList(cityList);
        // console.log(cityList);

        // city name that needs to be deleted
        var attrCity = $(this).attr("city-name");
        // console.log(attrCity);

        // removing city from array
        cityList = cityList.filter(idx => idx !== attrCity);
        // console.log(cityList);

        localStorage.setItem("cityList", JSON.stringify(cityList));
        renderCityList(cityList);
    });

    // converting farenheits to celcius 
    $(".celcius").on("click", function (e) {
        e.preventDefault();
        
        let temp = $(".temp").text();
        temp = temp.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g);
        let cTemp = temp.map(idx => Math.round((idx - 32) / 1.8)); // converts farenheits to celcius 

        temp.forEach((val, idx) => {
            let selector = $(".temp");
            selector = selector[idx];
            $(selector).text("Temp: " + cTemp[idx] + "°C");
        })
    });

    //  converting celcius back to farenheits
    $(".farenheits").on("click", function (e) {
        e.preventDefault();
       
        let temp = $(".temp").text();
        temp = temp.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g);
        let fTemp = temp.map(idx=> Math.round(idx * 9 / 5 + 32));
        
        temp.forEach((val, idx) => {
            let selector = $(".temp");
            selector = selector[idx];
            $(selector).text("Temp: " + fTemp[idx] + "°F");
        })
    });

    getFromLocalStorage();
    renderCityList();
});