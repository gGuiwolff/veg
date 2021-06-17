const express = require("express");
const { postBio } = require("../controllers/bio");
const { requireLoggedInUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(requireLoggedInUser, postBio);

module.exports = router;
