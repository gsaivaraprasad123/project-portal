"use client";

import { useEffect, useState } from "react";
import Protected from "../../components/Protected";
import { apiFetch } from "../../lib/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // Load all projects
  function loadProjects() {
    apiFetch("/projects")
      .then(setProjects)
      .catch((err) => toast.error(err.message));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // Create a new project
  async function createProject() {
    try {
      await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify({ name, description: desc })
      });

      toast.success("Project created successfully");

      setOpen(false);
      setName("");
      setDesc("");

      loadProjects();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <Protected>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Projects</h1>

          {/* Create Project Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white">+ New Project</Button>
            </DialogTrigger>

            <DialogContent className="p-6">
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Project Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  placeholder="Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />

                <Button className="w-full" onClick={createProject}>
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Project List */}
        <div className="grid gap-4">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`/projects/${p.id}`}
              className="bg-white rounded shadow p-4 hover:bg-gray-50 transition"
            >
              <h2 className="font-bold text-lg">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.description}</p>
            </a>
          ))}
        </div>
      </div>
    </Protected>
  );
}
