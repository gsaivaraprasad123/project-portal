const express = require("express");
const { body } = require("express-validator");
const { handleValidation } = require("../middleware/validators");
const { AuthService } = require("../services/auth.service");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const authService = new AuthService();

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("client_id").isUUID()
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password, client_id, role } = req.body;
      const user = await authService.register(email, password, client_id, role);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json(token);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }
);

router.get("/me", authenticateJWT, async (req, res) => {
  const user = await authService.me(req.user.sub);
  res.json(user);
});

module.exports = router;
