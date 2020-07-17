const mongoose=require('mongoose');
// 0 for user 1 for channel
const user=new mongoose.Schema({
  name: {type:String},
  type: {type: Number},
  email: {type: String, unique: true},
  password: {type: String},
  description: {type:String},
  events: [{type: mongoose.Types.ObjectId, ref: 'Event'}],
  following: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  followers: {type: Number}
});

module.exports=mongoose.model("User", user);