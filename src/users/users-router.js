const express = require("express");
const path = require("path");
const UserService = require("./users-service");
const { requireAuth } = require("../middleware/jwt-auth");

const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter.post("/", jsonBodyParser, async (req, res, next) => {
	const { password, email, phone_num, first_name, last_name } = req.body;

	for (const field of [
		"first_name",
		"last_name",
		"phone_num",
		"email",
		"password",
	])
		if (!req.body[field])
			return res.status(400).json({
				error: `Missing '${field}' in request body`,
			});

	try {
		const passwordError = UserService.validatePassword(password);

		if (passwordError) return res.status(400).json({ error: passwordError });

		const hasUserWithEmail = await UserService.hasUserWithEmail(
			req.app.get("db"),
			email
		);

		if (hasUserWithEmail)
			return res.status(400).json({ error: `Email already in use` });

		const hashedPassword = await UserService.hashPassword(password);

		const newUser = {
			email,
			password: hashedPassword,
			phone_num,
			first_name,
			last_name,
		};

		const user = await UserService.insertUser(req.app.get("db"), newUser);

		res
			.status(201)
			.location(path.posix.join(req.originalUrl, `/${user.id}`))
			.json(UserService.serializeUser(user));
	} catch (error) {
		next(error);
	}
});

userRouter.get("/", requireAuth, (req, res, next) => {
	const { id, first_name, last_name, email, phone_num } = req.user;
	const user = { id, first_name, last_name, email, phone_num };
	res.json(user);
	next();
});

userRouter
	.route("/:id")
	.all(requireAuth)
	.all(checkUserExists)
	.put(jsonBodyParser, (req, res, next) => {
		// for (const field of ["first_name", "last_name", "email", "phone_num"]) {
		//   if (!req.body[field]) {
		//     return res.status(400).send(`"${field}" is required`);
		//   }
		// }

		const { first_name, last_name, email, phone_num } = req.body;
		const userToUpdate = { first_name, last_name, email, phone_num };
		const { id } = req.params;

		UserService.updateUser(req.app.get("db"), id, userToUpdate)
			.then(() => {
				res.status(204).json("Success").end();
			})
			.catch(next);
	});

/* async/await syntax for promises */
async function checkUserExists(req, res, next) {
	try {
		const user = await UserService.getById(req.app.get("db"), req.params.id);
		if (!user)
			return res.status(404).json({
				error: `User doesn't exist`,
			});

		res.user = user;
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = userRouter;
