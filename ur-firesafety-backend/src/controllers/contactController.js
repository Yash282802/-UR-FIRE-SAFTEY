const leadService = require("../services/leadService");
const emailService = require("../services/emailService");

async function submitContact(req, res) {
  try {
    const { name, phone, email, service, message } = req.body;

    if (req.body._honeypot) {
      return res.json({ success: true, message: "Your inquiry has been received.", lead_id: null });
    }

    const lead = await leadService.createLead({
      name,
      phone,
      email: email || null,
      service: service || null,
      message: message || null,
      source: "contact_form",
    });

    emailService.sendLeadEmails(lead).catch((err) => {
      console.error("Background email send failed:", err.message);
    });

    res.status(200).json({
      success: true,
      message: "Your inquiry has been received. We will contact you shortly.",
      lead_id: lead.id,
    });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({ success: false, message: "Failed to submit inquiry. Please try again." });
  }
}

module.exports = { submitContact };
