require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const contactRouter = express.Router();
const jsonBodyParser = express.json();

const contactEmail = nodemailer.createTransport({
	service: "Yahoo",
	auth: {
		user: "email_for_thinkful_grading@yahoo.com",
		pass: "Password#3",
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
			console.log(error);
			res.json({ status: "ERROR" });
		} else {
			res.json({ status: "Message Sent" });
		}
	});
});

module.exports = contactRouter;
