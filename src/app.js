import express from "express";
import cors from "cors";
import energyMixRoutes from "./routes/energyMix.routes.js";
import chargingWindowRoutes from "./routes/chargingWindow.routes.js";


const app = express();
app.use(express.json());

app.use("/energy-mix", energyMixRoutes);
app.use("/charging-window", chargingWindowRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const allowedOrigin = process.env.FRONTEND_URL;

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
