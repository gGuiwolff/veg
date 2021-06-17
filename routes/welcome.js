const express = require("express");
const { getWelcome } = require("../controllers/welcome");
const { requireLoggedOutUser,casualUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(requireLoggedOutUser, getWelcome);

//router.route("/testado").get(casualUser, getWelcomes);

module.exports = router;
