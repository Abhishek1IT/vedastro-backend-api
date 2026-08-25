import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, "../uploads");

console.log("Uploads Path:", uploadsPath);

const allowedOrigins = [
  "http://localhost:3000",

  "https://vedastro-backend-api-3hvy.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS REQUEST:", origin);

    if (!origin) {
      return callback(null, true);
    }

    // Exact allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    console.log("CORS BLOCKED:", origin);

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

  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

app.use(compression());

app.use(morgan("dev"));

app.use("/uploads", express.static(uploadsPath));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VedAstro Backend Running",
  });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use(errorMiddleware);

export default app;