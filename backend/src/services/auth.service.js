const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

class AuthService {
  async register(email, password, clientId, role) {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new Error("Client not found");

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new Error("Email already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, passwordHash, clientId, role: role ?? null }
    });

    delete user.passwordHash;
    return user;
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { sub: user.id, email: user.email, clientId: user.clientId, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { access_token: token };
  }

  async me(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    delete user.passwordHash;
    return user;
  }
}

module.exports = { AuthService };
