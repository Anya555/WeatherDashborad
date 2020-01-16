$(document).ready(function () {

    // declaring my personal api key  as a global variable so I can use it to make multiple ajax calls
    var appId = "4711f10374bfd72a56667451d010a86c";

    // declaring all query urls needed for making ajax calls
    var queryURL = "https://api.openweathermap.org/data/2.5/weather";
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast";
    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi";


    var cityList = [];
   
    // storing searched cities list into local storage so it stays on page after reloading it
    var updateCityList = function(){
        localStorage.setItem("cityList", JSON.stringify(cityList));
    }


   // dynamically generating buttons to display  city search history
    var renderCityList = function(){
        var textBlock = $("div#city-list");
        textBlock.html("").addClass("col-2 text-block");
        
        if( cityList.length ){
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
    var getFromLocalStorage = function(){
        if( localStorage.getItem("cityList") ){
            cityList = JSON.parse(localStorage.getItem("cityList"));
        }
        console.log(cityList);
    }

   
    // making an ajax call for a current day weather query 
    var lookupCity = function (city) {
        if( cityList.indexOf(city) === -1 ){
            console.log("adding city: " + city);
            cityList.push(city);
            updateCityList();
        }

        console.log("lookup");

        // clearing previous content
        $("#current-city").html("");
        $("#five-day").html("");

        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                q: city,
                APPID: appId,
                units: "imperial" // For temperature in Fahrenheit use units=imperial
            }
        }).then(function (response) {
            console.log(response);

            
            // displaying the city that user is searching for    
            var h1 = $("<h1>");
            h1.text(response.name);
            $("#current-city").append(h1);

            var icon = $("<img>");
            icon.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            $("#current-city").append(icon);

            console.log(icon);

            // temperature
            var li1 = $("<li>");
            li1.addClass("li1");
            li1.text("Temperature: " + response.main.temp + " F");
            li1.val(response.main.temp);
            $("#current-city").append(li1);

            // humidity
            var li2 = $("<li>");
            li2.addClass("li2");
            li2.text("Humidity: " + response.main.humidity + " %");
            li2.val(response.main.humidity);
            $("#current-city").append(li2);

            // wind speed
            var li3 = $("<li>");
            li3.addClass("li3");
            li3.text("Wind speed: " + response.wind.speed + " MPH");
            li3.val(response.wind.speed);
            $("#current-city").append(li3);

            // making an ajax call to get data for uv index
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

                // current day. using prepend to move it to the top   
                var p = $("<p>");
                console.log(resp.date_iso.split("T")); 
                p.text(resp.date_iso.split("T")[0]);  //using split method, so the hour doesn't get displayed
                $("#current-city").prepend(p);

            });

            // making  an ajax call to get data for 5 day forecast

            $.ajax({
                url: fiveDayURL,
                method: "GET",
                data: {
                    q: city,
                    APPID: appId,
                    units: "imperial" // For temperature in Fahrenheit use units=imperial
                }
            }).then(function (result) {
                console.log(result);

                // looping through list array. it returns  40 objects:
                // 5 days forecast for every 3 hours

                for (var i = 0; i < 8; i++) {
                    var day = result.list[i * 8];

                    // making divs as placeholders to display received data and adding to them in style.css file
                    var display = $("<div>");
                    display.addClass("display");

                    //  date
                    var p = $("<p>");
                    console.log(day.dt_txt.split(" "));
                    p.text(day.dt_txt.split(" ")[0]); //using split method, so the hour doesn't get displayed
                    display.append(p);
                    p.addClass("p");
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

    // adding an event handler on a search button
    $("#search-button").on("click", function (e) {
        e.preventDefault();
        var city = $("#search-line").val().trim();
        lookupCity(city);
    });

      // adding an event handler on a city history buttons
    $(document).on("click", "button.btn", function (e) {
        e.preventDefault();
        var attrCity = $(this).attr("city-name");
        lookupCity(attrCity);
    });

    getFromLocalStorage();
    renderCityList();
});