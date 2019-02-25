const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + OPENWEATHERMAP_KEY

const DEFAULT_LAT = "41.890251"
const DEFAULT_LON = "12.492373"
const DEFAULT_NAME = "Roma, Lazio, Italia"

var WINDOW_HEIGHT = window.innerHeight 
		|| document.documentElement.clientHeight 
		|| document.body.clientHeight

// Initialized inside onscroll function
var dayLabelElements = null

// Initialized in loadWeatherByLatLon function
var swipeWrapperElement = null
var loaderElement = null

// Fetch cached data
var locationName = localStorage.getItem("name")
var locationLat = localStorage.getItem("lat")
var locationLon = localStorage.getItem("lon")

if (locationName == null || locationLat == null || locationLon == null) {
    locationName = DEFAULT_NAME
    locationLat = DEFAULT_LAT
    locationLon = DEFAULT_LON
}

window.onscroll = function() {
    var scrollY = window.scrollY

    var scrollPercentage = scrollY * 200 / WINDOW_HEIGHT

    if (dayLabelElements == null || dayLabelElements.length == 0) {
        dayLabelElements = document.querySelectorAll(".page-top > .content > h1")
    }

    for (var i = 0; i < dayLabelElements.length; i++) {
        var newOpacity = parseFloat((100 - scrollPercentage) / 100).toFixed(1)
        dayLabelElements[i].style.opacity = newOpacity
    }
}

fetchAndDispatchWeatherForecast(locationName, locationLat, locationLon)

function fetchAndDispatchWeatherForecast(name, lat, lon) {
    loadWeatherForecast(lat, lon, function(weatherForecast) {
        const constWeatherForecast = weatherForecast

        if (swipeWrapperElement == null) {
            swipeWrapperElement = document.querySelector(".swiper-wrapper")
        }

        if (loaderElement == null) {
            loaderElement = document.querySelector(".loader")
        }

        fade({
            el: loaderElement,
            type: 'out',
        })

        setTimeout(function() {
            var groupedByDay = groupBy(constWeatherForecast, weather => weather.time.split(" ")[0])

            var baseDate = new Date()
            baseDate.setDate(baseDate.getDate() - 1)

            var counter = 0
            while (true) {
                counter++

                baseDate.setDate(baseDate.getDate() + 1)

                var dayAsString = baseDate.getFullYear() + "-" + addZeroIfNeeded(baseDate.getMonth() + 1) + "-" + baseDate.getDate()
                var weatherForecast = groupedByDay.get(dayAsString)
                if (weatherForecast == undefined) {
                    break
                }

                swipeWrapperElement.innerHTML += buildSwiperPageLayout(weatherForecast, counter)
            }

            new Swiper('.swiper-container', {
                direction: 'horizontal',
                grabCursor: true
            })
        }, 400)

        setTimeout(function() {
            fade({
                el: swipeWrapperElement,
                type: 'in'
            })
        }, 400)
    })
}

function buildSwiperPageLayout(weatherForecastForThatDay, id) {
    var h = "<div class='swiper-slide'>"
    h += "	<div class='page-top'>"

    if (id == 1)
        h += "   <h3 onClick='window.location.href = \"../location/index.html\"'>" + locationName + "</h3>"

    h += "       <div class='content'>"
    h += "		    <h1>" + getTitleByPageId(weatherForecastForThatDay[0], id) + "</h1>"
    h += "       </div>"
    h += "	</div>"
    h += "	<div class='page-bottom'>"
    h += "   	<div style='overflow-x: auto; width: 100vw'>"
    h += "			<table>"

    for (var i = 0; i < weatherForecastForThatDay.length; i++) {
        var weather = weatherForecastForThatDay[i]
        h += "			<tr>"
        h += "				<td>" + getFormattedTime(weather) + "</td>"
        h += "				<td>" + kelvinToCelsius(weather.tempAverage) + "°C" + "</td>"
        h += "				<td>" + weather.weatherDescription + "</td>"
        h += "				<td>" + "<i class='wi wi-owm-" + weather.iconId + "'></i></td>"
        h += "			</tr>"
    }

    h += "			</table>"
    h += "	    </div>"
    h += "	</div>"
    h += "</div>"
    return h
}

function getTitleByPageId(weather, id) {
    if (id == 1) {
        return "Today"
    } else if (id == 2) {
        return "Tomorrow"
    } else {
        return weather.time.split(" ")[0]
    }
}

function getFormattedTime(weather) {
    var time = weather.time.split(" ")[1]
    return time.split(":")[0] + ":" + time.split(":")[1]
}