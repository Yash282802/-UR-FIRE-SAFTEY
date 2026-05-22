const { Router } = require("express");
const { submitContact } = require("../controllers/contactController");
const { validateContact } = require("../middleware/validate");
const { contactLimiter } = require("../middleware/rateLimiter");

const router = Router();

router.post("/", contactLimiter, validateContact, submitContact);

module.exports = router;
