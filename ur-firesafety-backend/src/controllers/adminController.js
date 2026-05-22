const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../services/prisma");
const leadService = require("../services/leadService");

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const admin = await prisma.adminUser.findUnique({ where: { username: username.trim() } });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.JWT_EXPIRES_IN) || 86400 }
    );

    res.json({ success: true, token, expires_in: parseInt(process.env.JWT_EXPIRES_IN) || 86400 });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed." });
  }
}

async function getLeads(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const result = await leadService.getLeads({
      status: status || undefined,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (err) {
    console.error("Get leads error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch leads." });
  }
}

async function getLeadDetail(req, res) {
  try {
    const id = parseInt(req.params.id);
    const lead = await leadService.getLeadById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }
    res.json({ success: true, lead });
  } catch (err) {
    console.error("Get lead detail error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch lead." });
  }
}

async function updateLeadStatus(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const existing = await leadService.getLeadById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }

    const updated = await leadService.updateLeadStatus(id, status);
    res.json({ success: true, lead: updated });
  } catch (err) {
    console.error("Update lead status error:", err);
    res.status(500).json({ success: false, message: "Failed to update lead status." });
  }
}

module.exports = { login, getLeads, getLeadDetail, updateLeadStatus };
