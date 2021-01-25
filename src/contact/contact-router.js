require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const contactRouter = express.Router();
const jsonBodyParser = express.json();

const contactEmail = nodemailer.createTransport({
	host: "smtp.mail.yahoo.com",
	secureConnection: true,
	port: 465,
	service: "yahoo",
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
		to: "email_for_thinkful_grading@yahoo.com",
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
