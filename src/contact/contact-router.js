const express = require("express");
const nodemailer = require("nodemailer");
const contactRouter = express.Router();
const jsonBodyParser = express.json();
const { EMAIL_USER, EMAIL_PASS } = require("../config");

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASS,
	}
});

contactRouter.route("/").post(jsonBodyParser, (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const message = req.body.message;
	const mail = {
		from: name,
		to: "wellbrock_john@yahoo.com",
		subject: "Contact Form Submission",
		html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
	};
	transporter.sendMail(mail, (error) => {
		if (error) {
			console.log(error);
			res.json({ status: "ERROR" });
		} else {
			res.json({ status: "Message Sent" });
		}
	});
});

module.exports = contactRouter;
