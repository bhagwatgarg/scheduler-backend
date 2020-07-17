const validator = require("express-validator");
const mongoose = require("mongoose");

const HTTPError = require("../models/http-error");
const Event = require("../models/events");
const User = require("../models/users");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-aui6x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
	.connect(uri)
	.then(() => console.log("Connected to database"))
	.catch((e) => console.log("Connection Failed"));
const createEvent = async (req, res, next) => {
	const errors = validator.validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HTTPError("Input not acceptable!", 406));
	}
	let user;

	const {
		title,
		start,
		owner,
		end,
		extendedProps,
		color,
		startRecur,
		endRecur,
		daysOfWeek,
		recurrent,
		startTime,
		endTime,
	} = req.body;
	//console.log(owner);
	try {
		user = await User.findById(owner);
	} catch (e) {
		return next(new HTTPError("Something went wrong owner"), 500);
	}
	if (!user) {
		return next(new HTTPError("Could not find user with the given ID"), 404);
	}

	const obj = new Event({
		title,
		start,
		owner,
		end,
		extendedProps,
		color,
		startRecur,
		endRecur,
		daysOfWeek,
		recurrent,
		startTime,
		endTime,
	});
	//allEvents.push(obj);
	let result;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		result = await obj.save({ session: session });
		await user.events.push(obj);
		await user.save({ session: session });
		session.commitTransaction();
	} catch (e) {
		res.status(500);
		res.json({ message: "Could not create event!" });
	}
	res.status(201);
	res.json(result.toObject({ getters: true }));
};

const updateEvent = async (req, res, next) => {
	const {
		title,
		start,
		end,
		extendedProps,
		color,
		startRecur,
		endRecur,
		daysOfWeek,
		recurrent,
		startTime,
		endTime,
	} = req.body;
	eventId = req.params.eid;
	let eventReq;
	try {
		eventReq = await Event.findById(eventId);
		if (eventReq.owner._id.toString() !== req.userData.userId) {
			throw new Error();
		}
	} catch (e) {
		return next(new HTTPError("Something went wrong(REQ).", 500));
	}
	if (!eventReq) {
		return next(new HTTPError("Event out Found!", 404));
	}
	eventReq.title = title;
	eventReq.start = start;
	eventReq.end = end;
	eventReq.extendedProps = extendedProps;
	eventReq.color = color;
	eventReq.startRecur = startRecur;
	eventReq.endRecur = endRecur;
	eventReq.daysOfWeek = daysOfWeek;
	eventReq.recurrent = recurrent;
	eventReq.startTime = startTime;
	eventReq.endTime = endTime;
	try {
		const result = await eventReq.save();
		res.status(202);
		res.json(result.toObject({ getters: true }));
	} catch (e) {
		return next(new HTTPError("Something went wrong(UPD)", 500));
	}
};

const deleteEvent = async (req, res, next) => {
	eventId = req.params.eid;
	let eventReq;

	try {
		eventReq = await Event.findById(eventId).populate("owner");
		if (eventReq.owner._id.toString() !== req.userData.userId) {
			throw new Error();
		}
	} catch (e) {
		return next(new HTTPError("Something went wrong.", 500));
	}
	if (!eventReq) {
		return next(new HTTPError("Event out Found!", 404));
	}
	try {
		const session = await mongoose.startSession();
		(await session).startTransaction();
		await eventReq.owner.events.pop(eventReq);
		await eventReq.owner.save({ session: session });
		const result = await eventReq.remove({ session: session });
		await session.commitTransaction();
		res.status(200);
		res.json(result.toObject());
	} catch (e) {
		return next(new HTTPError("Could not delete event", 500));
	}
};

exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
