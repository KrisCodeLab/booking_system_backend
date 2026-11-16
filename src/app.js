import express from "express";
import { router as employeeRouter } from "./routes/employee.routes.js"

const app = express();

app.use(express.json());

app.use('/api/v1', employeeRouter)

export default app;