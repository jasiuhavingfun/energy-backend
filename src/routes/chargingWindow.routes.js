import express from "express";
import { fetchGeneration } from "../services/carbonIntensity.service.js";
import { calculateCleanEnergy } from "../utils/energy.utils.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const hours = Number(req.query.hours);

    if (!Number.isInteger(hours) || hours < 1 || hours > 6) {
      return res.status(400).json({
        error: "Parameter 'hours' must be an integer between 1 and 6",
      });
    }

    const now = new Date();
    const to = new Date(now);
    to.setUTCHours(to.getUTCHours() + 48);

    const data = await fetchGeneration(now.toISOString(), to.toISOString());

    const windowSize = hours * 2;
    let bestWindow = null;
    let bestAverage = -1;

    for (let i = 0; i <= data.length - windowSize; i++) {
      const window = data.slice(i, i + windowSize);

      const avgClean =
        window.reduce(
          (sum, interval) =>
            sum + calculateCleanEnergy(interval.generationmix),
          0
        ) / windowSize;

      if (avgClean > bestAverage) {
        bestAverage = avgClean;
        bestWindow = window;
      }
    }

    if (!bestWindow) {
      return res.status(422).json({ error: "Insufficient data" });
    }

    res.json({
      start: bestWindow[0].from,
      end: bestWindow[bestWindow.length - 1].to,
      averageCleanEnergyPercent: +bestAverage.toFixed(2),
    });
  } catch (err) {
    next(err);
  }
});

export default router;