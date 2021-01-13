const xss = require("xss");

const QuotesService = {
	getQuotes(db) {
		return db.select("*").from("quotes");
	},
};

module.exports = QuotesService;
