const mongoose = require("mongoose");

const events = new mongoose.Schema({
  title: {type: String},
  start: {type: Date},
  end: {type: Date},
  color: {type: String},
  startRecur: {type: Date},
  endRecur: {type: Date},
  daysOfWeek: [{type: Number}],
  recurrent: {type: Boolean},
  startTime: {type: Number},
  endTime: {type: Number},
	extendedProps: {type: Object},
	owner: {type: mongoose.Types.ObjectId, ref: 'User'},
});
module.exports=mongoose.model("Event", events);
