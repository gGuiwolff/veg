const express = require("express");
const { postFriends } = require("../controllers/friends");
const { requireLoggedInUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(requireLoggedInUser, postFriends);

module.exports = router;
