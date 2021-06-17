const express = require("express");
const { getFriend, postFriend } = require("../controllers/friend");
const { requireLoggedInUser } = require("../middleware/auth");

const router = express.Router();

router.route("/:otherUserId").get(requireLoggedInUser, getFriend);
router.route("/").post(requireLoggedInUser, postFriend);

module.exports = router;
