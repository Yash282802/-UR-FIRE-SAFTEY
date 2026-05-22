const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function createTransporter() {
  if (process.env.NODE_ENV === "test" || !process.env.SMTP_USER) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
}

function buildOwnerEmail(lead) {
  return {
    subject: `New Inquiry — ${lead.service || "General"} from ${lead.name}`,
    html: `
      <h2>New Lead Received</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-family:sans-serif;">
        <tr><td><strong>Name</strong></td><td>${lead.name}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${lead.phone}</td></tr>
        <tr><td><strong>Email</strong></td><td>${lead.email || "—"}</td></tr>
        <tr><td><strong>Service</strong></td><td>${lead.service || "—"}</td></tr>
        <tr><td><strong>Message</strong></td><td>${lead.message || "—"}</td></tr>
        <tr><td><strong>Received At</strong></td><td>${new Date(lead.createdAt).toLocaleString("en-IN")}</td></tr>
      </table>
      <p style="color:#888;">UR Fire Safety Solution — Lead Management System</p>
    `,
  };
}

function buildCustomerEmail(lead) {
  return {
    subject: "We received your inquiry — UR Fire Safety Solution",
    html: `
      <div style="font-family:sans-serif; max-width:600px; margin:0 auto;">
        <h2 style="color:#d32f2f;">Thank You, ${lead.name}!</h2>
        <p>We have received your inquiry and will contact you within 24 hours on <strong>${lead.phone}</strong>.</p>
        ${lead.service ? `<p><strong>Service requested:</strong> ${lead.service}</p>` : ""}
        ${lead.message ? `<p><strong>Your message:</strong> ${lead.message}</p>` : ""}
        <hr>
        <p>For urgent needs, call us directly: <a href="tel:9274733827">9274733827</a></p>
        <p style="color:#888;">— Team UR Fire Safety Solution, Vadodara</p>
      </div>
    `,
  };
}

async function sendLeadEmails(lead) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log("Email transport not configured. Skipping email send.");
    return;
  }

  const ownerEmail = process.env.SMTP_USER;
  const results = [];

  if (ownerEmail) {
    const ownerMail = buildOwnerEmail(lead);
    try {
      await transporter.sendMail({
        from: `"UR Fire Safety" <${ownerEmail}>`,
        to: ownerEmail,
        ...ownerMail,
      });
      results.push({ recipient: ownerEmail, status: "sent" });
    } catch (err) {
      console.error("Failed to send owner email:", err.message);
      results.push({ recipient: ownerEmail, status: "failed" });
    }
  }

  if (lead.email) {
    const customerMail = buildCustomerEmail(lead);
    try {
      await transporter.sendMail({
        from: `"UR Fire Safety" <${ownerEmail}>`,
        to: lead.email,
        ...customerMail,
      });
      results.push({ recipient: lead.email, status: "sent" });
    } catch (err) {
      console.error("Failed to send customer email:", err.message);
      results.push({ recipient: lead.email, status: "failed" });
    }
  }

  for (const r of results) {
    await prisma.emailLog.create({
      data: {
        leadId: lead.id,
        recipient: r.recipient,
        subject: r.recipient === ownerEmail ? buildOwnerEmail(lead).subject : buildCustomerEmail(lead).subject,
        status: r.status,
      },
    }).catch((err) => console.error("Failed to log email:", err.message));
  }
}

module.exports = { sendLeadEmails };
