const express = require("express");
const validator = require("express-validator");

const usersController = require("../controllers/users-controller");
const checkAuth=require('../middleware/auth');

const router = express.Router();

router.post(
	"/signup",
	[
    validator.check("name").not().isEmpty(),
		validator.check("email").not().isEmpty().isEmail().normalizeEmail(),
    validator.check("password").isLength({ min: 4 }),
    validator.check("description").not().isEmpty()
	],
	usersController.signup
);
router.post("/login", usersController.signin);
router.use(checkAuth);
router.get('/get/:name', usersController.getUsersByName);
router.post('/follow', usersController.followChannel);
router.post('/unfollow', usersController.unfollowChannel);
router.get('/:id', usersController.getUserById);
router.get('/events/:id', usersController.getEventsByUserId);

module.exports = router;
