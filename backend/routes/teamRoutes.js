
const express = require('express');
const router = express.Router();
const TeamController = require('../contollers/teamController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');


router.use(authenticate);

router.post('/addEmployee', authorize, TeamController.addEmployee);


router.post('/removeEmployee', authorize, TeamController.removeEmployee);

module.exports = router;
