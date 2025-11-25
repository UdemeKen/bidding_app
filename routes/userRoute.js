const express = require("express");
const { registerUser, loginUser, loginStatus, logoutUser, test } = require("../controllers/userCtr");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loggedin", loginStatus);
router.get("/logoutUser", logoutUser);
router.get("/test", test);


module.exports = router;