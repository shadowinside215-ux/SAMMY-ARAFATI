import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Dummy authentication
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "sami" && password === "2006") {
      res.json({ token: "admin-token", success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  });

  const projectsFilePath = path.join(__dirname, 'src', 'data', 'projects.json');
  
  // Get projects
  app.get("/api/projects", (req, res) => {
    try {
      const data = fs.readFileSync(projectsFilePath, 'utf8');
      res.json(JSON.parse(data));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to read projects" });
    }
  });

  // Save projects (requires token)
  app.post("/api/projects", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer admin-token") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const newData = req.body;
      fs.writeFileSync(projectsFilePath, JSON.stringify(newData, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save projects" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    // Important: Use *all for Express v5 to catch all routes (but express is v4 in this project)
    // Wait, let's check express version. It's ^4.21.2
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
