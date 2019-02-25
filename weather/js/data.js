function loadWeatherForecast(lat, lon, callback) {
    var body = makeHttpRequestAsync(BASE_URL + "&lat=" + lat + "&lon=" + lon, function(body) {
        var jsonObj = JSON.parse(body);
        var listJsonArray = jsonObj.list;

        var weatherForecast = [];

        for (var i = 0; i < listJsonArray.length; i++) {
            var weatherJsonObj = listJsonArray[i];

            var time = weatherJsonObj.dt_txt;

            var tempAverage = weatherJsonObj.main.temp;
            var tempMin = weatherJsonObj.main.temp_min;
            var tempMax = weatherJsonObj.main.temp_max;
            var pressure = weatherJsonObj.main.pressure;
            var humidity = weatherJsonObj.main.humidity;

            var weatherTitle = weatherJsonObj.weather[0].main;
            var weatherDescription = weatherJsonObj.weather[0].description;
            var iconId = weatherJsonObj.weather[0].id;

            var windSpeed = weatherJsonObj.wind.speed;

            weatherForecast.push({
                time: time,
                tempAverage: tempAverage,
                tempMin: tempMin,
                tempMax: tempMax,
                pressure: pressure,
                humidity: humidity,
                iconId: iconId,
                weatherTitle: weatherTitle,
                weatherDescription: weatherDescription,
                windSpeed: windSpeed
            });
        }

        callback(weatherForecast)
    });
}