import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import featuresRouter from '@routes/features-router';
import cropsRouter from '@routes/crops-router';

dotenv.config()
const app = express();

// CORS
app.use(
    cors({
        origin: ["*"],
        credentials: true,
    })
);
// Middlewares do Helmet
app.use(helmet());

app.use(express.json({limit: '200mb'}));
app.use(express.urlencoded({limit: '200mb', extended: true}));

const API_ROUTES = {
    v1: "/api/v1"
}

// Rotas
app.use(`${API_ROUTES.v1}/features`, featuresRouter);
app.use(`${API_ROUTES.v1}/crops`, cropsRouter);

app.use("/images", express.static("./public/images"));

// Servidor
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;