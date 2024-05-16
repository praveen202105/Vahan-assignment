
const express = require('express');
const router = express.Router();
const TeamController = require('../contollers/teamController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');


router.use(authenticate);

router.post('/addEmployee',  TeamController.addEmployee);


router.post('/removeEmployee',TeamController.removeEmployee);
router.get('/allmembers/:teamLeadId',TeamController.getAllMembers);

module.exports = router;
