const express = require("express");
const QuotesService = require("./quotes-service");
const VehiclesService = require("../vehicles/vehicles-service");
const { requireAuth } = require("../middleware/jwt-auth");

quotesRouter = express.Router();
const jsonBodyParser = express.json();

quotesRouter
	.route("/")
	.all(requireAuth)
	.get((req, res, next) => {
		QuotesService.getQuotes(req.app.get("db")).then((quotes) => {
			res.json(quotes.map(VehiclesService.serializeVehicle));
		});
	});

module.exports = quotesRouter;
