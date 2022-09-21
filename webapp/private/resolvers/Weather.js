import fetch from 'node-fetch';

class Weather {
    constructor(props) {
        if (!props || !props.lat || !props.long) {
            return;
        }

        this.lat = props.lat;
        this.long = props.long;
    }

    async getWeather() {
        const response = await fetch('https://api.weather.gov/points/' + this.lat + ',' + this.long);
        const info = await response.json();

        const weatherInfo = await this.formatWeatherInfo(info);

        return weatherInfo;
    }

    async formatWeatherInfo(info) {
        var weather;

        if (!info || !info.properties || !info.properties.forecast || !info.properties.forecastHourly) {
            weather = 'Weather Information not Found';
            return weather;
        }

        var forecastReponse = await (await fetch(info.properties.forecast)).json(),
            forecastHourlyResponse = await (await fetch(info.properties.forecastHourly)).json();

        weather = {
            forecast: forecastReponse,
            forecastHourly: forecastHourlyResponse,
            info
        };

        return weather;
    }
}

export default Weather;