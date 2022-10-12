var weather = {
    load: function() {
        var $this = this;
        /*
            Adjust document to user device height
        */
        var height = document.getElementsByTagName('html')[0].offsetHeight - document.getElementsByTagName('nav')[0].offsetHeight;
        document.getElementsByTagName('body')[0].style = 'height:' + height + 'px;';
        document.getElementById('header').style = 'display: none;';

        this.getLocation(function(position) {
            $this.getWeather.apply($this, [position]);
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
            $this.renderMenuForecastInfo(response.forecast.properties.periods[0], response.forecast.properties.periods);
            $this.renderDayForecast(response.forecast.properties.periods[0]);
            $this.changeWeatherDayBinding(response.forecast.properties.periods);

            document.getElementById('all-forecast-container').style = '';
        };

        xhttp.open('GET', '/weather/info/' + position.coords.latitude + '/' + position.coords.longitude, true);
        xhttp.send();

    },

    getWeatherBackgroundStyles: function(desc) {
        var styles = { class: '', text: 'text-light' };

        if (/snow/igm.test(desc)) {
            styles.class = 'weather-snow';
        } else if (/storm/igm.test(desc)) {
            styles.class = 'weather-stormy';
        } else if (/sun/igm.test(desc)) {
            styles.class = 'weather-sunny';
        } else if (/clear/igm.test(desc)) {
            styles.class = 'weather-clear';
        } else if (/cloud/igm.test(desc)) {
            styles.class = 'weather-cloudy';
        } else if (/hail/igm.test(desc)) {
            styles.class = 'weather-hail';
        } else if (/(rain)|(shower)/igm.test(desc)) {
            styles.class = 'weather-rainy';
        } else {
            styles.class = 'weather-cloudy';
        }

        return styles;
    },

    convertToFarenheit: function(cel) {
        return Math.round(((cel * 9 / 5) + 32)).toString();
    },

    convertToCelsius: function(far) {
        return Math.round(((far - 32) * 5 / 9)).toString();
    },

    renderMenuForecastInfo: function(period, periods) {
        var style = this.getWeatherBackgroundStyles(period.shortForecast);

        document.getElementById('root-container').classList = style.class + ' h-100';
        document.getElementById('root').classList = 'h-100';
        /*
            Create weather details
        */
        var row = document.createElement('div');
        row.classList = 'row mb-2';

        var weatherDetailedForecastLabelDiv = document.createElement('div'),
            weatherWindSpeedLabelDiv = document.createElement('div'),
            weatherWindDirectionLabelDiv = document.createElement('div'),
            weatherTempTrendLabelDiv = document.createElement('div');

        var weatherDetailedForecastDiv = document.createElement('div'),
            weatherWindSpeedDiv = document.createElement('div'),
            weatherWindDirectionDiv = document.createElement('div'),
            weatherTempTrendDiv = document.createElement('div');

        weatherDetailedForecastLabelDiv.classList = 'col-sm-6 text-light';
        weatherWindSpeedLabelDiv.classList = 'col-sm-6 text-light';
        weatherWindDirectionLabelDiv.classList = 'col-sm-6 text-light';
        weatherTempTrendLabelDiv.classList = 'col-sm-6 text-light';

        weatherDetailedForecastLabelDiv.textContent = 'Detailed Forecast';
        weatherWindSpeedLabelDiv.textContent = 'Wind Speed';
        weatherWindDirectionLabelDiv.textContent = 'Wind Direction';
        weatherTempTrendLabelDiv.textContent = 'Temperature Trend';

        weatherDetailedForecastDiv.classList = 'col-sm-6 text-light text-right text-sm';
        weatherWindSpeedDiv.classList = 'col-sm-6 text-light text-right text-sm';
        weatherWindDirectionDiv.classList = 'col-sm-6 text-light text-right text-sm';
        weatherTempTrendDiv.classList = 'col-sm-6 text-light text-right text-sm';

        weatherDetailedForecastDiv.textContent = period.detailedForecast;
        weatherWindSpeedDiv.textContent = period.windSpeed;
        weatherWindDirectionDiv.textContent = period.windDirection;
        weatherTempTrendDiv.textContent = period.temperatureTrend;

        var detailedForecastRow = row.cloneNode();
        detailedForecastRow.appendChild(weatherDetailedForecastLabelDiv);
        detailedForecastRow.appendChild(weatherDetailedForecastDiv);

        var windSpeedRow = row.cloneNode();
        windSpeedRow.appendChild(weatherWindSpeedLabelDiv);
        windSpeedRow.appendChild(weatherWindSpeedDiv);

        var windDirectionRow = row.cloneNode();
        windDirectionRow.appendChild(weatherWindDirectionLabelDiv);
        windDirectionRow.appendChild(weatherWindDirectionDiv);

        var tempTrendRow = row.cloneNode();
        tempTrendRow.appendChild(weatherTempTrendLabelDiv);
        tempTrendRow.appendChild(weatherTempTrendDiv);

        var weatherDetailsContainer = document.getElementById('weather-details');

        weatherDetailsContainer.innerHTML = '';
        weatherDetailsContainer.appendChild(detailedForecastRow);
        weatherDetailsContainer.appendChild(windSpeedRow);
        weatherDetailsContainer.appendChild(windDirectionRow);
        weatherDetailsContainer.appendChild(tempTrendRow);

        /*
            Create weather day options
        */
        document.getElementById('weather-day-change').innerHTML = '';
        periods.forEach(function(additionalPeriod, i) {
            var li = document.createElement('li'),
                link = document.createElement('a');

            if (period.number != additionalPeriod.number) {
                link.href = '#';
                link.textContent = additionalPeriod.name;
                link.classList = 'text-light';

                li.id = 'period-' + additionalPeriod.number;
                li.classList = 'new-weather-day text-light';
            } else {
                link.href = '#';
                link.textContent = additionalPeriod.name;
                link.classList = 'text-primary';

                li.id = 'period-' + additionalPeriod.number;
                li.classList = 'text-primary';
            }

            li.appendChild(link);
            document.getElementById('weather-day-change').appendChild(li);
        });
    },

    renderLocation: function(response, position) {
        //document.getElementById('html-weather').getElementsByClassName('coordinates')[0].getElementsByClassName('details')[0].innerHTML = 'Latitude: ' + position.coords.latitude + '<br>Longitude: ' + position.coords.longitude;
        document.getElementById('html-weather').getElementsByClassName('coordinates')[0].getElementsByClassName('approx-location')[0].innerHTML = response.info.properties.timeZone + ' ' + response.info.properties.relativeLocation.properties.state;
    },

    renderDayForecast: function(period) {
        var weatherIcon = document.createElement('img');
        weatherIcon.src = period.icon;
        weatherIcon.classList = 'rounded';

        document.getElementsByClassName('weather-temp')[0].textContent = period.temperature + '° ' + period.temperatureUnit;
        document.getElementsByClassName('weather-date')[0].textContent = new Date(period.startTime).getDateTime();
        document.getElementsByClassName('weather-desc')[0].textContent = period.shortForecast;
        document.getElementsByClassName('weather-icon')[0].innerHTML = '';
        document.getElementsByClassName('weather-icon')[0].appendChild(weatherIcon);
    },

    changeWeatherDayBinding(periods) {
        var $this = this;
        var weatherDay = document.getElementsByClassName('new-weather-day');

        for (var i = 0; i <= weatherDay.length - 1; i++) {
            var thisWeatherDay = weatherDay[i];

            thisWeatherDay.removeEventListener('click', function() {});
            thisWeatherDay.addEventListener('click', function() {
                var weatherDayElem = this;
                var weatherPeriod = periods.filter(function(period) { return weatherDayElem.id.split('-')[1] == period.number; })[0];

                $this.renderMenuForecastInfo(weatherPeriod, periods);
                $this.renderDayForecast(weatherPeriod);
                $this.changeWeatherDayBinding(periods);
            });
        }
    }
};

window['weather'] = weather;