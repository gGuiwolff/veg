const express = require("express");
const { postLogin } = require("../controllers/login");
const { requireLoggedOutUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(requireLoggedOutUser, postLogin);

module.exports = router;
