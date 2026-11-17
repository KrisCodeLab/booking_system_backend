import express from "express";
import { router as employeeRouter } from "./routes/employee.routes.js"
import { router as serviceRouter } from "./routes/service.routes.js"
import { router as appointmentRouter } from "./routes/appointment.routes.js"

const app = express();

app.use(express.json());

app.use('/api/v1', employeeRouter)
app.use('/api/v1', serviceRouter)
app.use('/api/v1', appointmentRouter)

export default app;