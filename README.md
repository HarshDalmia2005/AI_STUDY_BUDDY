# 🎓 MentorMate — AI Study Assistant

> Turn messy handwritten notes into structured learning material with AI explanations, voice support, and auto-generated quizzes.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Smart OCR** | Upload handwritten notes (image/PDF) → AI extracts text instantly |
| **AI Explanations** | Step-by-step concept breakdowns in simple language |
| **Multilingual Audio** | Text-to-Speech tutoring in English, Hindi, Bengali, Tamil |
| **Auto Quizzes** | MCQ & short-answer questions generated from your notes |
| **Weak Topic Tracker** | Identifies topics you struggle with + revision recommendations |
| **Progress Analytics** | Visual charts tracking quiz scores, activity, and topic accuracy |
| **Dark Mode** | Beautiful dark/light theme with glassmorphism design |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite + TailwindCSS v4 |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **AI** | Groq (Llama 3.2 Vision for OCR, Llama 3.3 70B for explanations & quizzes) |
| **Audio** | Web Speech API (browser-native TTS) |
| **Auth** | JWT (JSON Web Tokens) |
| **Charts** | Recharts |

---

## 📁 Project Structure

```
HACKATHON/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/layout/  # Sidebar, AppLayout
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # All 10 page components
│   │   ├── services/           # API service layer
│   │   ├── App.jsx             # Router + route config
│   │   └── index.css           # Tailwind + custom styles
│   └── index.html
├── server/                     # Express Backend
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Auth, Note, Quiz, Analytics
│   ├── middleware/auth.js      # JWT verification
│   ├── models/                 # User, Note, Quiz, WeakTopic
│   ├── routes/                 # API route definitions
│   ├── services/               # OCR, Explanation, Quiz AI services
│   └── server.js               # Entry point
├── .env                        # Environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally or a MongoDB Atlas cloud URI
- **Groq API Key** (free tier works) — [Get one here](https://console.groq.com/keys)

### 1. Configure Environment

Edit the `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mentormate
JWT_SECRET=your_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

| Variable | How to Get It |
|----------|--------------|
| `MONGODB_URI` | Local: `mongodb://localhost:27017/mentormate` · Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster |
| `JWT_SECRET` | Any random string — generate one at [randomkeygen.com](https://randomkeygen.com/) |
| `GROQ_API_KEY` | [Groq Console](https://console.groq.com/keys) → Create API Key (free) |

> **Note:** Without a Groq API key, all AI features gracefully fallback to realistic mock data — the app is fully demo-able without any keys.

### 2. Install & Start Backend

```bash
cd server
npm install
node server.js
```

Server starts at `http://localhost:5000`

### 3. Install & Start Frontend

```bash
cd client
npm install
npm run dev
```

App opens at `http://localhost:5173`

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero section, features, CTA |
| Login | `/login` | Email/password authentication |
| Signup | `/signup` | New account registration |
| Forgot Password | `/forgot-password` | Password reset request |
| Dashboard | `/dashboard` | Stats, recent notes, quick actions |
| Upload Notes | `/upload` | Drag-and-drop file upload with language selection |
| Note Analysis | `/notes/:id` | Original image + extracted text + explanation + audio player |
| My Notes | `/notes` | Searchable grid of all processed notes |
| Quiz | `/quiz/:id` | Interactive MCQ & short-answer quiz with scoring |
| Quiz History | `/quiz-history` | All past quizzes with scores |
| Analytics | `/analytics` | Charts for scores, activity, and weak topics |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/profile` | Get current user (auth required) |
| POST | `/api/auth/forgot-password` | Request password reset |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notes/upload` | Upload image/PDF for OCR + AI analysis |
| GET | `/api/notes` | List all user notes (paginated) |
| GET | `/api/notes/search?q=` | Full-text search notes |
| GET | `/api/notes/:id` | Get single note with explanation |
| DELETE | `/api/notes/:id` | Delete a note |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz/generate/:noteId` | Generate quiz from a note |
| POST | `/api/quiz/submit/:quizId` | Submit answers and get score |
| GET | `/api/quiz/history` | Get quiz history |
| GET | `/api/quiz/:id` | Get single quiz |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard summary stats |
| GET | `/api/analytics/weak-topics` | Weak topic list |
| GET | `/api/analytics/progress` | Progress data for charts |

---

## 🎨 Design Highlights

- **Dark mode** by default with light mode toggle
- **Glassmorphism** card designs with backdrop blur
- **Gradient accents** (indigo → purple → pink)
- **Smooth animations** — slide-in, float, glow pulse
- **Collapsible sidebar** navigation
- **Responsive** — works on desktop and mobile
- **Google Inter** font for clean typography

---

## 👥 Team

Built with ❤️ for students at Hackathon 2026.
