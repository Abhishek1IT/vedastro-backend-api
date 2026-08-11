import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, "../uploads");

console.log("Uploads Path:", uploadsPath);

// CORS

// CORS

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",

  "https://ved-astro-1uq2-lgf7tlssp-abhishek1its-projects.vercel.app",

  "https://vedastro-backend-api.vercel.app",
  "https://vedastro-backend-api-3hvy.vercel.app",

  "https://vedastro-backend-api-3hvy-bjix1dn53-abhishek1its-projects.vercel.app",

  "https://vedastro-backend-api-3hvy-3qwj7xlnk-abhishek1its-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.log("Blocked CORS:", origin);

      return callback(new Error(`CORS blocked: ${origin}`));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  }),
);

// SECURITY

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// BODY

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// COOKIE

app.use(
  cookieParser()
);

// STATIC

app.use(
  "/uploads",
  express.static(
    uploadsPath
  )
);

// COMMON

app.use(
  compression()
);

app.use(
  morgan("dev")
);

// HEALTH

app.get(
  "/",
  (req, res) => {

    res.status(200).json({
      success: true,
      message: "VedAstro Backend Running 🚀"
    });
  }
);

// ROUTES

app.use(
  "/api",
  routes
);

// 404

app.use(
  (req, res) => {

    res.status(404).json({
      success: false,
      message: "Route Not Found"
    });
  }
);

// ERROR

app.use(
  errorMiddleware
);

export default app;