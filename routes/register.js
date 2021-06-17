const express = require("express");
const { postRegister } = require("../controllers/register");
const { requireLoggedOutUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(requireLoggedOutUser, postRegister);

module.exports = router;
