import bodyParser from "body-parser";
import express from "express";
import swaggerMiddleware from "./middlewares/swagger-middleware";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/", ...swaggerMiddleware);

app.listen(process.env.PORT || 3000);
