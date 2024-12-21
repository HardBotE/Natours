const express = require('express');

const { getTour,getOverview } = require('../Controllers/viewController');
const router = express.Router();


router.get('/',getOverview);

router.get('/tours/:id',getTour);



module.exports = router;