const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController")


router.post("/functionup/colleges", collegeController.createcollege)
router.post("/functionup/interns",internController.createInterns)
module.exports = router;