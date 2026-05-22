const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.adminUser.upsert({
    where: { username: "ritesh" },
    update: {},
    create: {
      username: "ritesh",
      passwordHash: hash,
      role: "admin",
    },
  });

  console.log("Admin seeded:", admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
