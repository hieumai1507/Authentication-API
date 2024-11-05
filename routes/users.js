const express = require("express");
const userCtrl = require("../controller/user");
const isAuthenticated = require("../middlewares/isAuth");

const router = express.Router();

router.post("/api/users/login", userCtrl.login);
router.get("/api/users/profile", isAuthenticated, userCtrl.profile);
// Register route
router.post("/api/users/register", userCtrl.register);
module.exports = router;