import express from "express";
import { router as employeeRouter } from "./routes/employee.routes.js"
import { router as serviceRouter } from "./routes/service.routes.js"
import { router as appointmentRouter } from "./routes/appointment.routes.js"
import { fileURLToPath } from "node:url"

const app = express()

const frontendPath = fileURLToPath(
    new URL("../../frontend/", import.meta.url)

)

app.use(express.json())

app.use('/api/v1', employeeRouter)
app.use('/api/v1', serviceRouter)
app.use('/api/v1', appointmentRouter)

app.use(express.static(frontendPath))

export default app