const express = require('express');

const { getTour,getOverview } = require('../Controllers/viewController');
const router = express.Router();


router.get('/',(req,res)=>{
  getOverview(req,res);
});

router.get('/tours/:id',(req,res)=>{
  getTour(req,res)
});


module.exports = router;