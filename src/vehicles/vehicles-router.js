const express = require("express");
const VehiclesService = require("./vehicles-service");
const { requireAuth } = require("../middleware/jwt-auth");

const vehiclesRouter = express.Router();
const jsonBodyParser = express.json();

vehiclesRouter
	.route("/")
	.all(requireAuth)
	.get((req, res, next) => {
		VehiclesService.getVehiclesForUser(req.app.get("db"), req.user.id)
			.then((vehicles) => {
				res.json(vehicles.map(VehiclesService.serializeVehicle));
			})
			.catch(next);
	})
	.post(jsonBodyParser, async (req, res, next) => {
		for (const field of [
			"year",
			"make",
			"model",
			"color",
			"paintCondition",
			"coverage",
		]) {
			if (!req.body[field]) {
				return res.status(400).send(`'${field}' is required`);
			}
		}

		const {
			year,
			make,
			model,
			submodel,
			color,
			paintCondition,
			coverage,
		} = req.body;
		const newVehicle = {
			year,
			make,
			model,
			submodel,
			color,
			paintCondition,
			coverage,
		};

		const { id, email, first_name, last_name, phone_num } = req.user;
		const user = {
			id,
			email,
			first_name,
			last_name,
			phone_num,
		};
		try {
			await VehiclesService.createQuote(req.app.get("db"), newVehicle, user);

			const vehicle = await VehiclesService.insertVehicle(
				req.app.get("db"),
				newVehicle,
				user.id
			);

			res
				.status(201)
				.location(`/api/vehicles/${vehicle.id}`)
				.json(VehiclesService.serializeVehicle(vehicle));
		} catch (error) {
			next(error);
		}
	});

vehiclesRouter
	.route("/:id")
	.all(requireAuth)
	.all(checkVehicleExists)
	.get((req, res) => {
		res.json(VehiclesService.serializeVehicle(res.vehicle));
	})
	.put(jsonBodyParser, (req, res, next) => {
		for (const field of [
			"year",
			"make",
			"model",
			"submodel",
			"color",
			"paintCondition",
			"coverage",
		]) {
			if (!req.body[field]) {
				return res.status(400).send(`"${field}" is required`);
			}
		}

		const {
			year,
			make,
			model,
			submodel,
			color,
			paintCondition,
			coverage,
		} = req.body;
		const vehicleToUpdate = {
			year,
			make,
			model,
			submodel,
			color,
			paintCondition,
			coverage,
		};
		const { id } = req.params;

		VehiclesService.updateVehicle(req.app.get("db"), id, vehicleToUpdate)
			.then(() => {
				res.status(201).json("Success").end();
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		const { id } = req.params;
		VehiclesService.deleteVehicle(req.app.get("db"), id, req.user.id)
			.then(() => {
				res.status(204).end();
			})
			.catch(next);
	});

/* async/await syntax for promises */
async function checkVehicleExists(req, res, next) {
	try {
		const vehicle = await VehiclesService.getById(
			req.app.get("db"),
			req.params.id,
			req.user.id
		);

		if (!vehicle)
			return res.status(404).json({
				error: `Vehicle doesn't exist`,
			});

		res.vehicle = vehicle;
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = vehiclesRouter;
