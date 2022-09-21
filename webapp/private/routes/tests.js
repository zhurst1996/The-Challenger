import express from 'express';
import TestLists from '../resolvers/TestLists.js';

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

export default router;