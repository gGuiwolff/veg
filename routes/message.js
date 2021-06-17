const express = require("express");
const { getMesage } = require("../controllers/message");
const router = express.Router();

router.route("/:id").get(getMesage);

module.exports = router;
