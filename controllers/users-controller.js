const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const HTTPError = require("../models/http-error");

const signup = async (req, res, next) => {
	//console.log(req.body);
	let { name, email, password, type, description } = req.body;
	// if (type === 0) email.concat("u");
	// else email.concat("c");
	let user;
	//console.log(type);
	try {
		user = await User.find({ email: email, type: type });
	} catch (e) {
		return next(new HTTPError("Something went wrong", 500));
	}
	//console.log(user.length);
	if (user.length) {
		return next(new HTTPError("User already exists"), 500);
	}
	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (e) {
		return next(new HTTPError("Something Went Wrong", 500));
	}
	user = new User({
		name,
		email,
		password: hashedPassword,
		description,
		events: [],
		following: [],
		type,
		followers: 0,
	});
	try {
		const result = await user.save();
		res.status(201);
		const token = jwt.sign(
			{ userId: result._id.toString(), email: result.email },
			process.env.JWT_KEY,
			{ expiresIn: "1h" }
		);
		res.json({ ...result.toObject({ getters: true }), token });
	} catch (e) {
		return next(new HTTPError("Could not create user"), 500);
	}
};

const signin = async (req, res, next) => {
	const { email, password, type } = req.body;
	// if (type === 0) email.concat("u");
	// else email.concat("c");
	let user;
	try {
		user = await User.find({ email: email, type: type });
	} catch (e) {
		return next(new HTTPError("Something went wrong Could Not Find"), 500);
	}
	let isEqual;
	try {
		isEqual = await bcrypt.compare(password, user[0].password);
	} catch (e) {
		return next(new HTTPError("Something Went Wrong", 500));
	}
	if (!user[0] || !isEqual) {
		return next(new HTTPError("Invalid Credentials"), 404);
	}
	let token;
	try {
		token = jwt.sign(
			{ userId: user[0]._id.toString(), email: user[0].email },
			process.env.JWT_KEY,
			{ expiresIn: "1h" }
		);
	} catch (e) {
		return next(new HTTPError("Something Went Wrong", 500));
	}
	res.status(200);
	res.json({ ...user[0].toObject({ getters: true }), token });
};

const getUsersByName = async (req, res, next) => {
	const name = req.params.name;
	let users;
	try {
		users = await User.find({ name: name, type: 1 }, "-password");
		res.status(200);
		res.json({ users: users.map((u) => u.toObject({ getters: true })) });
	} catch (e) {
		return next(new HTTPError("Something went wrong"), 500);
	}
};

const followChannel = async (req, res, next) => {
	const { user, channel } = req.body;
	let userObj, channelObj;
	try {
		userObj = await User.findById(user);
		channelObj = await User.findById(channel);
	} catch (e) {
		return next(new HTTPError("Something went wrong"), 500);
	}
	if (!userObj || !channelObj) {
		return next(
			new HTTPError("Could not find user/channel with the given ID"),
			404
		);
	}
	if (userObj.following.includes(channel)) {
		return next(new HTTPError("User is already following the channel"), 404);
		//res.json({ message: "User is already following the channel" });
	}
	//console.log(userObj.toObject({getters: true}));
	let result;
	//channelObj.followers=channelObj.followers+1;
	//userObj.following.push(channelObj);
	try {
		let session;
		await mongoose
			.startSession()
			.then((sess) => {
				session = sess;
				session.startTransaction();
				userObj.following.addToSet(channelObj);
				result = userObj.save();
			})
			.then(() => {
				channelObj.followers = channelObj.followers + 1;
				result = channelObj.save();
			})
			.then(() => {
				session.commitTransaction();
			})
			.then(() => session.endSession());

		// session.startTransaction();
		// userObj.following.push(channelObj);
		// result = await userObj.save({ session: session });
		// channelObj.followers=channelObj.followers+1;
		// result=await channelObj.save({session: session});
		// session.commitTransaction();
	} catch (e) {
		//console.log(e);
		res.status(500);
		res.json({ message: "Could not complete request!" });
	}
	res.status(201);
	res.json(result);
};

const unfollowChannel = async (req, res, next) => {
	const { user, channel } = req.body;
	let userObj, channelObj;
	try {
		userObj = await User.findById(user);
		channelObj = await User.findById(channel);
	} catch (e) {
		return next(new HTTPError("Something went wrong owner"), 500);
	}
	if (!userObj || !channelObj) {
		return next(
			new HTTPError("Could not find user/channel with the given ID"),
			404
		);
	}
	if (!userObj.following.includes(channel)) {
		return next(new HTTPError("User is not following the channel"), 404);

		//res.json({ message: "User is not following the channel" });
	}
	// channelObj.followers=channelObj.followers-1;
	// console.log(channelObj.followers);
	// userObj.following.pop(channelObj);
	let result;
	try {
		let session;
		await mongoose
			.startSession()
			.then((sess) => {
				session = sess;
				session.startTransaction();
				userObj.following.pop(channelObj);
				result = userObj.save();
			})
			.then(() => {
				channelObj.followers = channelObj.followers - 1;
				result = channelObj.save();
			})
			.then(() => {
				session.commitTransaction();
			})
			.then(() => session.endSession());
	} catch (e) {
		res.status(500);
		res.json({ message: "Could not complet request!" });
	}
	res.status(201);
	res.json(result);
};

const getUserById = async (req, res, next) => {
	const id = req.params.id;
	let user;
	try {
		user = await User.findById(id, "-password");
		res.status(200);
		res.json(user.toObject({ getters: true }));
	} catch (e) {
		return next(new HTTPError("Something went wrong"), 500);
	}
};

const getEventsByUserId = async (req, res, next) => {
	const id = req.params.id;
	let user;
	try {
		user = await User.findById(id, "-password")
			.populate("events")
			.populate({
				path: "following",

				populate: {
					path: "events",
				},
			});
		if (!user) {
			return next(
				new HTTPError("Could not find user/channel with the given ID"),
				404
			);
		}
		let ev = user.events;
		//console.log(user);
		user.following.forEach((f) => (ev = ev.concat(f.events)));
		res.status(200);
		res.json(ev.map((e) => e.toObject({ getters: true })));
		//let data=JSON.parse(user);
	} catch (e) {
		return next(new HTTPError("Something went wrong"), 500);
	}
};

const checkIfUserFollows = async (req, res, next) => {
	const { user, channel } = req.body;
};

exports.signup = signup;
exports.signin = signin;
exports.getUsersByName = getUsersByName;
exports.followChannel = followChannel;
exports.unfollowChannel = unfollowChannel;
exports.getUserById = getUserById;
exports.getEventsByUserId = getEventsByUserId;
