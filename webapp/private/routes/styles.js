import express from 'express';
import StyleLists from '../resolvers/StyleLists.js';

const router = express.Router();

router.get('/list', (req, res) => {
    var styleLists = new StyleLists();

    styleLists.formattedLinks().then((links) => {
        res.json(links);
    });
});

export default router;