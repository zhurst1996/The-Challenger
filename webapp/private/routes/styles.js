const express = require('express');
const StyleLists = require('../resolvers/StyleLists');

const router = express.Router();

router.get('/list', (req, res) => {
    var styleLists = new StyleLists();

    styleLists.formattedLinks().then((links) => {
        res.json(links);
    });
});

module.exports = router;