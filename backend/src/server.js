const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./controllers/auth.controller");
const projectsRoutes = require("./controllers/projects.controller");
const projectUsersRoutes = require("./controllers/projectUsers.controller");
const usersRoutes = require("./controllers/users.controller");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/projects", projectUsersRoutes);
app.use("/api", usersRoutes);

app.get("/", (req, res) => res.send("Project Portal API Running ..."));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
