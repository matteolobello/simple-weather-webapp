const BASE_URL = "https://geocoder.api.here.com/6.2/geocode.json" + "?app_id=" + HERE_WE_GO_APP_ID + "&app_code=" + HERE_WE_GO_APP_CODE + "&gen=8&searchtext="

const inputElement = document.getElementById("query")
const resultElement = document.getElementById("result")

inputElement.addEventListener('input', function(evt) {
    searchAndDispatch(this.value);
});

function saveCookies(name, lat, lon) {
    localStorage.setItem("name", name)
    localStorage.setItem("lat", lat)
    localStorage.setItem("lon", lon)

    console.log(localStorage)

    window.location.href = "../weather/index.html"
}

function searchAndDispatch(query) {
    resultElement.innerHTML = ""

    var body = makeHttpRequestAsync(BASE_URL + query, function(body) {
        var jsonObj = JSON.parse(body);
        var locationsJsonArray = jsonObj.Response.View[0].Result

        var locations = []
        for (var i = 0; i < locationsJsonArray.length; i++) {
            var locationJsonObj = locationsJsonArray[i]

            locations.push({
                name: locationJsonObj.Location.Address.Label,
                lat: locationJsonObj.Location.DisplayPosition.Latitude.toString(),
                lon: locationJsonObj.Location.DisplayPosition.Longitude.toString(),
            })
        }

        for (var i = 0; i < locations.length; i++) {
            var location = locations[i]

            resultElement.innerHTML += "<li onClick=\"saveCookies(" + "'" + location.name + "'" + "," + "'" + location.lat + "'" + "," + "'" + location.lon + "'" + ")\">" + location.name + "</li>"
        }
    })
}