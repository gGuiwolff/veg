const express = require("express");
const { kl } = require("../controllers/logOut");
const { requireLoggedInUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(requireLoggedInUser,kl);

module.exports = router;