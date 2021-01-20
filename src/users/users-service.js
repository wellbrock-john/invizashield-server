const bcrypt = require("bcryptjs");
const xss = require("xss");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UserService = {
  hasUserWithEmail(db, email) {
    return db("users")
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  hasUserWithPhone(db, phone_num) {
    return db("users")
    .where({ phone_num })
    .first()
    .then((user) => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  getById(db, id) {
    return db.first("*").from("users").where({ id });
  },
  getByPhoneNum(db, phone_num) {
    return db.first("*").from("users").where({ phone_num });
  },
  getUserWithEmail(db, email) {
    return db.select("*").where({ email }).from("users");
  },
  updateUser(db, id, userToUpdate) {
	return db("users").where({ id }).update(userToUpdate);
},
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain one upper case, lower case, number and special character";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      last_name: xss(user.last_name),
      email: xss(user.email),
    };
  },
};

module.exports = UserService;
