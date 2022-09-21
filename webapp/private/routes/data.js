import express from 'express';
import TechnologyList from '../resolvers/TechnologyLists.js';

const router = express.Router();

router.get('/technologies/list', (req, res) => {
    var technologyList = new TechnologyList();

    technologyList.fetch().then((file) => {
        res.json(file);
    });
});

export default router;