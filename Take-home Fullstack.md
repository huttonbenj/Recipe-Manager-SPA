---

### **Project: Recipe Manager SPA with Node.js + PostgreSQL**

---

### **Objective:**

Develop a complete Single Page Application (SPA) where users can browse, search, and manage recipes. The frontend will be built in **React**, and the backend will use **Node.js with Express**, connected to a **PostgreSQL** database.

---

### **Overview:**

This full-stack app should feel like a lightweight CRM for recipe records — CRUD operations, structured modeling, responsive layout, and robust validation. Use a RESTful API to interact with the backend and preload the database with 10 sample recipes.

---

### **Functional Requirements:**

#### **Frontend (React SPA):**

- Built with **React** and **React Router**
- Styling with **Tailwind CSS** or **Bootstrap**
- Views:
  - List of all recipes (with optional cover thumbnails)
  - Recipe detail view
  - Add/edit form
- Fully responsive across:
  - Mobile: ≤768px
  - Tablet: 768–1024px
  - Desktop: ≥1024px
- Search by title or ingredients
- Client-side validation and feedback

#### **Backend (Node.js + Express):**

- RESTful API built with Express
- **PostgreSQL** as the relational database
- Tables should support:
  - `recipes` with fields: `id`, `title`, `ingredients`, `instructions`, `image_url`, `created_at`, `updated_at`
- REST Endpoints:
  - `GET /recipes`
  - `GET /recipes/:id`
  - `POST /recipes`
  - `PUT /recipes/:id`
  - `DELETE /recipes/:id`
- Input validation and status-based error responses
- Include database seed script with at least **10 sample recipes**
- Use an ORM like **Prisma** or **Sequelize** (recommended for clarity and migrations)

---

### **Bonus Points:**

- Add **image upload** support (e.g. `Multer` with local storage or external like Cloudinary)
- Use **Context API** or **Redux** for state management
- Secure routes with **JWT authentication**
- Deploy:
  - **Frontend** to Vercel, Netlify, or Firebase
  - **Backend** to Render, Railway, or your preferred Node.js hosting platform
  - PostgreSQL DB via **Neon**, **Supabase**, or **ElephantSQL**
- Provide `.env.example` and SQL schema documentation
- Add search optimization using Postgres full-text search or `ILIKE` queries

---

### **Deliverables:**

- GitHub repo containing:
  - Frontend and backend codebases
  - SQL schema and seed script
  - Clear README with setup, installation, and deployment steps
- A short write-up explaining:
  - Your architecture and schema decisions
  - API structure and data flow
  - Special features or enhancements added

---
