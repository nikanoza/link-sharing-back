import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import swaggerMiddleware from "./middlewares/swagger-middleware.js";
import authRouter from "./routes/auth-router.js";
import userRouter from "./routes/user-router.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/storage", express.static("public/storage"));
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/", ...swaggerMiddleware);

app.listen(process.env.PORT || 3000);
