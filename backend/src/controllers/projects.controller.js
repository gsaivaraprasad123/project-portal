const express = require("express");
const { body, param } = require("express-validator");
const { authenticateJWT } = require("../middleware/auth");
const { handleValidation } = require("../middleware/validators");
const { ProjectsService } = require("../services/projects.service");

const router = express.Router();
const projectsService = new ProjectsService();

router.get("/", authenticateJWT, async (req, res) => {
  const projects = await projectsService.findAllByClient(req.user.clientId);
  res.json(projects);
});

router.post(
  "/",
  authenticateJWT,
  [body("name").isString()],
  handleValidation,
  async (req, res) => {
    const { name, description } = req.body;
    const project = await projectsService.create(req.user.clientId, name, description);
    res.status(201).json(project);
  }
);

router.get("/:id", authenticateJWT, [param("id").isUUID()], handleValidation, async (req, res) => {
  const project = await projectsService.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Not found" });
  if (project.clientId !== req.user.clientId) return res.status(403).json({ message: "Forbidden" });

  res.json(project);
});

router.put("/:id", authenticateJWT, async (req, res) => {
  const projectId = req.params.id;
  const project = await projectsService.findById(projectId);
  if (!project) return res.status(404).json({ message: "Not found" });

  const isOwner = await projectsService.isUserOwner(projectId, req.user.sub);
  if (!isOwner && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const updated = await projectsService.update(projectId, req.body);
  res.json(updated);
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  const projectId = req.params.id;
  const project = await projectsService.findById(projectId);
  if (!project) return res.status(404).json({ message: "Not found" });

  const isOwner = await projectsService.isUserOwner(projectId, req.user.sub);
  if (!isOwner && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  await projectsService.delete(projectId);
  res.status(204).send();
});

module.exports = router;
