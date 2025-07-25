import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import { clerkMiddleware } from "@clerk/express";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";
import cron from "node-cron";
import fs from "fs";

// Routes
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';
import albumRoutes from './routes/album.route.js'; 
import songRoutes from './routes/song.route.js';
import statsRoutes from './routes/stats.route.js';

// DB connection
import { connectDB } from "./lib/db.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Error: ${envVar} is not defined in environment variables`);
    process.exit(1);
  }
}

const __dirname = path.resolve();
const app = express();

const httpServer = createServer(app);
initializeSocket(httpServer);


// ✅ Apply CORS before anything else
app.use(cors({
  origin: ["http://localhost:5173"], // Your frontend origin
  credentials: true,
}));

// ✅ Clerk middleware (after CORS)
app.use(clerkMiddleware());

// ✅ JSON body parser
app.use(express.json());

// ✅ File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, "temp"),
  createParentPath: true,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
}));

// delete the temp folders file in every one hour by node-cron
const tempDir = path.join(process.cwd(),"temp")
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});




// ✅ Routes
app.use('/api/auth', authRoutes);     // Public
app.use('/api/users', userRoutes);    // Protected
app.use('/api/admin', adminRoutes);   // Admin Protected
app.use('/api/songs', songRoutes);
app.use('/api/album', albumRoutes);
app.use('/api/stats', statsRoutes);



if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "frontend", "dist", "index.html"));
  });
}


// ✅ Error handler middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message,
  });
});

// ✅ Start server
const port = process.env.PORT;
connectDB()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`🚀 Server is running at: http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB or start server:", error);
    process.exit(1);
  });
 
// 💡 Socket.io can be added here later...
