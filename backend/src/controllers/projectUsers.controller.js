const express = require("express");
const { body, param } = require("express-validator");
const { authenticateJWT } = require("../middleware/auth");
const { handleValidation } = require("../middleware/validators");
const { ProjectUsersService } = require("../services/projectUsers.service");
const { ProjectsService } = require("../services/projects.service");

const router = express.Router({ mergeParams: true });
const projectUsersService = new ProjectUsersService();
const projectsService = new ProjectsService();

router.post(
  "/:id/users",
  authenticateJWT,
  [param("id").isUUID(), body("user_id").isUUID(), body("role").isIn(["owner", "developer", "viewer"])],
  handleValidation,
  async (req, res) => {
    const projectId = req.params.id;
    const project = await projectsService.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner = await projectsService.isUserOwner(projectId, req.user.sub);
    if (!isOwner && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const assigned = await projectUsersService.assignUser(projectId, req.body.user_id, req.body.role);
    res.status(201).json(assigned);
  }
);

router.put("/:id/users/:userId", authenticateJWT, async (req, res) => {
  const projectId = req.params.id;

  const isOwner = await projectsService.isUserOwner(projectId, req.user.sub);
  if (!isOwner && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const updated = await projectUsersService.updateRole(projectId, req.params.userId, req.body.role);
  res.json(updated);
});

router.delete("/:id/users/:userId", authenticateJWT, async (req, res) => {
  const projectId = req.params.id;

  const isOwner = await projectsService.isUserOwner(projectId, req.user.sub);
  if (!isOwner && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  await projectUsersService.removeUser(projectId, req.params.userId);
  res.status(204).send();
});

router.get("/:id/users", authenticateJWT, async (req, res) => {
  const users = await projectUsersService.listUsers(req.params.id);
  res.json(users);
});

module.exports = router;
