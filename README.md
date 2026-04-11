# Smart Study Planner

An AI-powered study planning web app that helps students manage their coursework, generate personalized study schedules, and turn lecture PDFs into instant study notes.

Built with React, Vite, Tailwind CSS, and the Google Gemini API.

> **Course:** _[Your course name]_
> **Student:** _[Your name]_
> **Instructor:** _[Instructor name]_

---

## What it does

Smart Study Planner takes the guesswork out of studying. Instead of staring at a list of assignments and wondering where to start, students enter their subjects, assignments, and exams, and the app uses Google's Gemini AI to build a realistic, prioritized study schedule day by day. Students can also upload lecture PDFs and the AI will generate brief, focused study notes from them automatically.

The goal is to reduce student stress by replacing vague to-do lists with clear, specific daily tasks that explain *why* each session matters.

---

## Features

1. **Subject & assignment management** — Add courses with difficulty ratings, then track homework, essays, exams, and projects with due dates and estimated hours.
2. **AI schedule generation** — Gemini reads the student's full course load and generates a 14-day plan with specific tasks, durations, priorities, and reasoning for each session.
3. **Today view** — Shows the current day's sessions front and center, color-coded by priority, with the AI's strategy summary at the top.
4. **Local persistence** — Everything is saved to the browser's localStorage via a custom `useLocalStorage` hook, so the app remembers everything between sessions with no backend needed.
5. **Calendar export (.ics)** — One-click download of the full schedule as a standard iCalendar file. Importable into Google Calendar, Outlook, Apple Calendar, and any other calendar app.
6. **PDF upload + AI notes** — Upload a lecture or chapter PDF (up to 5MB) and Gemini reads it, returning a concise paragraph of key concepts, focus areas, common mistakes to avoid, and a study tip.
7. **Google Calendar integration** — One click opens each of today's study sessions in Google Calendar with the title, time, and description pre-filled, ready to save.

---

## Screenshots

### Today view
![Today view](![](image.png))

### Full schedule
![Schedule view](![](image-1.png))

### Subjects & assignments
![Subjects view](![alt text](image-2.png))

### AI-generated notes from PDFs
![Materials view](screenshots/materials.png)

---

## Tech stack

- **React 18** with hooks for all state management
- **Vite** as the build tool and dev server
- **Tailwind CSS** for styling
- **Google Generative AI SDK** (`@google/generative-ai`) for Gemini API calls
- **lucide-react** for icons
- **No backend** — runs entirely in the browser

---

## How to run it locally

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd smart-study-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
   You can get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/).

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How it works

The core of the app is two Gemini API calls:

**1. Schedule generation.** When the user clicks "Generate plan," the app builds a structured JSON object describing all subjects, assignments, available study hours, and which subjects have uploaded materials. This is sent to `gemini-flash-latest` along with a detailed system prompt that defines the output schema and 10 planning rules (spaced repetition, lighter days before exams, never overscheduling, etc.). The model returns a full JSON schedule which is parsed and saved to localStorage.

**2. PDF note generation.** When the user uploads a PDF, it's read in the browser as base64 and sent directly to Gemini as inline data alongside a prompt asking for brief study notes. Gemini returns a single paragraph of focused notes which are saved to the materials list.

For the calendar features, the `.ics` export builds a standard iCalendar file in pure JavaScript (no library needed), and the Google Calendar integration constructs pre-filled event creation URLs that open in a new tab. All data lives in localStorage under five keys (`ssp-view`, `ssp-subjects`, `ssp-assignments`, `ssp-materials`, `ssp-schedule`), each managed by the `useLocalStorage` custom hook.

---

## Project structure

```
smart-study-planner/
├── src/
│   ├── App.jsx              # Main app component with all views
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind imports
│   ├── hooks/
│   │   └── useLocalStorage.js   # Custom hook for persistent state
│   └── utils/
│       ├── icsExport.js     # iCalendar file generator
│       └── googleCalendar.js    # Google Calendar URL builder
├── screenshots/             # README screenshots
├── public/
├── .env.local               # Gemini API key (not committed)
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Known limitations & future work

- **Google Calendar sync uses link-based events, not OAuth.** The current integration opens Google Calendar in a new tab with each event pre-filled, which the user then saves with one click. Adding direct OAuth-based two-way sync was considered but deferred — it adds significant complexity (OAuth consent screens, token refresh, redirect URIs) that wasn't justified given that the link-based approach achieves the same end result in the user's actual Google Calendar.
- **Single-user, single-device.** Because all data lives in localStorage, the app doesn't sync across devices and doesn't support multiple users. Adding a backend with authentication would be the natural next step for a production version.
- **PDF size limit.** Files over 5MB are rejected to stay within Gemini's inline data limits. Larger PDFs would need to be uploaded via Gemini's File API instead.
- **No offline AI.** Both AI features require an internet connection and a valid Gemini API key.

---

## Credits

Built as a school project. AI features powered by Google Gemini.
