const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PATCH", "DELETE"] }));

app.use(express.json({ limit: "10kb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

let contactRoutes, adminRoutes;
try {
  contactRoutes = require("../src/routes/contact");
  adminRoutes = require("../src/routes/admin");
} catch (e) {
  console.error("Route import error:", e.message);
}

if (contactRoutes) app.use("/api/v1/contact", contactRoutes);
if (adminRoutes) app.use("/api/v1/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;
