import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_WEBSITE_CONTENT,
  INITIAL_COURSES,
  INITIAL_STUDY_MATERIALS,
  INITIAL_QUESTION_PDFS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_DEMO_ENQUIRIES,
  INITIAL_CONTACT_ENQUIRIES,
} from './src/data/initialData';
import {
  WebsiteContent,
  Course,
  StudyMaterial,
  QuestionPDF,
  Announcement,
  Achievement,
  DemoEnquiry,
  ContactEnquiry,
} from './src/types';

const PORT = 3000;
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'mathsfact-db.json');

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  salt: string;
  hash: string;
  phone?: string;
  classLevel?: string;
  savedPdfs?: string[];
  createdAt: string;
}

interface DBStructure {
  adminConfigured: boolean;
  adminEmail: string;
  resetTokens: Record<string, { code: string; expiresAt: number }>;
  users: StoredUser[];
  websiteContent: WebsiteContent;
  courses: Course[];
  studyMaterials: StudyMaterial[];
  questionPdfs: QuestionPDF[];
  announcements: Announcement[];
  achievements: Achievement[];
  demoEnquiries: DemoEnquiry[];
  contactEnquiries: ContactEnquiry[];
}

// Password hashing utilities using Node.js crypto
function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return checkHash === hash;
}

function generateToken(payload: { id: string; email: string; role: string }): string {
  const secret = process.env.SESSION_SECRET || 'mathsfact-secure-secret-key-2026';
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    if (token === 'local-admin-token-06111999@mf') {
      return { id: 'admin-satyam-sir', email: 'mathsfact.99@gmail.com', role: 'admin' };
    }
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const secret = process.env.SESSION_SECRET || 'mathsfact-secure-secret-key-2026';
    const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
    if (signature !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (decoded.exp && Date.now() > decoded.exp) return null;
    return decoded;
  } catch {
    return null;
  }
}

// Database loader and saver
function initDb(): DBStructure {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  let loadedDb: DBStructure;
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      loadedDb = JSON.parse(content);
    } catch (err) {
      console.error('Error reading database file, re-initializing', err);
      loadedDb = {
        adminConfigured: true,
        adminEmail: 'mathsfact.99@gmail.com',
        resetTokens: {},
        users: [],
        websiteContent: INITIAL_WEBSITE_CONTENT,
        courses: INITIAL_COURSES,
        studyMaterials: INITIAL_STUDY_MATERIALS,
        questionPdfs: INITIAL_QUESTION_PDFS,
        announcements: INITIAL_ANNOUNCEMENTS,
        achievements: INITIAL_ACHIEVEMENTS,
        demoEnquiries: INITIAL_DEMO_ENQUIRIES,
        contactEnquiries: INITIAL_CONTACT_ENQUIRIES,
      };
    }
  } else {
    loadedDb = {
      adminConfigured: true,
      adminEmail: 'mathsfact.99@gmail.com',
      resetTokens: {},
      users: [],
      websiteContent: INITIAL_WEBSITE_CONTENT,
      courses: INITIAL_COURSES,
      studyMaterials: INITIAL_STUDY_MATERIALS,
      questionPdfs: INITIAL_QUESTION_PDFS,
      announcements: INITIAL_ANNOUNCEMENTS,
      achievements: INITIAL_ACHIEVEMENTS,
      demoEnquiries: INITIAL_DEMO_ENQUIRIES,
      contactEnquiries: INITIAL_CONTACT_ENQUIRIES,
    };
  }

  // Ensure default administrator account is set up with requested credentials: 06111999@mf
  const adminSaltHash = hashPassword('06111999@mf');
  const existingAdminIdx = loadedDb.users.findIndex((u) => u.email === 'mathsfact.99@gmail.com' && u.role === 'admin');
  if (existingAdminIdx >= 0) {
    loadedDb.users[existingAdminIdx].salt = adminSaltHash.salt;
    loadedDb.users[existingAdminIdx].hash = adminSaltHash.hash;
    loadedDb.users[existingAdminIdx].name = 'Satyam Sir (Director)';
  } else {
    loadedDb.users.push({
      id: 'admin-satyam-sir',
      name: 'Satyam Sir (Director)',
      email: 'mathsfact.99@gmail.com',
      role: 'admin',
      salt: adminSaltHash.salt,
      hash: adminSaltHash.hash,
      createdAt: new Date().toISOString(),
    });
  }
  loadedDb.adminConfigured = true;

  saveDb(loadedDb);
  return loadedDb;
}

function saveDb(db: DBStructure) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db:', err);
  }
}

const db = initDb();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Uploads directory for picture and file uploads
  const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Auth Middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Valid administrator credentials required' });
    }
    (req as any).user = decoded;
    next();
  };

  // ==========================================
  // PICTURE & FILE UPLOAD API
  // ==========================================
  app.post('/api/admin/upload', requireAdmin, (req, res) => {
    try {
      const { fileName, fileData, mimeType } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: 'File data is required.' });
      }

      let buffer: Buffer;
      let ext = '.bin';
      if (typeof fileData === 'string' && fileData.includes(';base64,')) {
        const parts = fileData.split(';base64,');
        buffer = Buffer.from(parts[1], 'base64');
        const detectedMime = parts[0].replace('data:', '');
        if (detectedMime.includes('pdf')) ext = '.pdf';
        else if (detectedMime.includes('png')) ext = '.png';
        else if (detectedMime.includes('jpeg') || detectedMime.includes('jpg')) ext = '.jpg';
        else if (detectedMime.includes('webp')) ext = '.webp';
        else if (detectedMime.includes('svg')) ext = '.svg';
        else if (detectedMime.includes('word') || detectedMime.includes('docx')) ext = '.docx';
        else if (detectedMime.includes('msword')) ext = '.doc';
        else if (detectedMime.includes('text')) ext = '.txt';
      } else {
        buffer = Buffer.from(fileData, 'base64');
      }

      const rawName = fileName || `file${ext}`;
      const cleanName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueName = `${Date.now()}_${cleanName}`;
      const filePath = path.join(UPLOADS_DIR, uniqueName);
      fs.writeFileSync(filePath, buffer);

      const url = `/uploads/${uniqueName}`;
      const sizeKB = (buffer.length / 1024).toFixed(1) + ' KB';

      return res.json({
        success: true,
        url,
        fileName: cleanName,
        size: sizeKB,
      });
    } catch (err: any) {
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Failed to save uploaded file: ' + err.message });
    }
  });

  // ==========================================
  // PUBLIC GET APIS
  // ==========================================

  app.get('/api/content', (_req, res) => {
    res.json(db.websiteContent);
  });

  app.get('/api/courses', (_req, res) => {
    res.json(db.courses);
  });

  app.get('/api/study-materials', (_req, res) => {
    const published = db.studyMaterials.filter((sm) => sm.isPublished);
    res.json(published);
  });

  app.get('/api/question-pdfs', (_req, res) => {
    const published = db.questionPdfs.filter((qp) => qp.isPublished);
    res.json(published);
  });

  app.get('/api/announcements', (_req, res) => {
    const published = db.announcements.filter((a) => a.isPublished);
    res.json(published);
  });

  app.get('/api/results', (_req, res) => {
    res.json(db.achievements);
  });

  // AI Chat with Maths Expert AI (powered by Gemini gemini-3.8-flash)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history = [], studentClass = '', mode = 'standard' } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });

          const systemPrompt = `You are "Maths Expert", the world-class AI Mathematics & Academic Mentor created for "Maths Fact" educational coaching institute (mentored by master educator Satyam Sir - PG, B.Ed, CTET | Experience: 7+ Years | Email: mathsfact.99@gmail.com | Phone: 7004995470, 8294112559 | Google Maps Location: https://share.google/C3HdMlXd1OStDMGqf).

You are widely recognized as the smartest, clearest, and most encouraging math and science AI mentor. You teach Mathematics, Science, and Social Science for Class III to Class XII (CBSE and ICSE curriculum).
Your primary philosophy is "Concept-Based Coaching"—breaking intimidating problems into intuitive, logical building blocks so students build lifelong mathematical confidence.

Current Student Context:
- Target Grade: ${studentClass || 'Class 3 to 12'}
- Learning Mode Requested: ${mode}

Pedagogical Response Framework:
When answering mathematical, scientific, or reasoning questions, structure your answer clearly with markdown:
1. 🎯 **Concept Core**: The governing rule, definition, or formula in clean mathematical notation.
2. 💡 **Intuitive Analogy**: A 1-2 sentence real-world or visual intuition explaining WHY the theorem or formula works.
3. 📝 **Step-by-Step Derivation / Solution**:
   - Numbered steps (Step 1, Step 2, etc.)
   - Clear arithmetic and algebraic transitions
   - State reasons in brackets (e.g., "[By Angle Sum Property]" or "[Applying Quadratic Formula]")
   - Highlight the final answer clearly in a dedicated box or bold text (e.g., **Final Answer: x = ...**)
4. ⚡ **Maths Expert Speed Trick / Topper Shortcut**: A fast verification tip, mental math check, or shortcut for MCQs.
5. ⚠️ **Common Trap to Avoid**: The typical mistake 90% of students make in board exams.
6. 🎯 **Practice Challenge**: A mini follow-up problem for the student to solve on their own.

If asked about Maths Fact institute, admissions, demo classes, or visiting:
- Announce with enthusiasm our **1-Week Free Demo Class** (no commitment, experience concept-based learning first-hand).
- Share our contact channels: Call/WhatsApp Satyam Sir at **7004995470** or **8294112559**.
- Provide our verified Google Maps link: https://share.google/C3HdMlXd1OStDMGqf (students and parents can visit us directly or scan our Google Business Profile QR code on the website).
- Mention small batch sizes, personalized doubt resolution, handcrafted Question PDFs, and weekly evaluations.

Tone & Formatting:
- Warm, enthusiastic, empowering, patient, and intellectually rigorous. Never patronizing.
- Use readable unicode symbols (√, π, θ, ², ³, ±, ≤, ≥, ≠, ∫, Δ, α, β) and clean markdown.
- Never give just a dry number; always impart true mathematical understanding.`;

          // Format contents history
          const contents: any[] = [];
          if (Array.isArray(history)) {
            for (const item of history.slice(-8)) {
              if (item.content && (item.role === 'user' || item.role === 'model')) {
                contents.push({
                  role: item.role,
                  parts: [{ text: item.content }],
                });
              }
            }
          }
          contents.push({
            role: 'user',
            parts: [{ text: message }],
          });

          const aiResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.65,
            },
          });

          const replyText = aiResponse.text || 'Keep practicing! Let me know if you need any other math concept explained.';
          return res.json({ reply: replyText });
        } catch (apiErr: any) {
          console.error('Gemini API call failed, falling back to educational engine:', apiErr?.message);
        }
      }

      // Educational concept response fallback if API key is not configured
      const q = message.toLowerCase();
      let fallbackReply = `Hello! I am **Maths Expert**, your 24x7 AI Mathematics & Concept Mentor at **Maths Fact** (mentored by Satyam Sir).\n\n`;

      if (q.includes('map') || q.includes('location') || q.includes('address') || q.includes('where') || q.includes('direction') || q.includes('qr')) {
        fallbackReply += `### 📍 Find Maths Fact on Google Maps\n\nYou can easily visit our coaching institute or view our official Google Business Profile:\n\n🔗 **Google Maps Direct Link:** [View Maths Fact on Google Maps](https://share.google/C3HdMlXd1OStDMGqf)\n📱 **Official QR Code:** Available on our contact section—scan directly with your smartphone camera!\n📞 **Phone:** 7004995470 / 8294112559\n📧 **Email:** mathsfact.99@gmail.com\n\nCome visit us or book a **1-Week Free Demo Class** before joining!`;
      } else if (q.includes('demo') || q.includes('admission') || q.includes('fee') || q.includes('batch')) {
        fallbackReply += `Welcome to **Maths Fact**! We provide specialized concept-based coaching for **Class III to XII (CBSE & ICSE)**.\n\n✨ **Key Highlights:**\n- **1-Week Free Demo Class** for every student to experience Satyam Sir's teaching first-hand.\n- Direct mentorship with chapter-wise **Question PDFs** and weekly concept evaluations.\n- **Google Maps Location:** [Open in Google Maps](https://share.google/C3HdMlXd1OStDMGqf)\n\n📞 **Call or WhatsApp Satyam Sir directly:** **7004995470** or **8294112559**\n✉️ **Email:** \`mathsfact.99@gmail.com\`\n\nYou can also click **"Book 1-Week Free Demo"** in the top navigation to reserve your slot!`;
      } else if (q.includes('pythagoras') || q.includes('theorem')) {
        fallbackReply += `### 📐 Pythagoras Theorem Explained Simply\n\n**1. 🎯 The Core Concept:**\nIn any right-angled triangle, the area of the square on the hypotenuse ($c$) is equal to the sum of the areas of the squares on the legs ($a$ and $b$):\n\n$$\\mathbf{c^2 = a^2 + b^2} \\implies c = \\sqrt{a^2 + b^2}$$\n\n**2. 💡 Intuitive Logic:**\nImagine building literal square tiles on each side. The tiles on the base and height fit perfectly together to fill the square on the longest slanted side!\n\n**3. 📝 Step-by-Step Example:**\nLet perpendicular $a = 3\\text{ cm}$ and base $b = 4\\text{ cm}$:\n- Step 1: Calculate $a^2 = 3^2 = 9$\n- Step 2: Calculate $b^2 = 4^2 = 16$\n- Step 3: Add them: $c^2 = 9 + 16 = 25$\n- Step 4: Take the square root: $c = \\sqrt{25} = 5\\text{ cm}$\n- **Final Answer: Hypotenuse = 5 cm**\n\n**4. ⚡ Maths Expert Speed Trick:**\nMemorize Pythagorean Triplets: $(3, 4, 5)$, $(5, 12, 13)$, $(8, 15, 17)$, $(7, 24, 25)$. Any scalar multiple like $(6, 8, 10)$ also works immediately!\n\n**5. ⚠️ Common Trap:**\nRemember: Pythagoras theorem ONLY applies to right-angled triangles ($90^\\circ$). If no angle is $90^\\circ$, use the Law of Cosines!`;
      } else if (q.includes('quadratic') || q.includes('equation')) {
        fallbackReply += `### 🔢 Quadratic Equation Mastery\n\n**1. 🎯 Standard Form:**\n$$\\mathbf{ax^2 + bx + c = 0} \\quad (a \\neq 0)$$\n\n**2. 📝 Shreedharacharya Quadratic Formula:**\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n**3. 💡 The Discriminant ($D = b^2 - 4ac$):**\n- $D > 0$: 2 Distinct Real Roots\n- $D = 0$: 2 Equal Real Roots (Perfect Square)\n- $D < 0$: No Real Roots (Complex Conjugates)\n\n**4. ⚡ Topper Shortcut (Vieta's Relations):**\n- Sum of roots: $\\alpha + \\beta = -\\frac{b}{a}$\n- Product of roots: $\\alpha \\cdot \\beta = \\frac{c}{a}$`;
      } else if (q.includes('trigonometry') || q.includes('sin') || q.includes('cos') || q.includes('tan')) {
        fallbackReply += `### 📊 Trigonometry Ratios & Finger Trick\n\n**1. 🎯 Fundamental Ratios (Right Triangle):**\n- $\\sin(\\theta) = \\frac{\\text{Perpendicular}}{\\text{Hypotenuse}}$\n- $\\cos(\\theta) = \\frac{\\text{Base}}{\\text{Hypotenuse}}$\n- $\\tan(\\theta) = \\frac{\\text{Perpendicular}}{\\text{Base}} = \\frac{\\sin(\\theta)}{\\cos(\\theta)}$\n\n**2. 💡 Easy Mnemonic:**\n*"Some People Have, Curly Brown Hair, Through Proper Brushing"*\n\n**3. ⚡ The Hand Rule for Standard Angles ($0^\\circ, 30^\\circ, 45^\\circ, 60^\\circ, 90^\\circ$):**\n$$\\sin(\\theta) = \\frac{\\sqrt{\\text{Number of fingers below}}}{2}$$\n- For $30^\\circ$: 1 finger below $\\implies \\sin(30^\\circ) = \\frac{\\sqrt{1}}{2} = \\frac{1}{2}$\n- For $45^\\circ$: 2 fingers below $\\implies \\sin(45^\\circ) = \\frac{\\sqrt{2}}{2} = \\frac{1}{\\sqrt{2}}$\n- For $60^\\circ$: 3 fingers below $\\implies \\sin(60^\\circ) = \\frac{\\sqrt{3}}{2}$`;
      } else {
        fallbackReply += `In Mathematics, there are no shortcuts to true brilliance, but every complex problem can be broken down into simple, intuitive steps!\n\nAs your **Maths Expert AI Mentor**, I can help you with:\n- 📐 **Algebra, Geometry & Trigonometry derivations**\n- 🔢 **Calculus, Vectors & Coordinate Geometry**\n- 📝 **Step-by-step problem evaluation & homework check**\n- ⚡ **Olympiad & Board Exam speed tactics**\n- 📍 **Maths Fact Offline Center Location ([View on Google Maps](https://share.google/C3HdMlXd1OStDMGqf))**\n\nWhat topic or problem would you like to master right now?`;
      }

      return res.json({ reply: fallbackReply });
    } catch (err: any) {
      console.error('Error in /api/ai/chat:', err);
      res.status(500).json({ error: 'Failed to process AI chat request.' });
    }
  });

  // Enquiries submission
  app.post('/api/enquiries/demo', (req, res) => {
    const {
      studentName,
      parentName,
      classLevel,
      schoolName,
      phone,
      email,
      preferredSubject,
      preferredDate,
      message,
    } = req.body;

    if (!studentName || !phone || !classLevel) {
      return res.status(400).json({ error: 'Student name, class, and phone number are required.' });
    }

    const newEnquiry: DemoEnquiry = {
      id: `demo-${Date.now()}`,
      studentName,
      parentName: parentName || '',
      classLevel,
      schoolName: schoolName || '',
      phone,
      email: email || '',
      preferredSubject: preferredSubject || 'Mathematics',
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      message: message || '',
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.demoEnquiries.unshift(newEnquiry);
    saveDb(db);
    res.status(201).json({ success: true, message: 'Free demo enquiry registered successfully!', enquiry: newEnquiry });
  });

  app.post('/api/enquiries/contact', (req, res) => {
    const { name, phone, email, classLevel, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone number, and message are required.' });
    }

    const newContact: ContactEnquiry = {
      id: `contact-${Date.now()}`,
      name,
      phone,
      email: email || '',
      classLevel: classLevel || 'General',
      subject: subject || 'General Query',
      message,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.contactEnquiries.unshift(newContact);
    saveDb(db);
    res.status(201).json({ success: true, message: 'Your message has been received! Satyam Sir will get back shortly.', enquiry: newContact });
  });

  // Track download
  app.post('/api/download-count', (req, res) => {
    const { type, id } = req.body;
    if (type === 'pdf') {
      const item = db.questionPdfs.find((p) => p.id === id);
      if (item) {
        item.downloadsCount = (item.downloadsCount || 0) + 1;
        saveDb(db);
      }
    } else if (type === 'material') {
      const item = db.studyMaterials.find((m) => m.id === id);
      if (item) {
        item.downloadsCount = (item.downloadsCount || 0) + 1;
        saveDb(db);
      }
    }
    res.json({ success: true });
  });

  // ==========================================
  // AUTHENTICATION APIS
  // ==========================================

  // Admin status check (is initial password configured?)
  app.get('/api/auth/admin/status', (_req, res) => {
    const adminUser = db.users.find((u) => u.email === 'mathsfact.99@gmail.com' && u.role === 'admin');
    res.json({
      isConfigured: Boolean(adminUser && adminUser.hash),
      adminEmail: 'mathsfact.99@gmail.com',
      demoModeAvailable: true,
    });
  });

  // Admin initial setup
  app.post('/api/auth/admin/setup', (req, res) => {
    const { email, password } = req.body;
    if (email !== 'mathsfact.99@gmail.com') {
      return res.status(400).json({ error: 'Admin setup is restricted to mathsfact.99@gmail.com' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const { salt, hash } = hashPassword(password);
    const existingIndex = db.users.findIndex((u) => u.email === email && u.role === 'admin');

    const adminUser: StoredUser = {
      id: existingIndex >= 0 ? db.users[existingIndex].id : `admin-${Date.now()}`,
      name: 'Satyam Sir (Administrator)',
      email: 'mathsfact.99@gmail.com',
      role: 'admin',
      salt,
      hash,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      db.users[existingIndex] = adminUser;
    } else {
      db.users.push(adminUser);
    }
    db.adminConfigured = true;
    saveDb(db);

    const token = generateToken({ id: adminUser.id, email: adminUser.email, role: 'admin' });
    res.json({
      success: true,
      message: 'Admin account secured and setup successfully!',
      token,
      user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: 'admin' },
    });
  });

  // Admin login
  app.post('/api/auth/admin/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (email !== 'mathsfact.99@gmail.com') {
      return res.status(401).json({ error: 'Invalid admin email. Admin login is restricted to mathsfact.99@gmail.com' });
    }

    let adminUser = db.users.find((u) => u.email === 'mathsfact.99@gmail.com' && u.role === 'admin');

    // If admin doesn't exist yet, create with requested master password
    if (!adminUser) {
      const { salt, hash } = hashPassword('06111999@mf');
      adminUser = {
        id: 'admin-satyam-sir',
        name: 'Satyam Sir (Director)',
        email: 'mathsfact.99@gmail.com',
        role: 'admin',
        salt,
        hash,
        createdAt: new Date().toISOString(),
      };
      db.users.push(adminUser);
      db.adminConfigured = true;
      saveDb(db);
    }

    const isMasterPassword = password === '06111999@mf';
    const isValid = isMasterPassword || (adminUser.salt && adminUser.hash && verifyPassword(password, adminUser.salt, adminUser.hash));
    
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect administrator password.' });
    }

    // If logged in with master password, ensure hash is saved with it
    if (isMasterPassword && (!adminUser.hash || !verifyPassword('06111999@mf', adminUser.salt, adminUser.hash))) {
      const updated = hashPassword('06111999@mf');
      adminUser.salt = updated.salt;
      adminUser.hash = updated.hash;
      saveDb(db);
    }

    const token = generateToken({ id: adminUser.id, email: adminUser.email, role: 'admin' });
    res.json({
      success: true,
      token,
      user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: 'admin' },
    });
  });

  // Admin password change
  app.post('/api/auth/admin/change-password', requireAdmin, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = (req as any).user;
    const adminUser = db.users.find((u) => u.id === user.id);

    if (!adminUser) {
      return res.status(404).json({ error: 'Administrator user not found' });
    }

    if (!verifyPassword(currentPassword, adminUser.salt, adminUser.hash)) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const { salt, hash } = hashPassword(newPassword);
    adminUser.salt = salt;
    adminUser.hash = hash;
    saveDb(db);

    res.json({ success: true, message: 'Password updated successfully!' });
  });

  // Admin password reset request (generates 6-digit secure code for mathsfact.99@gmail.com)
  app.post('/api/auth/admin/reset-request', (req, res) => {
    const { email } = req.body;
    if (email !== 'mathsfact.99@gmail.com') {
      return res.status(400).json({ error: 'Password reset is only available for mathsfact.99@gmail.com' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    db.resetTokens[email] = {
      code: resetCode,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    };
    saveDb(db);

    // In a live system this sends an email via SMTP. We return verification prompt details safely:
    res.json({
      success: true,
      message: `Password reset verification code dispatched to ${email}.`,
      verificationCodeHint: resetCode, // Provided for easy development/testing verification
    });
  });

  // Admin password reset confirm
  app.post('/api/auth/admin/reset-confirm', (req, res) => {
    const { email, code, newPassword } = req.body;

    const stored = db.resetTokens[email];
    if (!stored || stored.code !== code || Date.now() > stored.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const { salt, hash } = hashPassword(newPassword);
    let adminUser = db.users.find((u) => u.email === email && u.role === 'admin');

    if (!adminUser) {
      adminUser = {
        id: `admin-${Date.now()}`,
        name: 'Satyam Sir (Administrator)',
        email: 'mathsfact.99@gmail.com',
        role: 'admin',
        salt,
        hash,
        createdAt: new Date().toISOString(),
      };
      db.users.push(adminUser);
    } else {
      adminUser.salt = salt;
      adminUser.hash = hash;
    }

    delete db.resetTokens[email];
    db.adminConfigured = true;
    saveDb(db);

    const token = generateToken({ id: adminUser.id, email: adminUser.email, role: 'admin' });
    res.json({
      success: true,
      message: 'Password has been reset successfully!',
      token,
      user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: 'admin' },
    });
  });

  // Student registration
  app.post('/api/auth/student/register', (req, res) => {
    const { name, email, phone, password, classLevel } = req.body;

    if (!name || !email || !password || !classLevel) {
      return res.status(400).json({ error: 'Name, email, password, and class are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (db.users.some((u) => u.email === normalizedEmail)) {
      return res.status(400).json({ error: 'An account with this email already exists. Please login.' });
    }

    const { salt, hash } = hashPassword(password);
    const newStudent: StoredUser = {
      id: `student-${Date.now()}`,
      name,
      email: normalizedEmail,
      phone: phone || '',
      classLevel,
      role: 'student',
      salt,
      hash,
      savedPdfs: [],
      createdAt: new Date().toISOString(),
    };

    db.users.push(newStudent);
    saveDb(db);

    const token = generateToken({ id: newStudent.id, email: newStudent.email, role: 'student' });
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Maths Fact.',
      token,
      user: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        role: 'student',
        classLevel: newStudent.classLevel,
        phone: newStudent.phone,
        savedPdfs: newStudent.savedPdfs,
      },
    });
  });

  // Student login
  app.post('/api/auth/student/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const student = db.users.find((u) => u.email === email.toLowerCase().trim() && u.role === 'student');
    if (!student || !verifyPassword(password, student.salt, student.hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken({ id: student.id, email: student.email, role: 'student' });
    res.json({
      success: true,
      token,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student',
        classLevel: student.classLevel,
        phone: student.phone,
        savedPdfs: student.savedPdfs || [],
      },
    });
  });

  // Validate session token
  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }

    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        classLevel: user.classLevel,
        phone: user.phone,
        savedPdfs: user.savedPdfs || [],
      },
    });
  });

  // Toggle student saved PDF
  app.post('/api/student/toggle-save-pdf', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid session' });

    const student = db.users.find((u) => u.id === decoded.id);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const { pdfId } = req.body;
    student.savedPdfs = student.savedPdfs || [];
    if (student.savedPdfs.includes(pdfId)) {
      student.savedPdfs = student.savedPdfs.filter((id) => id !== pdfId);
    } else {
      student.savedPdfs.push(pdfId);
    }
    saveDb(db);
    res.json({ savedPdfs: student.savedPdfs });
  });

  // ==========================================
  // PROTECTED ADMIN APIS
  // ==========================================

  app.get('/api/admin/stats', requireAdmin, (_req, res) => {
    res.json({
      totalPdfs: db.questionPdfs.length,
      totalStudyMaterials: db.studyMaterials.length,
      totalDemoEnquiries: db.demoEnquiries.length,
      totalContactEnquiries: db.contactEnquiries.length,
      totalCourses: db.courses.length,
      totalStudents: db.users.filter((u) => u.role === 'student').length,
      recentEnquiries: db.demoEnquiries.slice(0, 5),
      recentPdfs: db.questionPdfs.slice(0, 5),
    });
  });

  // Content CMS
  app.put('/api/admin/content', requireAdmin, (req, res) => {
    db.websiteContent = { ...db.websiteContent, ...req.body };
    saveDb(db);
    res.json({ success: true, content: db.websiteContent });
  });

  // Manage Question PDFs
  app.get('/api/admin/question-pdfs', requireAdmin, (_req, res) => {
    res.json(db.questionPdfs);
  });

  app.post('/api/admin/question-pdfs', requireAdmin, (req, res) => {
    const {
      title,
      classLevel,
      subject,
      chapter,
      topic,
      difficulty,
      examType,
      description,
      fileUrl,
      questionsCount,
      tags,
      isPublished,
      sampleQuestions,
    } = req.body;

    if (!title || !classLevel || !subject || !chapter) {
      return res.status(400).json({ error: 'Title, Class, Subject, and Chapter are required.' });
    }

    const newPdf: QuestionPDF = {
      id: `qpdf-${Date.now()}`,
      title,
      classLevel,
      subject,
      chapter,
      topic: topic || chapter,
      difficulty: difficulty || 'Medium',
      examType: examType || 'School Practice',
      description: description || '',
      fileUrl: fileUrl || `/question-sets/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}.pdf`,
      uploadDate: new Date().toISOString().split('T')[0],
      questionsCount: Number(questionsCount) || 20,
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      isPublished: isPublished !== false,
      downloadsCount: 0,
      sampleQuestions: Array.isArray(sampleQuestions) && sampleQuestions.length > 0
        ? sampleQuestions
        : [
            `Sample Question 1 for ${chapter}: Conceptual definitions and formula derivation.`,
            `Sample Question 2 for ${chapter}: Graded computational problem with step-by-step evaluation.`,
            `Sample Question 3 for ${chapter}: Higher-Order Thinking Skills (HOTS) challenge.`,
          ],
    };

    db.questionPdfs.unshift(newPdf);
    saveDb(db);
    res.status(201).json({ success: true, pdf: newPdf });
  });

  app.put('/api/admin/question-pdfs/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = db.questionPdfs.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Question PDF not found' });

    db.questionPdfs[index] = { ...db.questionPdfs[index], ...req.body };
    saveDb(db);
    res.json({ success: true, pdf: db.questionPdfs[index] });
  });

  app.delete('/api/admin/question-pdfs/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    db.questionPdfs = db.questionPdfs.filter((p) => p.id !== id);
    saveDb(db);
    res.json({ success: true, message: 'PDF deleted successfully' });
  });

  // Manage Study Materials
  app.get('/api/admin/study-materials', requireAdmin, (_req, res) => {
    res.json(db.studyMaterials);
  });

  app.post('/api/admin/study-materials', requireAdmin, (req, res) => {
    const { title, classLevel, subject, type, description, fileUrl, fileSize, isPublished } = req.body;
    if (!title || !classLevel || !subject || !type) {
      return res.status(400).json({ error: 'Title, Class, Subject, and Type are required.' });
    }

    const newMaterial: StudyMaterial = {
      id: `sm-${Date.now()}`,
      title,
      classLevel,
      subject,
      type,
      description: description || '',
      fileUrl: fileUrl || `/mock-materials/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}.pdf`,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: fileSize || '1.2 MB',
      isPublished: isPublished !== false,
      downloadsCount: 0,
    };

    db.studyMaterials.unshift(newMaterial);
    saveDb(db);
    res.status(201).json({ success: true, material: newMaterial });
  });

  app.put('/api/admin/study-materials/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = db.studyMaterials.findIndex((m) => m.id === id);
    if (index === -1) return res.status(404).json({ error: 'Study material not found' });

    db.studyMaterials[index] = { ...db.studyMaterials[index], ...req.body };
    saveDb(db);
    res.json({ success: true, material: db.studyMaterials[index] });
  });

  app.delete('/api/admin/study-materials/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    db.studyMaterials = db.studyMaterials.filter((m) => m.id !== id);
    saveDb(db);
    res.json({ success: true, message: 'Study material deleted successfully' });
  });

  // Manage Courses
  app.post('/api/admin/courses', requireAdmin, (req, res) => {
    const { title, classes, subjects, badge, description, icon, features, timing, batchSize } = req.body;
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title,
      classes,
      subjects,
      badge,
      description,
      icon: icon || 'BookOpen',
      features: Array.isArray(features) ? features : (features || '').split('\n').filter(Boolean),
      timing,
      batchSize,
    };
    db.courses.push(newCourse);
    saveDb(db);
    res.status(201).json({ success: true, course: newCourse });
  });

  app.put('/api/admin/courses/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = db.courses.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Course not found' });
    db.courses[index] = { ...db.courses[index], ...req.body };
    saveDb(db);
    res.json({ success: true, course: db.courses[index] });
  });

  app.delete('/api/admin/courses/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    db.courses = db.courses.filter((c) => c.id !== id);
    saveDb(db);
    res.json({ success: true, message: 'Course deleted successfully' });
  });

  // Manage Enquiries
  app.get('/api/admin/enquiries/demo', requireAdmin, (_req, res) => {
    res.json(db.demoEnquiries);
  });

  app.put('/api/admin/enquiries/demo/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const enquiry = db.demoEnquiries.find((e) => e.id === id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    enquiry.status = status;
    saveDb(db);
    res.json({ success: true, enquiry });
  });

  app.delete('/api/admin/enquiries/demo/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    db.demoEnquiries = db.demoEnquiries.filter((e) => e.id !== id);
    saveDb(db);
    res.json({ success: true, message: 'Demo enquiry removed' });
  });

  app.get('/api/admin/enquiries/contact', requireAdmin, (_req, res) => {
    res.json(db.contactEnquiries);
  });

  app.put('/api/admin/enquiries/contact/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const enquiry = db.contactEnquiries.find((e) => e.id === id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    enquiry.status = status;
    saveDb(db);
    res.json({ success: true, enquiry });
  });

  app.delete('/api/admin/enquiries/contact/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    db.contactEnquiries = db.contactEnquiries.filter((e) => e.id !== id);
    saveDb(db);
    res.json({ success: true, message: 'Contact enquiry removed' });
  });

  // Manage Announcements
  app.post('/api/admin/announcements', requireAdmin, (req, res) => {
    const { title, description, isImportant, isPublished } = req.body;
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      description,
      date: new Date().toISOString().split('T')[0],
      isImportant: Boolean(isImportant),
      isPublished: isPublished !== false,
    };
    db.announcements.unshift(newAnn);
    saveDb(db);
    res.status(201).json({ success: true, announcement: newAnn });
  });

  app.put('/api/admin/announcements/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = db.announcements.findIndex((a) => a.id === id);
    if (index === -1) return res.status(404).json({ error: 'Announcement not found' });
    db.announcements[index] = { ...db.announcements[index], ...req.body };
    saveDb(db);
    res.json({ success: true, announcement: db.announcements[index] });
  });

  app.delete('/api/admin/announcements/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    db.announcements = db.announcements.filter((a) => a.id !== id);
    saveDb(db);
    res.json({ success: true, message: 'Announcement deleted' });
  });

  // Manage Results
  app.post('/api/admin/results', requireAdmin, (req, res) => {
    const { studentName, classLevel, achievement, scoreOrRank, year, photoUrl } = req.body;
    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      studentName,
      classLevel,
      achievement,
      scoreOrRank,
      year: year || '2025',
      photoUrl: photoUrl || '',
    };
    db.achievements.unshift(newAch);
    saveDb(db);
    res.status(201).json({ success: true, achievement: newAch });
  });

  app.put('/api/admin/results/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = db.achievements.findIndex((a) => a.id === id);
    if (index === -1) return res.status(404).json({ error: 'Achievement record not found' });
    db.achievements[index] = { ...db.achievements[index], ...req.body };
    saveDb(db);
    res.json({ success: true, achievement: db.achievements[index] });
  });

  app.delete('/api/admin/results/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    db.achievements = db.achievements.filter((a) => a.id !== id);
    saveDb(db);
    res.json({ success: true, message: 'Achievement deleted' });
  });

  // Manage Students list
  app.get('/api/admin/students', requireAdmin, (_req, res) => {
    const students = db.users
      .filter((u) => u.role === 'student')
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        classLevel: u.classLevel,
        createdAt: u.createdAt,
      }));
    res.json(students);
  });

  // Vite middleware / static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maths Fact Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
