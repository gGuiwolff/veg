const express = require("express");
const { listOtherImages } = require("../controllers/listOtherFeed");
const { requireLoggedInUser } = require("../middleware/auth");

const router = express.Router();


router.route("/:id.json").get(requireLoggedInUser, listOtherImages);

module.exports = router;