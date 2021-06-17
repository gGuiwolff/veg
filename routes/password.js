const express = require("express");
const { postResetStart, postResetVerify } = require("../controllers/password");
const { requireLoggedOutUser } = require("../middleware/auth");

const router = express.Router();

router.route("/start").post(requireLoggedOutUser, postResetStart);
router.route("/verify").post(requireLoggedOutUser, postResetVerify);

module.exports = router;
