var mongoose = require('mongoose'),
	Schema	= mongoose.Schema,
	ObjectId = mongoose.Schema.Types.ObjectId;

var VotesSchema	= new Schema({
	name: {type: String, required: true, index:{ unique: true}},
	user: {type: ObjectId, ref: 'User'},
	options: []
})


module.exports = mongoose.model('Votes', VotesSchema);