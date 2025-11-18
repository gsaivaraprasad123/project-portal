"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import Protected from "../../../components/Protected";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader
} from "../../../components/ui/dialog";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "../../../components/ui/select";

export default function ProjectDetails() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);

  // Dialog states
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [assignUserId, setAssignUserId] = useState("");
  const [assignRole, setAssignRole] = useState("viewer");

  // Fetch project + users
  function loadProject() {
    apiFetch(`/projects/${id}`)
      .then((data) => {
        setProject(data);
        setName(data.name);
        setDesc(data.description);
      })
      .catch((err) => toast.error(err.message));

    apiFetch(`/clients/me/users`)
      .then(setUsers)
      .catch((err) => toast.error(err.message));
  }

  useEffect(() => {
    loadProject();
  }, []);

  // Update project
  async function updateProject() {
    try {
      await apiFetch(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name, description: desc })
      });

      toast.success("Project updated");
      setEditOpen(false);
      loadProject();
    } catch (err) {
      toast.error(err.message);
    }
  }

  // Delete project
  async function deleteProject() {
    try {
      await apiFetch(`/projects/${id}`, { method: "DELETE" });
      toast.success("Project deleted");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  }

  // Assign user to project
  async function assignUser() {
    try {
      await apiFetch(`/projects/${id}/users`, {
        method: "POST",
        body: JSON.stringify({ user_id: assignUserId, role: assignRole })
      });

      toast.success("User assigned");
      setAssignOpen(false);
      loadProject();
    } catch (err) {
      toast.error(err.message);
    }
  }

  // Change role
  async function changeRole(userId, role) {
    try {
      await apiFetch(`/projects/${id}/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ role })
      });

      toast.success("Role updated");
      loadProject();
    } catch (err) {
      toast.error(err.message);
    }
  }

  // Remove user
  async function removeUser(userId) {
    try {
      await apiFetch(`/projects/${id}/users/${userId}`, {
        method: "DELETE"
      });

      toast.success("User removed");
      loadProject();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!project) return <div className="p-6">Loading...</div>;

  return (
    <Protected>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-700">{project.description}</p>
          </div>

          <div className="flex gap-2">

            {/* Edit Project */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button>Edit</Button>
              </DialogTrigger>

              <DialogContent className="p-6">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">

                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project Name"
                  />

                  <Input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Description"
                  />

                  <Button onClick={updateProject}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete */}
            <Button variant="destructive" onClick={deleteProject}>
              Delete
            </Button>
          </div>
        </div>

        {/* Assigned Users */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Assigned Users</h2>

          {project.projectUsers.length === 0 && (
            <p>No users assigned yet.</p>
          )}

          {project.projectUsers.map((pu) => (
            <div key={pu.id} className="p-4 bg-white shadow rounded flex justify-between items-center">

              <div>
                <div className="font-semibold">{pu.user.email}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {pu.role}
                </div>
              </div>

              <div className="flex gap-2 items-center">

                {/* Change role */}
                <Select
                  onValueChange={(v) => changeRole(pu.userId, v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={pu.role} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                {/* Remove user */}
                <Button variant="destructive" onClick={() => removeUser(pu.userId)}>
                  Remove
                </Button>
              </div>

            </div>
          ))}
        </div>

        {/* Assign User */}
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 text-white w-full">
              Assign User
            </Button>
          </DialogTrigger>

          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle>Assign User to Project</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">

              {/* Select User */}
              <Select onValueChange={setAssignUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>

                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Select Role */}
              <Select onValueChange={setAssignRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={assignUser}>Assign</Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </Protected>
  );
}
