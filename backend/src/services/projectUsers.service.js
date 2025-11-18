const { prisma } = require("../prisma");

class ProjectUsersService {
  async assignUser(projectId, userId, role) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error("Project not found");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (project.clientId !== user.clientId)
      throw new Error("User and project belong to different clients");

    const existing = await prisma.projectUser.findUnique({
      where: { projectId_userId: { projectId, userId } }
    });

    if (existing) {
      return prisma.projectUser.update({
        where: { id: existing.id },
        data: { role }
      });
    }

    return prisma.projectUser.create({
      data: { projectId, userId, role }
    });
  }

  async updateRole(projectId, userId, role) {
    const existing = await prisma.projectUser.findUnique({
      where: { projectId_userId: { projectId, userId } }
    });
    if (!existing) throw new Error("Assignment not found");

    return prisma.projectUser.update({
      where: { id: existing.id },
      data: { role }
    });
  }

  async removeUser(projectId, userId) {
    const existing = await prisma.projectUser.findUnique({
      where: { projectId_userId: { projectId, userId } }
    });
    if (!existing) throw new Error("Assignment not found");

    return prisma.projectUser.delete({ where: { id: existing.id } });
  }

  async listUsers(projectId) {
    return prisma.projectUser.findMany({
      where: { projectId },
      include: { user: true }
    });
  }
}

module.exports = { ProjectUsersService };
