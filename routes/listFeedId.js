const express = require("express");
const { listImagesId, getOtherFeedId } = require("../controllers/listFeedId");
const { requireLoggedInUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(requireLoggedInUser, listImagesId);

router.route("/:id.json").get(requireLoggedInUser, getOtherFeedId);

module.exports = router;