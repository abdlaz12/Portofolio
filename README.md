# AZ1 — Personal Portfolio

A full-stack personal portfolio website built with **Next.js 16**, **TypeScript**, and **MongoDB**. Designed to showcase projects professionally with a built-in admin CMS for easy content management — no third-party CMS needed.

---

## ✨ Features

### Public-Facing
- **Hero Section** — Animated landing page with profile photo, headline, stats, and CTA buttons
- **Projects Gallery** — Filterable project cards with category tags, tech stack badges, cover images, and links to GitHub / live demo
- **Project Detail Page** — Rich text content rendered per project via dynamic routing (`/projects/[slug]`)
- **Contact Section** — Direct email CTA
- **Custom Cursor** — Smooth custom cursor experience on desktop
- **Fully Responsive** — Mobile-first layout, looks great on all screen sizes

### Admin Panel (`/admin`)
- **Protected Dashboard** — Login-protected using NextAuth.js (credential-based auth)
- **Project Management** — Create, edit, publish/unpublish, and delete projects
- **Rich Text Editor** — TipTap editor for writing project content with formatting
- **Settings Page** — Site configuration
- **Stats Overview** — Live count of total, published, and draft projects

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS Modules |
| Database | MongoDB via [Mongoose](https://mongoosejs.com/) |
| Auth | [NextAuth.js v5](https://authjs.dev/) (Credentials) |
| Rich Text | [TipTap](https://tiptap.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Fonts | Inter + Barlow Condensed (Google Fonts) |
| Deployment | Vercel (recommended) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home / landing page
│   ├── layout.tsx            # Root layout (fonts, metadata)
│   ├── globals.css           # Global styles & design tokens
│   ├── admin/                # Admin dashboard (protected)
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── projects/         # Project CRUD pages
│   │   └── settings/         # Site settings
│   ├── projects/
│   │   └── [slug]/           # Dynamic project detail pages
│   ├── login/                # Login page
│   └── api/                  # API routes (auth, projects, settings)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── AnimatedProjectCard.tsx
│   └── CustomCursor.tsx
├── lib/
│   ├── auth.ts               # NextAuth config
│   └── mongodb.ts            # Mongoose connection
└── models/
    └── Project.ts            # Mongoose Project schema
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [MongoDB](https://www.mongodb.com/atlas) database (Atlas free tier works great)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio

# NextAuth
AUTH_SECRET=your_random_secret_string_here
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=yourpassword
```

> **Tip:** Generate a secure `AUTH_SECRET` by running: `openssl rand -base64 32`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
Admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment

This project is optimized for deployment on **Vercel**.

1. Push your repository to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` to Vercel's project settings
4. Deploy — Vercel handles the rest automatically

---

## 📸 Screenshots

> Coming soon after deployment.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Ajish Artanto (AZ1)**
- Email: ajishartanto45@gmail.com
- GitHub: [@abdlaz12](https://github.com/abdlaz12)
- Portfolio: _your deployed URL here_
