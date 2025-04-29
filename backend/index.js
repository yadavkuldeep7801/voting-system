const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Load environment variables
dotenv.config();

// App Initialization
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/votingSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Mongoose Schema & Model
const voteSchema = new mongoose.Schema({
  aadhar: { type: String, required: true },
  votingCard: { type: String, required: true },
  party: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

voteSchema.index({ aadhar: 1, votingCard: 1 }, { unique: true });
const Vote = mongoose.model('Vote', voteSchema);

// Admin Aadhar
const ADMIN_AADHAR = '999999999999';

// Routes

// Login Route
app.post('/login', async (req, res) => {
  const { aadhar, votingCard } = req.body;

  if (!aadhar || !votingCard) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  const isAdmin = aadhar === ADMIN_AADHAR;
  return res.json({ isAdmin });
});

// Vote Submission
app.post('/vote', async (req, res) => {
  const { aadhar, votingCard, party } = req.body;

  try {
    const existingVote = await Vote.findOne({ aadhar, votingCard });
    if (existingVote) {
      return res.status(400).json({ message: 'User has already voted' });
    }

    const newVote = new Vote({ aadhar, votingCard, party });
    await newVote.save();

    res.json({ message: 'Vote submitted successfully' });
  } catch (err) {
    console.error('Vote Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: Get all votes
app.get('/admin/votes', async (req, res) => {
  try {
    const votes = await Vote.find({});
    res.json(votes);
  } catch (err) {
    console.error('Fetch Votes Error:', err);
    res.status(500).json({ message: 'Error fetching votes' });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
