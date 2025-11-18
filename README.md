
# 🚀 Project Portal – Full Stack Application  
A complete Project Management Portal built with:

- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL, JWT Auth  
- **Frontend:** Next.js 16 (App Router), React 19, TailwindCSS 4, shadcn/ui, Sonner toast  
- **Auth:** JWT (access token), client-level RBAC + project-level roles  
- **Database:** Postgres with Prisma Schema

This system allows companies to manage projects, assign users, and control permissions using role-based access.

---

# 🧱 Features

### 🔐 Authentication & User Management  
- Register (email, password, client organization, global role)  
- Login with JWT  
- Secure password hashing (bcrypt)  
- Global user roles: `admin` | `member`  
- `/auth/me` endpoint to fetch logged-in user  

### 📁 Project Management  
- Create, update, delete projects  
- Projects belong to a client/company  
- Only Admins or Project Owners can modify projects  

### 👥 Project User Assignment  
- Assign users to projects with role:  
  - `owner`, `developer`, `viewer`  
- Update user role on project  
- Remove user from project  
- List assigned users  

### 🌐 Frontend  
- Fully responsive UI (Next.js 16 App Router)  
- Login & Register pages  
- Dashboard with project list  
- Project Details page  
- Assign users, edit project, delete project  
- Global Navbar + Logout  
- shadcn/ui components  
- Sonner toast notifications  
- Protected routes using client-side auth  

---

# 📦 Tech Stack

### Backend  
- Node.js  
- Express  
- Prisma ORM  
- PostgreSQL  
- JSON Web Tokens (JWT)  
- bcryptjs  

### Frontend  
- Next.js 16 (App Router)  
- React 19  
- TailwindCSS 4  
- shadcn/ui components  
- Sonner for toasts  

---

# 📁 Folder Structure

```

project-portal/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── prisma.js
│   │   └── server.js
│   └── package.json
│
└── frontend/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   └── projects/[id]/
│   ├── components/
│   │   └── ui/
│   └── lib/
├── public/
├── package.json
└── tailwind.config.js

````

---

# ⚙️ Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
````

### 2. Create `.env` file

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/project_portal"
JWT_SECRET="supersecret"
JWT_EXPIRES_IN="3600s"
PORT=4000
```

### 3. Prisma setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed the database

```bash
npm run seed
```

Creates:

| Email                                     | Password  | Role   |
| ----------------------------------------- | --------- | ------ |
| [admin@acme.com](mailto:admin@acme.com)   | admin123  | admin  |
| [member@acme.com](mailto:member@acme.com) | member123 | member |

### 5. Start backend

```bash
npm run dev
```

The backend runs at:

👉 **[http://localhost:4000](http://localhost:4000)**

---

# ⚙️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

👉 **[http://localhost:3000](http://localhost:3000)**

---

# 🔌 API Endpoints Overview

### Auth

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/auth/register` | Create new user            |
| POST   | `/api/auth/login`    | Login + get JWT            |
| GET    | `/api/auth/me`       | Get current logged-in user |

### Projects

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/projects`     | List all projects |
| POST   | `/api/projects`     | Create project    |
| GET    | `/api/projects/:id` | Project details   |
| PUT    | `/api/projects/:id` | Update project    |
| DELETE | `/api/projects/:id` | Delete project    |

### Project Users

| Method | Endpoint                          |
| ------ | --------------------------------- |
| POST   | `/api/projects/:id/users`         |
| PUT    | `/api/projects/:id/users/:userId` |
| DELETE | `/api/projects/:id/users/:userId` |
| GET    | `/api/projects/:id/users`         |

---

# 🧪 Testing With Postman

A complete **Postman Collection** is included:

* Register
* Login
* Me
* CRUD projects
* Assign users
* Update role
* Remove user

(import JSON included in repo)

---

# 🔐 RBAC Rules

### Global Roles:

* `admin`
* `member`

### Project Roles:

* `owner`
* `developer`
* `viewer`

### Permissions:

| Action         | Admin | Owner | Developer | Viewer |
| -------------- | ----- | ----- | --------- | ------ |
| Create Project | ✔     | ✔     | ✖         | ✖      |
| Update Project | ✔     | ✔     | ✖         | ✖      |
| Delete Project | ✔     | ✔     | ✖         | ✖      |
| Assign Users   | ✔     | ✔     | ✖         | ✖      |
| Change Role    | ✔     | ✔     | ✖         | ✖      |
| View Project   | ✔     | ✔     | ✔         | ✔      |

---

# 🧭 Frontend Features

* 🔐 Login + Register
* 📌 Dashboard (projects list)
* 📝 Create / Edit / Delete projects
* 👥 Assign users to projects
* 🔄 Change user project-role
* 🗑 Remove users
* 🎨 shadcn UI components
* 🔔 Sonner notifications
* 🔒 Protected routes (client-side auth)
* ⭐ Global Navbar + Logout

---

# 🚀 Deployment Notes

### Backend:

* Deploy on Render / Railway / Fly.io
* Use PostgreSQL managed instance
* Add `DATABASE_URL` + `JWT_SECRET`

### Frontend:

* Deploy on Vercel
* Set NEXT_PUBLIC_API_BASE="backend-url"

### CORS:

Configure backend CORS:

```js
app.use(cors({ origin: "*" }));
```

---

# 🏁 Conclusion

This repository demonstrates a clean and production-ready **RBAC-based full-stack application** using modern JavaScript tools:

* Next.js 16
* Express API
* Prisma ORM
* shadcn/ui
* Full JWT login flow
* Project assignment system
* Clean UI & UX

Feel free to extend the system with:

* Drag & drop Kanban
* Activity logs
* Notifications
* Team chats
* File uploads

---

