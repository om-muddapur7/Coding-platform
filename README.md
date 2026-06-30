# 🚀 Online Code Runner

A full-stack online code execution platform inspired by LeetCode that allows users to write, compile, execute, and view the output of code in multiple programming languages.

---

## ✨ Features

* 📝 Interactive code editor
* ⚡ Real-time code execution
* 💻 Supports multiple languages

  * C++
  * JavaScript
  * Python
* 📊 Submission status tracking
* 📤 Asynchronous job processing using Redis
* ⚙️ Background worker for code compilation and execution
* 🗄️ Stores submissions in PostgreSQL using Prisma
* 🔄 Live polling until execution completes
* 🎨 Clean and responsive UI

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Bun
* Axios
* Tailwind CSS
* shadcn/ui

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL (Neon)
* Redis (Upstash)

### Worker

* Node.js
* Redis Queue
* Child Process API
* g++
* Python
* Node Runtime

---

## 🏗️ Architecture

```text
            User
              │
              ▼
      React Frontend
              │
     POST /submission
              │
              ▼
      Express Backend
              │
   Store Submission (Prisma)
              │
      Push Job to Redis
              │
              ▼
        Redis Queue
              │
              ▼
      Background Worker
              │
     Compile / Execute Code
              │
              ▼
     Update PostgreSQL
              │
              ▼
      Frontend Polling
              │
              ▼
      Display Result
```

---

## 📁 Project Structure

```text
.
├── frontend/
│   ├── src/
│   ├── components/
│   └── App.tsx
│
├── backend/
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   └── index.ts
│
├── worker/
│   ├── code/
│   ├── db.ts
│   └── index.ts
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/online-code-runner.git
cd online-code-runner
```

---

### Backend

```bash
cd backend

bun install

bunx prisma generate

bunx prisma migrate dev

bun run index.ts
```

---

### Worker

```bash
cd worker

bun install

bun run index.ts
```

---

### Frontend

```bash
cd frontend

bun install

bun dev
```

---

## 🔑 Environment Variables

### Backend

```env
DATABASE_URL=your_neon_database_url

REDIS_URL=your_upstash_redis_url
```

---

## Supported Languages

| Language   | Compiler / Runtime |
| ---------- | ------------------ |
| C++        | g++                |
| JavaScript | Node.js            |
| Python     | Python             |

---

## Workflow

1. User writes code.
2. Frontend sends the code to the backend.
3. Backend creates a submission record.
4. Submission is pushed into Redis.
5. Worker consumes the job.
6. Worker compiles (if required) and executes the program.
7. Output and status are stored in PostgreSQL.
8. Frontend continuously polls until execution completes.
9. Output is displayed in the terminal panel.

---

## Future Improvements

* Docker-based sandboxing
* Time Limit Exceeded (TLE)
* Memory Limit Exceeded (MLE)
* Runtime Error detection
* Custom test cases
* Multiple file support
* User authentication
* Submission history
* Leaderboard
* Code templates
* Syntax highlighting with Monaco Editor
* Judge against hidden test cases

---

## Screenshots

*Add screenshots or GIFs of the application here.*

---

## License

This project is licensed under the MIT License.

---

## Author

**Om Muddapur**

If you found this project helpful, consider giving it a ⭐ on GitHub.
