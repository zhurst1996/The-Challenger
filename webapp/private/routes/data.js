const express = require('express');
const TechnologyList = require('../resolvers/TechnologyLists.js');

const router = express.Router();

router.get('/technologies/list', (req, res) => {
    var technologyList = new TechnologyList();

    technologyList.fetch().then((file) => {
        res.json(file);
    });
});

module.exports = router;