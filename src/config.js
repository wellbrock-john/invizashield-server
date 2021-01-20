module.exports = {
	PORT: process.env.PORT || 8000,
	NODE_ENV: process.env.NODE_ENV || "development",
	DATABASE_URL:
		process.env.DATABASE_URL || "postgresql://postgres@localhost/invizashield",
	JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
	JWT_EXPIRY: process.env.JWT_EXPIRY || "3h",
	TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
	EMAIL_USER: process.env.EMAIL_USER,
	EMAIL_PASS: process.env.EMAIL_PASS,
};
