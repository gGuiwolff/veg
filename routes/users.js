const express = require("express");
const { getUsersSearchP, getUsersLatest } = require("../controllers/users");
const { requireLoggedInUser } = require("../middleware/auth");

const router = express.Router();

router.route("/search/:q").get(requireLoggedInUser, getUsersSearchP);
router.route("/latest").get(requireLoggedInUser, getUsersLatest);

module.exports = router;
