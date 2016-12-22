var user = require('../models/user');

module.exports = {
	addToCollection: function(id, data) {
		user.findOneAndUpdate({ '_id': id}, {$push: {'local.collections': data}}, {new: true}, function(err, raw) {
			if (err) return handleError(err);
		})
	}
}