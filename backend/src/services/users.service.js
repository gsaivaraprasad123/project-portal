const { prisma } = require("../prisma");

class UsersService {
  async listByClient(clientId) {
    return prisma.user.findMany({
      where: { clientId },
      select: { id: true, email: true, role: true }
    });
  }
}

module.exports = { UsersService };
