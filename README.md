# Campus Connect

A real-time, peer-to-peer errand platform for college campuses. Students post small tasks (grab a printout, pick up a parcel, drop something at the library) and fellow students nearby pick them up, with live chat to coordinate.

Built to solve a real problem we saw on campus: everyone's always rushing between classes, and someone is usually heading the same way anyway.

**Live demo:** `http://campus-connect-frontend-yashdharak.s3-website.eu-north-1.amazonaws.com/`

---

## Features

- **Auth with JWT**: sign up / log in, protected routes, token-based sessions
- **Post an errand**: describe the task, pickup/drop location, and an optional reward
- **Browse & accept errands**: see what's open on campus and take one on
- **Real-time chat**: Socket.io powered messaging between the requester and the helper
- **Live status updates**: errands move from open → accepted → completed without refreshing
- **Responsive UI**: works on phone, since that's where people will actually use it

> Trim or edit this list to match exactly what's shipped.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Real-time | Socket.io |
| Auth | JSON Web Tokens (JWT) |
| Deployment | Render / Vercel (frontend), AWS EC2 + PM2 (backend) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/campus-connect.git
cd campus-connect
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the app:

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`.

## Project Structure

```
campus-connect/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── server/              # Express backend
│   ├── controllers/
│   ├── middleware/      # JWT auth middleware
│   ├── models/
│   ├── routes/
│   ├── socket/          # Socket.io handlers
│   └── server.js
└── README.md
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/errands` | List open errands |
| POST | `/api/errands` | Create an errand (auth required) |
| PATCH | `/api/errands/:id/accept` | Accept an errand (auth required) |
| PATCH | `/api/errands/:id/complete` | Mark an errand complete (auth required) |

> Update routes to match your actual backend.

### Socket events

| Event | Direction | Purpose |
|---|---|---|
| `join_room` | client → server | Join the chat room for an errand |
| `send_message` | client → server | Send a chat message |
| `receive_message` | server → client | Deliver a message to the room |

## Deployment

- **Backend:** Ubuntu on AWS EC2, process managed with PM2
- **Frontend:** AWS S3

## Challenges & What I Learned

- Debugging Express **route ordering** issues (a catch-all param route swallowing more specific routes)
- Keeping **chat UI** from overflowing as message history grows
- Wiring **Socket.io** auth so only the two people on an errand can join its room
- Rebuilding the whole project from scratch after losing the original code, which ended up making the architecture cleaner

## Roadmap

- [ ] Push / email notifications for new nearby errands
- [ ] Ratings and reviews for helpers
- [ ] In-app payments or reward tracking
- [ ] Campus email verification

## Contributors

- [Dharak Upadhyay](https://github.com/dharak1975)
- [Yashwardhan Singh](https://github.com/yashmnit)



