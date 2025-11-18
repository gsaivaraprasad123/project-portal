const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  
  const client = await prisma.client.create({
    data: {
      name: "Acme Corporation"
    }
  });

  console.log("Client created:", client.id);


  const adminPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@acme.com",
      passwordHash: adminPassword,
      role: "admin",
      clientId: client.id
    }
  });

  console.log("Admin created:", adminUser.email);


  const memberPassword = await bcrypt.hash("member123", 10);
  const memberUser = await prisma.user.create({
    data: {
      email: "member@acme.com",
      passwordHash: memberPassword,
      role: "member",
      clientId: client.id
    }
  });

  console.log("Member created:", memberUser.email);


  const project = await prisma.project.create({
    data: {
      name: "Portal Project",
      description: "Main company project.",
      clientId: client.id
    }
  });

  console.log("Project created:", project.id);


  await prisma.projectUser.create({
    data: {
      projectId: project.id,
      userId: adminUser.id,
      role: "owner"
    }
  });

  console.log("Admin assigned as project owner");

  console.log("🌱 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
