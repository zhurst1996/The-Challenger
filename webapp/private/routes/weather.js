import express from 'express';
import Weather from '../resolvers/Weather.js';

const router = express.Router();

async function getWeather(lat, long, callback) {
    var weather = await new Weather({ lat, long }).getWeather();

    callback(weather);
}

router.get('/info/:lat/:long', (req, res) => {
    getWeather(req.params.lat, req.params.long, function(weather) {
        res.send(weather);
    });
});

export default router;