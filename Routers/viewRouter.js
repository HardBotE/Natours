const express = require('express');
const authController = require('../controllers/authController');
const { getTour,getOverview,loginUser, loginUserForm } = require('../Controllers/viewController');
const { userHasToken } = require('../Controllers/authController');

const router = express.Router();

router.use(userHasToken)

router.get('/',getOverview);

router.get('/tours/:id',getTour);

router.get('/login',loginUserForm);



module.exports = router;