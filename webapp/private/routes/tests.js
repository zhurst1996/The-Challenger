const express = require('express');
const TestLists = require('../resolvers/TestLists');

const router = express.Router();

router.get('/test/:test', (req, res) => {
    var testPath = '/tests/' + req.params.test;
    var test = new TestLists({ page: testPath });

    test.fetchTest().then((test) => {
        res.json(test);
    });
});

router.get('/list', (req, res) => {
    var test = new TestLists();

    test.fetchList().then((list) => {
        res.json(list);
    });
});

module.exports = router;