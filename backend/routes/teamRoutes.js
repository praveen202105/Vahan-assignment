
const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/teamController');
const authenticate = require('../middlewares/authenticate');



router.use(authenticate);

router.post('/addEmployee',  TeamController.addEmployee);


router.post('/removeEmployee',TeamController.removeEmployee);
router.get('/allmembers/:teamLeadId',TeamController.getAllMembers);

module.exports = router;
