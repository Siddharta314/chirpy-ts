import express from "express";
import {
  middlewareLogResponses,
  middlewareIncrementFileserverHits,
  middlewareErrorHandler,
} from "./middleware.js";
import { chirpyRouter } from "./api/chirpy.js";
import { healthRouter } from "./api/health.js";
import { adminRouter } from "./api/admin.js";
import { userRouter } from "./api/users.js";
import { authRouter } from "./api/auth.js";
import { webhookRouter } from "./api/webhook.js";

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(
  "/app",
  middlewareLogResponses,
  middlewareIncrementFileserverHits,
  express.static("./src/app"),
);

app.use("/admin", adminRouter);
app.use("/api", healthRouter);
app.use("/api/chirps", chirpyRouter);
app.use("/api/users", userRouter);
app.use("/api", authRouter);
app.use("/api", webhookRouter);

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
