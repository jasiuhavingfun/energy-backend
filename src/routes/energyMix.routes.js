import express from "express";
import { fetchGeneration } from "../services/carbonIntensity.service.js";
import { averageDailyMix, calculateCleanEnergy } from "../utils/energy.utils.js";
import { startOfDayUTC, addDays, toISO } from "../utils/date.utils.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const today = startOfDayUTC(new Date());
    const from = toISO(today);
    const to = toISO(addDays(today, 3));

    const data = await fetchGeneration(from, to);

    const grouped = {};
    const todayStr = from.substring(0, 10);

    data.forEach((interval) => {
      const date = interval.from.substring(0, 10);
      // Only include data from today onwards
      if (date >= todayStr) {
        grouped[date] = grouped[date] || [];
        grouped[date].push(interval);
      }
    });

    const result = Object.entries(grouped)
      .slice(0, 3)
      .map(([date, intervals]) => {
        const avgMix = averageDailyMix(intervals);
        const cleanEnergyPercent = +(
          Object.entries(avgMix)
            .filter(([fuel]) =>
              ["biomass", "nuclear", "hydro", "wind", "solar"].includes(fuel)
            )
            .reduce((sum, [, val]) => sum + val, 0)
        ).toFixed(2);

        return {
          date,
          averageMix: avgMix,
          cleanEnergyPercent,
        };
      });

    res.json({ days: result });
  } catch (err) {
    next(err);
  }
});

export default router;