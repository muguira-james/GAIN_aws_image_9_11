var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ArticleSchema   = new Schema({
	title: String,
  body: String,
  keywords: String,
  topics: String,
  summary: String
});

module.exports = mongoose.model('Articles', ArticleSchema);
