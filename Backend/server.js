require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

// Ensure uploads folder exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const JWT_SECRET = 'your_super_secret_key_change_this';

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.fieldname + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware: Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 1. Connect to MongoDB
const dbURI = 'mongodb+srv://nehasharma900105_db_user:PCEf3PFUf0XOds8e@spacesync.3jmk0jo.mongodb.net/?appName=spacesync';

mongoose.connect(dbURI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("DB Connection Error:", err));

// 2. User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 3. ROUTES

// Single image upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({ imageUrl: `http://localhost:3001/uploads/${req.file.filename}` });
});

// Multi-image upload for 6 room sides (right, left, top, bottom, front, back)
const roomSideFields = [
  { name: 'right', maxCount: 1 },
  { name: 'left', maxCount: 1 },
  { name: 'top', maxCount: 1 },
  { name: 'bottom', maxCount: 1 },
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 },
];

app.post('/api/upload-room-sides', upload.fields(roomSideFields), (req, res) => {
  if (!req.files) return res.status(400).json({ error: 'No files uploaded.' });

  const urls = {};
  for (const side of ['right', 'left', 'top', 'bottom', 'front', 'back']) {
    if (req.files[side] && req.files[side][0]) {
      urls[side] = `http://localhost:3001/uploads/${req.files[side][0].filename}`;
    }
  }

  res.json({ urls });
});

app.get('/api/profile', (req, res) => {
    res.json({ username: "User", email: "user@example.com" });
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await new User({ email, username, password: hashedPassword }).save();
        res.status(201).json({ message: "User registered!" });
    } catch (err) { res.status(500).send("Error"); }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User not found");
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) res.json({ token: "fake-jwt-token", username: user.username });
        else res.status(403).send("Incorrect password");
    } catch (err) { res.status(500).send("Error"); }
});

// AI Chat endpoint using Gemini
app.post('/api/chat', async (req, res) => {
  const { message, roomData } = req.body;

  const prompt = `
    You are the SpaceSync AI Assistant — a professional interior design consultant.
    Current Room Context: Budget is ${roomData?.budget || 'unspecified'}, Spatial Focus is ${roomData?.spatialFocus || 'unspecified'}.
    User Query: ${message}.
    Provide a concise, professional design recommendation considering the spatial constraints.
    Keep your response under 150 words.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));