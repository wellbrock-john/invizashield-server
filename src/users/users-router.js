const express = require("express");
const path = require("path");
const UserService = require("./users-service");
const { requireAuth } = require("../middleware/jwt-auth");

const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter.post("/", jsonBodyParser, async (req, res, next) => {
  const { password, email, first_name, last_name } = req.body;

  for (const field of ["first_name", "last_name", "email", "password"])
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
  res.json(req.user);
  next();
})
;

module.exports = userRouter;
