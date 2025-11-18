const { prisma } = require("../prisma");

class ProjectsService {
  async findAllByClient(clientId) {
    return prisma.project.findMany({
      where: { clientId },
      include: { projectUsers: { include: { user: true } } }
    });
  }

  async create(clientId, name, description) {
    return prisma.project.create({
      data: { name, description, clientId }
    });
  }

  async findById(id) {
    return prisma.project.findUnique({
      where: { id },
      include: { projectUsers: { include: { user: true } } }
    });
  }

  async update(id, data) {
    return prisma.project.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return prisma.project.delete({ where: { id } });
  }

  async isUserOwner(projectId, userId) {
    const pu = await prisma.projectUser.findFirst({
      where: { projectId, userId, role: "owner" }
    });
    return !!pu;
  }
}

module.exports = { ProjectsService };
