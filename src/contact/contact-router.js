require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const contactRouter = express.Router();
const jsonBodyParser = express.json();

const contactEmail = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

contactRouter.route("/").post(jsonBodyParser, (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const message = req.body.message;
	const mail = {
		from: name,
		to: "***************@gmail.com",
		subject: "Contact Form Submission",
		html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
	};
	contactEmail.sendMail(mail, (error) => {
		if (error) {
			res.json({ status: "ERROR" });
		} else {
			res.json({ status: "Message Sent" });
		}
	});
});

module.exports = contactRouter;
