const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { UsersService } = require("../services/users.service");

const router = express.Router();
const usersService = new UsersService();

router.get("/clients/me/users", authenticateJWT, async (req, res) => {
  const users = await usersService.listByClient(req.user.clientId);
  res.json(users);
});

module.exports = router;
