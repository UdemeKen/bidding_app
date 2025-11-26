const express = require("express");
const { registerUser, loginUser, loginStatus, logoutUser, test, loginAsSeller, getUser, getUserBalance, getAllUser, estimateincome } = require("../controllers/userCtr");
const { protect, isAdmin } = require("../middleware/authMiddleWare");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loggedin", loginStatus);
router.get("/logoutUser", logoutUser);
router.post("/seller", loginAsSeller);
router.get("/getuser", protect, getUser);
router.get("/sell-amount", protect, getUserBalance);
router.get("/users", protect, isAdmin, getAllUser);
router.get("/estimate-income", estimateincome)
router.get("/test", test);


module.exports = router;