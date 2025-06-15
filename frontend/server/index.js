import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, isAdmin: user.is_admin }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.is_admin } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Posts routes
app.get('/api/posts', async (req, res) => {
  try {
    const [posts] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', authenticateToken, upload.array('media'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const mediaUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const [result] = await pool.query(
      'INSERT INTO posts (title, content, media_urls, author_id) VALUES (?, ?, ?, ?)',
      [title, content, JSON.stringify(mediaUrls), req.user.id]
    );
    
    res.json({ id: result.insertId, title, content, mediaUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/posts/:id', authenticateToken, upload.array('media'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const mediaUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    await pool.query(
      'UPDATE posts SET title = ?, content = ?, media_urls = ? WHERE id = ? AND author_id = ?',
      [title, content, JSON.stringify(mediaUrls), req.params.id, req.user.id]
    );
    
    res.json({ id: req.params.id, title, content, mediaUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = ? AND author_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comments routes
app.get('/api/comments/:postId', async (req, res) => {
  try {
    const [comments] = await pool.query(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC',
      [req.params.postId]
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { postId, emoji } = req.body;
    const [result] = await pool.query(
      'INSERT INTO comments (post_id, emoji) VALUES (?, ?)',
      [postId, emoji]
    );
    res.json({ id: result.insertId, postId, emoji });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Themes routes
app.get('/api/themes', async (req, res) => {
  try {
    const [themes] = await pool.query('SELECT * FROM themes ORDER BY created_at DESC');
    res.json(themes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/themes/:id', authenticateToken, async (req, res) => {
  try {
    const { name, primaryColor, secondaryColor, backgroundColor, textColor, isActive } = req.body;
    
    if (isActive) {
      await pool.query('UPDATE themes SET is_active = false');
    }
    
    await pool.query(
      `UPDATE themes SET 
        name = ?, 
        primary_color = ?, 
        secondary_color = ?, 
        background_color = ?, 
        text_color = ?, 
        is_active = ?
      WHERE id = ?`,
      [name, primaryColor, secondaryColor, backgroundColor, textColor, isActive, req.params.id]
    );
    
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics routes
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const [[viewsResult], [likesResult], [commentsResult]] = await Promise.all([
      pool.query('SELECT SUM(view_count) as total FROM posts'),
      pool.query('SELECT SUM(like_count) as total FROM posts'),
      pool.query('SELECT COUNT(*) as total FROM comments')
    ]);

    res.json({
      totalViews: viewsResult.total || 0,
      totalLikes: likesResult.total || 0,
      totalComments: commentsResult.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});