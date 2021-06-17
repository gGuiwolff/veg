const express = require("express");
const { postThreads } = require("../controllers/threads");
const router = express.Router();

router.route("/").post(postThreads);

module.exports = router;
