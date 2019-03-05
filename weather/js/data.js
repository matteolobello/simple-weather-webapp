function loadWeatherForecast(lat, lon, callback) {
    makeHttpRequestAsync(BASE_URL + "&lat=" + lat + "&lon=" + lon, function(body) {
        let jsonObj = JSON.parse(body);
        let listJsonArray = jsonObj.list;

        let weatherForecast = [];

        for (let i = 0; i < listJsonArray.length; i++) {
            let weatherJsonObj = listJsonArray[i];

            let time = weatherJsonObj.dt_txt;

            let tempAverage = weatherJsonObj.main.temp;
            let tempMin = weatherJsonObj.main.temp_min;
            let tempMax = weatherJsonObj.main.temp_max;
            let pressure = weatherJsonObj.main.pressure;
            let humidity = weatherJsonObj.main.humidity;

            let weatherTitle = weatherJsonObj.weather[0].main;
            let weatherDescription = weatherJsonObj.weather[0].description;
            let iconId = weatherJsonObj.weather[0].id;

            let windSpeed = weatherJsonObj.wind.speed;

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