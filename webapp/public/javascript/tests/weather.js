var weather = {
    load: function() {
        var $this = this;
        this.getLocation(function(position) {

            $this.getWeather.apply($this, [position])
        });
    },

    getLocation: function(callback) {
        if (!callback) {
            return;
        }

        if (!!navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(callback);
        } else {
            document.getElementById('html-weather').innerHTML = 'Geolocation is not supported by this browser.';
        }
    },

    renderLocation: function(response, position) {
        document.getElementById('html-weather').getElementsByClassName('coordinates')[0].getElementsByClassName('details')[0].innerHTML = 'Latitude: ' + position.coords.latitude + '<br>Longitude: ' + position.coords.longitude;
        document.getElementById('html-weather').getElementsByClassName('coordinates')[0].getElementsByClassName('approx-location')[0].innerHTML = 'Timezone: ' + response.info.properties.timeZone + '<br>State: ' + response.info.properties.relativeLocation.properties.state;
    },

    renderDayForecast: function(period, lastUpdated) {
        var forecastCardContainer = forecastCard = document.createElement('div'),
            forecastCard = document.createElement('div'),
            forecastCardBody = document.createElement('div'),
            forecastCardImg = document.createElement('img'),
            forecastCardTitle = document.createElement('h5'),
            forecastCardSubTitle = document.createElement('h6'),
            forecastCardTempText = document.createElement('p'),
            forecastCardWindText = document.createElement('p'),
            forecastCardDetailsText = document.createElement('p'),
            forecastCardLastUpdatedContainer = document.createElement('blockquote'),
            forecastCardLastUpdatedText = document.createElement('footer');

        forecastCardContainer.classList = 'carousel-item';
        forecastCard.classList = 'card forecast-card';
        forecastCardBody.classList = 'card-body';
        forecastCardImg.classList = 'rounded float-end mb-2';
        forecastCardTitle.classList = 'card-title';
        forecastCardSubTitle.classList = 'card-subtitle mb-4 text-muted';
        forecastCardTempText.classList = 'card-text';
        forecastCardWindText.classList = 'card-text';
        forecastCardDetailsText.classList = 'card-text pb-4 text-sm';
        forecastCardLastUpdatedContainer.classList = 'blockquote text-end';
        forecastCardLastUpdatedContainer.style = 'font-size: 12px;';
        forecastCardLastUpdatedText.classList = 'blockquote-footer';

        forecastCardImg.src = period.icon;
        forecastCardTitle.textContent = period.name + '\'s Forecast';
        forecastCardSubTitle.textContent = period.shortForecast;
        forecastCardTempText.textContent = 'Temperature: ' + period.temperature + period.temperatureUnit + ' (' + period.temperatureTrend + ')';
        forecastCardWindText.textContent = 'Wind: ' + period.windSpeed + ' (' + period.windDirection + ')';
        forecastCardDetailsText.textContent = period.detailedForecast;
        forecastCardLastUpdatedText.textContent = 'Last Updated: ' + lastUpdated;

        forecastCardBody.appendChild(forecastCardImg);
        forecastCardBody.appendChild(forecastCardTitle);
        forecastCardBody.appendChild(forecastCardSubTitle);
        forecastCardBody.appendChild(forecastCardTempText);
        forecastCardBody.appendChild(forecastCardWindText);
        forecastCardBody.appendChild(forecastCardDetailsText);

        forecastCardLastUpdatedContainer.appendChild(forecastCardLastUpdatedText);
        forecastCardBody.appendChild(forecastCardLastUpdatedContainer);

        forecastCard.appendChild(forecastCardBody);
        forecastCardContainer.appendChild(forecastCard);

        document.getElementById('html-weather').getElementsByClassName('day-forecast-container')[0].getElementsByClassName('carousel-inner')[0].appendChild(forecastCardContainer);
    },

    getWeather: function(position) {
        var $this = this;

        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            var response = JSON.parse(this.responseText);
            console.log(response);
            $this.renderLocation(response, position);

            var lastUpdated = new Date(response.forecast.properties.updated).getDateTime();

            response.forecast.properties.periods.forEach(function(period) {
                $this.renderDayForecast(period, lastUpdated);
            });

            var weatherCarousel = document.getElementById('html-weather').getElementsByClassName('day-forecast-container')[0].getElementsByClassName('carousel')[0];

            weatherCarousel.getElementsByClassName('carousel-item')[0].classList += ' active';

            var carousel = new bootstrap.Carousel(weatherCarousel, {
                interval: 10000,
                wrap: false
            });
        };

        xhttp.open('GET', '/weather/info/' + position.coords.latitude + '/' + position.coords.longitude, true);
        xhttp.send();

    }
};

window['weather'] = weather;