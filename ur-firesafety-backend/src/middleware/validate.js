const VALID_SERVICES = [
  "quote",
  "extinguishers",
  "alarms",
  "hydrants",
  "refilling",
  "ppe",
  "Fire Extinguishers",
  "Fire Alarm & Detection Networks",
  "High-Pressure Hydrant Systems",
  "AMC Refilling & Maintenance",
  "Certified Personal Protective Equipment (PPE)",
];

const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(req, res, next) {
  const { name, phone, email, service, message } = req.body;
  const errors = {};

  if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    errors.name = "Name is required and must be 2–100 characters.";
  }

  if (!phone || typeof phone !== "string") {
    errors.phone = "Phone number is required.";
  } else {
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");
    if (!PHONE_REGEX.test(cleaned)) {
      errors.phone = "Must be a valid 10-digit Indian mobile number.";
    }
  }

  if (email && typeof email === "string" && email.trim()) {
    if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "Must be a valid email address.";
    }
  }

  if (service && typeof service === "string") {
    if (!VALID_SERVICES.includes(service)) {
      errors.service = `Invalid service. Must be one of: ${VALID_SERVICES.slice(0, 6).join(", ")}`;
    }
  }

  if (message && typeof message === "string" && message.length > 1000) {
    errors.message = "Message must not exceed 1000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  req.body.name = name.trim();
  if (phone) req.body.phone = phone.replace(/[\s\-\(\)]/g, "");
  if (email) req.body.email = email.trim();
  if (service) req.body.service = service.trim();
  if (message) req.body.message = message.trim();

  next();
}

function validateLeadStatus(req, res, next) {
  const { status } = req.body;
  const validStatuses = ["new", "contacted", "closed"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      errors: { status: `Status must be one of: ${validStatuses.join(", ")}` },
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { username, password } = req.body;
  const errors = {};

  if (!username || typeof username !== "string" || username.trim().length < 3) {
    errors.username = "Username is required (min 3 characters).";
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.password = "Password is required (min 6 characters).";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = { validateContact, validateLeadStatus, validateLogin };
