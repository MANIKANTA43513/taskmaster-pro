✅ Task Glitch Challenge — ROI Task Manager (Bug Fix Assignment)
A modern Task Management Web App built for Sales Teams to track, manage, and prioritize tasks based on ROI (Return on Investment).
This project is part of an SDE Bug Fix Assignment where the goal is to convert a “glitchy” application into a stable, production-ready product by fixing UI bugs, logical errors, and performance issues.
🚀 Live Demo
✅ Live App URL: https://yourname-taskglitch.vercel.app
✅ GitHub Repo URL: https://github.com/your-username/task-glitch
✅ Screen Recording: https://drive.google.com/...
⚠️ Make sure the live link works in Incognito Mode before submitting.
🎯 Project Objective
This app was intentionally designed with hidden bugs.
My responsibility as a software engineer is to identify and fix 5 critical issues to ensure:
✅ Smooth UI behavior
✅ Correct ROI calculations
✅ Stable sorting
✅ Proper state handling
✅ Production-level stability
📌 Core Features
✅ Add / Edit / Delete tasks
✅ View task details (dialog)
✅ ROI calculation (Revenue ÷ Time Taken)
✅ Sort tasks by ROI + Priority
✅ Search tasks quickly
✅ Filter by Status & Priority
✅ Summary insights dashboard:
Total Revenue
Efficiency
Average ROI
Performance Grade
✅ CSV Import & Export
✅ Undo Delete (Snackbar)
✅ LocalStorage Persistence (No backend)
🧠 How Priority & Sorting Works
Tasks are ranked using the following logic:
✅ Sorting Order
Primary: ROI (High → Low)
Secondary: Priority (High > Medium > Low)
Tie-breaker: Deterministic stable logic
Example:
Alphabetical order of title ✅ OR
ID / Created Time Desc ✅
This prevents list flickering and unstable reorder issues.
🐞 Fixed Bugs (All 5)
✅ Bug 1 — Double Fetch on Page Load
Problem: Data fetch was triggered twice on initial render.
Cause: StrictMode + unstable useEffect dependencies.
Fix: Ensured fetching runs only once and avoids duplicated initialization.
✅ Result: Data loads exactly one time on refresh.
✅ Bug 2 — Undo Snackbar State Not Resetting
Problem: After snackbar closes, the app keeps lastDeletedTask in memory.
This caused incorrect Undo restoration later.
✅ Fix Implemented:
Reset lastDeletedTask → null
Reset isDeleted → false
Done both on:
Auto-close timeout
Manual close
✅ Result: Undo restores only the most recent deleted task (within the snackbar window).
✅ Bug 3 — Unstable Sorting (ROI tie flickering)
Problem: If multiple tasks had the same ROI + priority, list order randomly changed on re-render.
✅ Fix Implemented:
Added stable deterministic tie-breaker
title alphabetical OR id comparison
✅ Result: Task ordering stays consistent across re-renders and reloads.
✅ Bug 4 — Double Dialog Opening (Event Bubbling)
Problem: Clicking Edit/Delete triggered both:
View Dialog (row click)
Edit/Delete dialog (button click)
✅ Fix Implemented:
Added e.stopPropagation() on Edit/Delete button click handlers
✅ Result:
Clicking task row → opens only View
Clicking Edit → opens only Edit
Clicking Delete → opens only Delete
✅ Bug 5 — ROI Validation Error (Infinity / NaN issues)
Problem: ROI calculation broke when:
TimeTaken = 0
Inputs empty/invalid
Revenue missing
✅ Fix Implemented:
Validation before calculation
Safe fallback ROI (0 or “—”)
Proper numeric formatting (2 decimals)
✅ Result: No more Infinity, NaN, or broken UI values.
🛠️ Tech Stack
React 18+
Tailwind CSS
Lucide React Icons
LocalStorage (persistent data storage)
Vite (fast development bundler)
📂 Folder Structure (Important Files)
Copy code

task-glitch/
│
├── src/
│   ├── components/        # UI components (dialogs, forms, cards)
│   ├── utils/             # ROI calculation helpers, sorting logic
│   ├── pages/             # Main views/screens
│   ├── App.jsx            # Main app
│   ├── main.jsx           # React entry point
│
├── public/
├── package.json
└── README.md
⚙️ Setup & Run Locally
✅ 1) Clone Repository
Copy code
Bash
git clone https://github.com/your-username/task-glitch.git
cd task-glitch
✅ 2) Install Dependencies
Copy code
Bash
npm install
✅ 3) Start Development Server
Copy code
Bash
npm run dev
App runs on:
Copy code

http://localhost:5173
🌍 Deployment (Vercel / Netlify)
✅ Deploy using Vercel
Push code to GitHub
Open Vercel → Import project
Build Command:
Copy code
Bash
npm run build
Output Directory:
Copy code
Bash
dist
✅ After deployment, confirm live app works in Incognito Mode.
✅ Submission Checklist
✅ GitHub repository link added
✅ Live hosted link added (Vercel/Netlify)
✅ Screen recording link added
✅ All 5 bugs fixed
✅ Clean commit history (not one big commit)
✅ README updated properly
📸 Screen Recording Requirements (2–3 mins)
The video should show:
✅ One bug fix in code
✅ Updated result in UI
✅ Proof that issue is solved
Example: Click Edit → only edit dialog opens, no view dialog popup.
📊 Evaluation Rubric
Criteria
Weight
Bug Fixes
50%
Code Quality
20%
UX/UI Stability
20%
Deployment
10%
👨‍💻 Author
Marikanta
📧 Email: your-email@gmail.com
🔗 GitHub: https://github.com/your-username
🔗 LinkedIn: https://linkedin.com/in/your-profile
