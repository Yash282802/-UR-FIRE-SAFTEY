const prisma = require("./prisma");

async function createLead(data) {
  return prisma.lead.create({ data });
}

async function getLeads({ status, page = 1, limit = 20 }) {
  const where = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        service: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { total, page, data };
}

async function getLeadById(id) {
  return prisma.lead.findUnique({ where: { id } });
}

async function updateLeadStatus(id, status) {
  return prisma.lead.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  });
}

module.exports = { createLead, getLeads, getLeadById, updateLeadStatus };
