
# 🗳️ Online Voting System

A simple, secure, and lightweight online voting system built with **React** (frontend) and **Node.js + Express + MongoDB** (backend). It supports both user and admin roles, ensuring a smooth digital voting experience.

---

## 📁 Project Structure

```
voting-system/
├── backend/          # Node.js + Express + MongoDB API
├── frontend/         # React app for voters & admin
└── README.md         # Project documentation
```

---

## 🚀 Features

- ✅ Secure user login with Aadhar & Voting Card number
- 🗳️ One vote per user (prevents duplicate votes)
- 👨‍💼 Admin dashboard to view all votes in real time
- 🧩 Clean UI with party logos and confirmation prompts
- 📊 Vote summary for admin (with timestamps)

---

## 🛠️ Tech Stack

### Frontend
- React
- Axios
- PropTypes
- Custom CSS

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- dotenv
- cors
- express-mongo-sanitize *(optional for security)*

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yadavkuldeep7801/voting-system.git
cd voting-system
```

---

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

### 4. Setup Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URI=mongodb://localhost:27017/votingSystem
PORT=5000
```

---

### 5. Run the App

#### Backend (PORT 5000):
```bash
npm start
```

#### Frontend (PORT 3000):
```bash
npm start
```

---

## 📦 API Endpoints

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| POST   | `/login`             | User login with credentials |
| POST   | `/vote`              | Cast a vote              |
| GET    | `/admin/votes`       | View all votes (admin)   |

---

## 🔐 Admin Access

To log in as an admin, use the following Aadhar number:
```
999999999999
```

---

## 📸 Screenshots

> _Add screenshots of login page, voting interface, and admin dashboard here._

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

MIT License © 2025 [Kuldeep Yadav](https://github.com/yadavkuldeep7801)
