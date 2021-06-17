const express = require("express");
const { getUser, getOtherUser } = require("../controllers/user");
const { requireLoggedInUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(requireLoggedInUser, getUser);

router.route("/:id.json").get(requireLoggedInUser, getOtherUser);

module.exports = router;
