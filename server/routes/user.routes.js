const router = require("express").Router();
const { getAvailableUsers, getAllUsers, getUserById, updateProfile } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
router.get("/", protect, getAvailableUsers);      
router.get("/all", protect, getAllUsers);          
router.get("/:id", protect, getUserById);          
router.put("/profile", protect, updateProfile);   

module.exports = router;