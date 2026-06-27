const router = require("express").Router();
const { getMessages, getConversations } = require("../controllers/chat.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/conversations", protect, getConversations);
router.get("/:userId", protect, getMessages);             

module.exports = router;