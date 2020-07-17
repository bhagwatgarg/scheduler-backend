const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events-controller");
const validator = require("express-validator");
const checkAuth=require('../middleware/auth');
//const bodyParser=require('body-parser');
router.use(checkAuth);
router.patch(
	"/:eid",
	[
		validator.check("title").not().isEmpty(),
	],
	eventsController.updateEvent
);
router.delete("/:eid", eventsController.deleteEvent);
router.post(
	"/new",
	[
		validator.check("title").not().isEmpty(),
    validator.check("owner").not().isEmpty()
	],
	eventsController.createEvent
);

module.exports = router;
