const express = require("express");
const router = express.Router();
const { listImages, getOtherFeed } = require("../controllers/listfeed");
const { requireLoggedInUser } = require("../middleware/auth");


router.route("/").get(requireLoggedInUser,listImages);

router.route("/:id.json").get(requireLoggedInUser, getOtherFeed);



module.exports = router;