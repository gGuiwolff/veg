const express = require("express");
const router = express.Router();
const { postImages } = require("../controllers/feed");
const { requireLoggedInUser } = require("../middleware/auth");


router.route("/").post(requireLoggedInUser,postImages);


module.exports = router;