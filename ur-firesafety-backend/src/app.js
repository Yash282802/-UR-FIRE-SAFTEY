require("dotenv").config();
const express = require("express");
const cors = require("cors");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5500",
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));

app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`UR Fire Safety API running on port ${PORT}`);
});

module.exports = app;
