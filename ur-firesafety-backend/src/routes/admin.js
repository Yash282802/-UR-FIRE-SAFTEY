const { Router } = require("express");
const { login, getLeads, getLeadDetail, updateLeadStatus } = require("../controllers/adminController");
const { validateLogin, validateLeadStatus } = require("../middleware/validate");
const { authenticateToken } = require("../middleware/authMiddleware");
const { adminLimiter } = require("../middleware/rateLimiter");

const router = Router();

router.post("/login", adminLimiter, validateLogin, login);

router.get("/leads", authenticateToken, adminLimiter, getLeads);
router.get("/leads/:id", authenticateToken, getLeadDetail);
router.patch("/leads/:id", authenticateToken, validateLeadStatus, updateLeadStatus);

module.exports = router;
