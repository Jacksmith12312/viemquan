import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

app.use(express.json());

// Helper function to read DB
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Ensure directory and file exist
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify({ about: {}, skills: [], experience: [], projects: [], messages: [] }, null, 2));
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from database file:', error);
    return { about: {}, skills: [], experience: [], projects: [], messages: [] };
  }
}

// Helper function to write DB
function writeDB(data: any) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

// Global Secret for Admin Route (Authentication)
const ADMIN_EMAIL = 'admin@portfolio.com';
const ADMIN_PASSWORD = 'admin'; // Clean defaults for development and AI Studio
const ADMIN_TOKEN = 'portfolio-admin-super-secure-token-2026';

// Middleware to authenticate admin requests
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    res.status(401).json({ error: 'Unauthorized credentials. Access denied.' });
    return;
  }
  next();
}

// Auth Login API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN, user: { email: ADMIN_EMAIL, name: 'Lead Developer' } });
  } else {
    res.status(400).json({ success: false, error: 'Invalid email or password' });
  }
});

// GET CV data (public API)
app.get('/api/cv', (req, res) => {
  const db = readDB();
  // Don't leak recruiter messages on public endpoints
  const { messages, ...publicCV } = db;
  res.json(publicCV);
});

// POST update CV about data (requires admin)
app.post('/api/cv/about', requireAdmin, (req, res) => {
  const db = readDB();
  db.about = { ...db.about, ...req.body };
  writeDB(db);
  res.json({ success: true, about: db.about });
});

// POST CRUD Skills (requires admin)
app.post('/api/cv/skills', requireAdmin, (req, res) => {
  const db = readDB();
  db.skills = req.body; // Full sync list of skills
  writeDB(db);
  res.json({ success: true, skills: db.skills });
});

// POST CRUD Experience (requires admin)
app.post('/api/cv/experience', requireAdmin, (req, res) => {
  const db = readDB();
  db.experience = req.body; // Full sync lists
  writeDB(db);
  res.json({ success: true, experience: db.experience });
});

// POST CRUD Projects (requires admin)
app.post('/api/cv/projects', requireAdmin, (req, res) => {
  const db = readDB();
  db.projects = req.body; // Full sync projects list
  writeDB(db);
  res.json({ success: true, projects: db.projects });
});

// GET Recruiter Messages (requires admin)
app.get('/api/messages', requireAdmin, (req, res) => {
  const db = readDB();
  res.json(db.messages || []);
});

// POST recruiter submits new message (public API)
app.post('/api/messages/submit', (req, res) => {
  const { name, company, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: 'Name, Email, Subject and Message are required' });
    return;
  }
  const db = readDB();
  const newMessage = {
    id: `msg-${Date.now()}`,
    name,
    company: company || 'Self-Employed / Unknown',
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  db.messages = db.messages || [];
  db.messages.unshift(newMessage);
  writeDB(db);
  res.json({ success: true, message: 'Your message has been sent successfully!' });
});

// POST read toggle message state (requires admin)
app.post('/api/messages/:id/read', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.messages = db.messages || [];
  const msgIndex = db.messages.findIndex((m: any) => m.id === id);
  if (msgIndex !== -1) {
    db.messages[msgIndex].read = !db.messages[msgIndex].read;
    writeDB(db);
    res.json({ success: true, message: db.messages[msgIndex] });
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

// DELETE recruiter message (requires admin)
app.delete('/api/messages/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.messages = db.messages || [];
  const filtered = db.messages.filter((m: any) => m.id !== id);
  db.messages = filtered;
  writeDB(db);
  res.json({ success: true, id });
});

async function run() {
  // Vite integration in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Professional Portfolio server running at http://localhost:${PORT}`);
  });
}

run().catch((err) => {
  console.error('Failed to start server:', err);
});
