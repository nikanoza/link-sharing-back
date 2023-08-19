import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT || 3000);
