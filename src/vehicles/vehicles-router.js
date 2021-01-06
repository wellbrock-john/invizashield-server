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
	.post(jsonBodyParser, (req, res, next) => {
		for (const field of ["year", "make", "model", "color", "paintCondition", "coverage"]) {
			if (!req.body[field]) {
				return res.status(400).send(`'${field}' is required`);
			}
		}

		const { year, make, model, color, paintCondition, coverage } = req.body;
		const newVehicle = { year, make, model, color, paintCondition, coverage };

		VehiclesService.insertVehicle(req.app.get("db"), newVehicle, req.user.id)
			.then((vehicle) => {
				res
					.status(201)
					.location(`/api/vehicles/${vehicle.id}`)
					.json(VehiclesService.serializeVehicle(vehicle));
			})
			.catch(next);
	});

vehiclesRouter
	.route("/:id")
	.all(requireAuth)
	.all(checkVehicleExists)
	.get((req, res) => {
		res.json(VehiclesService.serializeVehicle(res.vehicle));
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