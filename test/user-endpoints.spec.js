const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { expect } = require("chai");

describe("User Endpoints", function () {
	let db;

	const testUsers = helpers.makeUsersArray();
	const testUser = testUsers[0];

	before("make knex instance", () => {
		db = helpers.makeKnexInstance();
		app.set("db", db);
	});

	after("disconnect from db", () => db.destroy());

	before("cleanup", () => helpers.cleanTables(db));

	afterEach("cleanup", () => helpers.cleanTables(db));

	/**
	 * @description Register a user and populate their fields
	 **/
	describe(`POST /api/users`, () => {
		beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

		const requiredFields = ["email", "password", "first_name", "last_name"];

		requiredFields.forEach((field) => {
			const registerAttemptBody = {
				email: "test email",
				password: "test password",
				first_name: "test first_name",
				last_name: "test last_name",
			};

			it(`responds with 400 required error when '${field}' is missing`, () => {
				delete registerAttemptBody[field];

				return supertest(app)
					.post("/api/users")
					.send(registerAttemptBody)
					.expect(400, {
						error: `Missing '${field}' in request body`,
					});
			});
		});

		it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
			const userShortPassword = {
				email: "test email",
				password: "1234567",
				first_name: "test first_name",
				last_name: "test last_name",
			};
			return supertest(app)
				.post("/api/users")
				.send(userShortPassword)
				.expect(400, { error: `Password must be longer than 8 characters` });
		});

		it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
			const userLongPassword = {
				email: "test email",
				password: "*".repeat(73),
				first_name: "test first_name",
				last_name: "test last_name",
			};
			return supertest(app)
				.post("/api/users")
				.send(userLongPassword)
				.expect(400, { error: `Password must be less than 72 characters` });
		});

		it(`responds 400 error when password starts with spaces`, () => {
			const userPasswordStartsSpaces = {
				email: "test email",
				password: " 1Aa!2Bb@",
				first_name: "test first_name",
				last_name: "test last_name",
			};
			return supertest(app)
				.post("/api/users")
				.send(userPasswordStartsSpaces)
				.expect(400, {
					error: `Password must not start or end with empty spaces`,
				});
		});

		it(`responds 400 error when password ends with spaces`, () => {
			const userPasswordEndsSpaces = {
				email: "test email",
				password: "1Aa!2Bb@ ",
				first_name: "test first_name",
				last_name: "test last_name",
			};
			return supertest(app)
				.post("/api/users")
				.send(userPasswordEndsSpaces)
				.expect(400, {
					error: `Password must not start or end with empty spaces`,
				});
		});

		it(`responds 400 error when password isn't complex enough`, () => {
			const userPasswordNotComplex = {
				email: "test email",
				password: "11AAaabb",
				first_name: "test first_name",
				last_name: "test last_name",
			};
			return supertest(app)
				.post("/api/users")
				.send(userPasswordNotComplex)
				.expect(400, {
					error: `Password must contain one upper case, lower case, number and special character`,
				});
		});

		it(`responds 400 'User email already in use' when email isn't unique`, () => {
			const duplicateUser = {
				email: testUser.email,
				password: "11AAaa!!",
				first_name: "test first_name",
				last_name: "test last_name",
			};
			return supertest(app)
				.post("/api/users")
				.send(duplicateUser)
				.expect(400, { error: `Email already in use` });
		});

		describe(`Given a valid user`, () => {
			it(`responds 201, serialized user with no password`, () => {
				const newUser = {
					email: "test email",
					password: "11AAaa!!",
					first_name: "test first_name",
					last_name: "test last_name",
				};
				return supertest(app)
					.post("/api/users")
					.send(newUser)
					.expect(201)
					.expect((res) => {
						expect(res.body).to.have.property("id");
						expect(res.body.email).to.eql(newUser.email);
						expect(res.body.first_name).to.eql(newUser.first_name);
						expect(res.body.last_name).to.eql(newUser.last_name);
						expect(res.body).to.not.have.property("password");
						expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
					});
			});

			it(`stores the new user in db with bcryped password`, () => {
				const newUser = {
					email: "test email",
					password: "11AAaa!!",
					first_name: "test first_name",
					last_name: "test last_name",
				};
				return supertest(app)
					.post("/api/users")
					.send(newUser)
					.expect((res) =>
						db
							.from("user")
							.select("*")
							.where({ id: res.body.id })
							.first()
							.then((row) => {
								expect(row.email).to.eql(newUser.email);
								expect(row.first_name).to.eql(newUser.first_name);

								return bcrypt.compare(newUser.password, row.password);
							})
							.then((compareMatch) => {
								expect(compareMatch).to.be.true;
							})
					);
			});
		});
	});
});
