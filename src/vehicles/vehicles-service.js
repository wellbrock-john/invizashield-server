const xss = require("xss");

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
			.then((rows) => {
				return rows[0];
			});
	},
	deleteVehicle(db, id, userId) {
		return db("vehicles").where({ id, userId }).delete();
	},
	deleteDemoVehicles(db, userId) {
		return db("vehicles").where({ userId }).delete();
	},
	updateVehicle(db, id, newVehicleFields, userId) {
		newVehicleFields.userId = userId;
		return db("vehicles").where({ id, userId }).update(newVehicleFields);
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
