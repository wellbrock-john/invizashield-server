const xss = require("xss");
const { v4: uuidv4 } = require("uuid");

const VehiclesService = {
	getVehiclesForUser(db, userId) {
		return db.select("*").where({ userId }).from("vehicles");
	},

	getById(db, id, userId) {
		return db.first("*").from("vehicles").where({ id, userId });
	},
	insertVehicle(db, newVehicle, userId) {
		newVehicle.userId = userId;
		return db
			.insert(newVehicle)
			.into("vehicles")
			.returning("*")
			.then(([vehicle]) => vehicle);
	},
	deleteVehicle(db, id, userId) {
		return db("vehicles").where({ id, userId }).delete();
	},
	updateVehicle(db, id, vehicleToUpdate) {
		return db("vehicles").where({ id }).update(vehicleToUpdate);
	},
	createQuote(db, newVehicle, user) {
		quote = {
			year: newVehicle.year,
			make: newVehicle.make,
			model: newVehicle.model,
			submodel: newVehicle.submodel,
			color: newVehicle.color,
			paintCondition: newVehicle.paintCondition,
			coverage: newVehicle.coverage,
			userId: user.id,
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name,
			phone_num: user.phone_num,
		};
		return db.insert(quote).into("quotes");
	},

	serializeVehicle(vehicle) {
		return {
			id: vehicle.id,
			year: xss(vehicle.year),
			make: xss(vehicle.make),
			model: xss(vehicle.model),
			submodel: xss(vehicle.submodel),
			color: xss(vehicle.color),
			paintCondition: xss(vehicle.paintCondition),
			coverage: xss(vehicle.coverage),
			userId: vehicle.userId,
		};
	},
};

module.exports = VehiclesService;
