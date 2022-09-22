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

    getWeather: function(position) {
        var $this = this;

        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            var response = JSON.parse(this.responseText);

            $this.renderLocation(response, position);

            var lastUpdated = new Date(response.forecast.properties.updated).getDateTime();

            response.forecast.properties.periods.forEach(function(period, i) {
                $this.renderDayForecast(period, lastUpdated, i);
            });

            $this.showOtherTemperatureBindings();

            var weatherCarousel = document.getElementById('html-weather').getElementsByClassName('day-forecast-container')[0].getElementsByClassName('carousel')[0];

            weatherCarousel.getElementsByClassName('carousel-item')[0].classList += ' active';

            var carousel = new bootstrap.Carousel(weatherCarousel, {
                interval: 10000
            });

            Promise.all($this.waitForVideosDataLoadBindings()).then(function() {
                document.getElementById('all-forecast-container').style = '';
            });
        };

        xhttp.open('GET', '/weather/info/' + position.coords.latitude + '/' + position.coords.longitude, true);
        xhttp.send();

    },

    getWeatherBackgroundStyles: function(desc) {
        var styles = { src: '/public/videos/weather/', text: 'text-light' };

        if (/snow/igm.test(desc)) {
            styles.src += 'snow.mp4';
        } else if (/storm/igm.test(desc)) {
            styles.src += 'stormy.mp4';
        } else if (/sun/igm.test(desc)) {
            styles.src += 'sunny.mp4';
        } else if (/clear/igm.test(desc)) {
            styles.src += 'clear.mp4';
        } else if (/cloud/igm.test(desc)) {
            styles.src += 'cloudy.mp4';
        } else if (/(rain)|(shower)/igm.test(desc)) {
            styles.src += 'rainy.mp4';
        } else {
            styles.src += 'cloudy.mp4';
        }

        return styles;
    },

    convertToFarenheit: function(cel) {
        return Math.round(((cel * 9 / 5) + 32)).toString();
    },

    convertToCelsius: function(far) {
        return Math.round(((far - 32) * 5 / 9)).toString();
    },

    showOtherTemperatureBindings: function() {
        var showOtherTempElem = document.getElementsByClassName('show-other-temp');

        for (var i = 0; showOtherTempElem.length - 1 >= i; i++) {
            var thisShowTempElem = showOtherTempElem[i];

            thisShowTempElem.addEventListener('click', function() {
                if (this.textContent == 'Show Celcius') {
                    this.textContent = 'Show Farenheit';
                    this.closest('.forecast-card').getElementsByClassName('cel-temp-text')[0].style = '';
                    this.closest('.forecast-card').getElementsByClassName('far-temp-text')[0].style = 'display: none;';
                } else {
                    this.textContent = 'Show Celcius';
                    this.closest('.forecast-card').getElementsByClassName('cel-temp-text')[0].style = 'display: none;';
                    this.closest('.forecast-card').getElementsByClassName('far-temp-text')[0].style = '';
                }
            });
        }
    },

    waitForVideosDataLoadBindings: function() {
        var videoElems = document.getElementsByTagName('video');
        var allVideoPromises = [];

        for (var i = 0; videoElems.length - 1 >= i; i++) {
            var thisVideoElem = videoElems[i];

            console.log('Video', thisVideoElem.getElementsByTagName('source')[0].src);
            var videoPromise = new Promise(function(resolve, reject) {
                thisVideoElem.addEventListener('loadeddata', function() {
                    console.log('Resolved', this.getElementsByTagName('source')[0].src);
                    resolve();
                }, false);
            });

            allVideoPromises.push(videoPromise);
        }

        return allVideoPromises;
    },

    renderLocation: function(response, position) {
        document.getElementById('html-weather').getElementsByClassName('coordinates')[0].getElementsByClassName('details')[0].innerHTML = 'Latitude: ' + position.coords.latitude + '<br>Longitude: ' + position.coords.longitude;
        document.getElementById('html-weather').getElementsByClassName('coordinates')[0].getElementsByClassName('approx-location')[0].innerHTML = 'Timezone: ' + response.info.properties.timeZone + '<br>State: ' + response.info.properties.relativeLocation.properties.state;
    },

    renderDayForecast: function(period, lastUpdated, i) {
        var forecastCardContainer = document.createElement('div'),
            forecastWeatherBackgroundVideo = document.createElement('video'),
            forecastWeatherBackgroundSource = document.createElement('source'),
            forecastCard = document.createElement('div'),
            forecastCardBody = document.createElement('div'),
            forecastCardImg = document.createElement('img'),
            forecastCardTitle = document.createElement('h5'),
            forecastCardSubTitle = document.createElement('h6'),
            forecastCardTempText = document.createElement('p'),
            forecastCardFarText = document.createElement('span'),
            forecastCardCelText = document.createElement('span'),
            forecastCardWindText = document.createElement('p'),
            forecastCardDetailsText = document.createElement('p'),
            forecastCardLastUpdatedContainer = document.createElement('blockquote'),
            forecastCardLastUpdatedText = document.createElement('footer'),
            forecastCardShowOtherTempBtn = document.createElement('a');

        var temperatureTrendText = !!period.temperatureTrend ? period.temperatureTrend.capitalizeFirstLetter() : 'No trend',
            farTemperatureText = !!period.temperatureUnit && period.temperatureUnit.toLocaleLowerCase().trim() == 'f' ? period.temperature : this.convertToFarenheit(period.temperature),
            celTemperatureText = !!period.temperatureUnit && period.temperatureUnit.toLocaleLowerCase().trim() == 'c' ? period.temperature : this.convertToCelsius(period.temperature);

        forecastWeatherBackgroundVideo.autoplay = true;
        forecastWeatherBackgroundVideo.loop = true;
        forecastWeatherBackgroundVideo.muted = true;
        forecastWeatherBackgroundVideo.controls = false;
        forecastWeatherBackgroundSource.type = 'video/mp4';

        var weatherBackgroundStyles = this.getWeatherBackgroundStyles(period.shortForecast);

        forecastWeatherBackgroundSource.src = weatherBackgroundStyles.src;

        forecastCardContainer.classList = 'carousel-item';
        forecastWeatherBackgroundVideo.classList = 'background-video';
        forecastCard.classList = 'card forecast-card';
        forecastCardBody.classList = 'card-body text-light text-shadow';
        forecastCardImg.classList = 'rounded float-end mb-2';
        forecastCardTitle.classList = 'card-title';
        forecastCardSubTitle.classList = 'card-subtitle mb-4 text-muted';
        forecastCardTempText.classList = 'card-text';
        forecastCardFarText.classList = 'far-temp-text';
        forecastCardCelText.classList = 'cel-temp-text';
        forecastCardWindText.classList = 'card-text';
        forecastCardDetailsText.classList = 'card-text pb-4 text-sm';
        forecastCardLastUpdatedContainer.classList = 'blockquote text-end';
        forecastCardLastUpdatedText.classList = 'blockquote-footer';
        forecastCardShowOtherTempBtn.classList = 'text-sm show-other-temp';

        forecastCardLastUpdatedContainer.style = 'font-size: 12px;';
        forecastCardCelText.style = 'display: none;';

        forecastCardShowOtherTempBtn.href = '#';

        forecastCardImg.src = period.icon;
        forecastCardTitle.textContent = period.name + '\'s Forecast';
        forecastCardSubTitle.textContent = period.shortForecast;
        forecastCardFarText.textContent = 'Temperature: ' + farTemperatureText + '°F (' + temperatureTrendText + ')';
        forecastCardCelText.textContent = 'Temperature: ' + celTemperatureText + '°C (' + temperatureTrendText + ')';
        forecastCardWindText.textContent = 'Wind: ' + period.windSpeed + ' (' + period.windDirection + ')';
        forecastCardDetailsText.textContent = period.detailedForecast;
        forecastCardLastUpdatedText.textContent = 'Last Updated: ' + lastUpdated;
        forecastCardShowOtherTempBtn.textContent = 'Show Celcius';

        forecastCardBody.appendChild(forecastCardImg);
        forecastCardBody.appendChild(forecastCardTitle);
        forecastCardBody.appendChild(forecastCardSubTitle);

        forecastCardTempText.appendChild(forecastCardFarText);
        forecastCardTempText.appendChild(forecastCardCelText);
        forecastCardTempText.appendChild(forecastCardShowOtherTempBtn);

        forecastCardBody.appendChild(forecastCardTempText);
        forecastCardBody.appendChild(forecastCardWindText);
        forecastCardBody.appendChild(forecastCardDetailsText);

        forecastCardLastUpdatedContainer.appendChild(forecastCardLastUpdatedText);
        forecastCardBody.appendChild(forecastCardLastUpdatedContainer);

        forecastWeatherBackgroundVideo.appendChild(forecastWeatherBackgroundSource);

        forecastCard.appendChild(forecastCardBody);
        forecastCard.appendChild(forecastWeatherBackgroundVideo);

        forecastCardContainer.appendChild(forecastCard);

        document.getElementById('html-weather').getElementsByClassName('day-forecast-container')[0].getElementsByClassName('carousel-inner')[0].appendChild(forecastCardContainer);
    }
};

window['weather'] = weather;