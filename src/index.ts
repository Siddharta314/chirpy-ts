import express from "express";
import { Request, Response } from "express";
import { middlewareLogResponses } from "./middleware.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}
