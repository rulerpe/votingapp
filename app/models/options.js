var mongoose = require('mongoose'),
	Schema	= mongoose.Schema

var OptionsSchema	= new Schema({
	name: {type: String, required: true},
	counts: {type: Number, default: 0},
	vote: { type: String, required: true}
})


module.exports = mongoose.model('Options', OptionsSchema);