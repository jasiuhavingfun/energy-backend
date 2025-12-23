export const CLEAN_FUELS = [
  "biomass",
  "nuclear",
  "hydro",
  "wind",
  "solar",
];

export function calculateCleanEnergy(mix) {
  return mix
    .filter((m) => CLEAN_FUELS.includes(m.fuel))
    .reduce((sum, m) => sum + m.perc, 0);
}

export function averageDailyMix(intervals) {
  const totals = {};
  const count = intervals.length;

  intervals.forEach(({ generationmix }) => {
    generationmix.forEach(({ fuel, perc }) => {
      totals[fuel] = (totals[fuel] || 0) + perc;
    });
  });

  Object.keys(totals).forEach(
    (fuel) => (totals[fuel] = +(totals[fuel] / count).toFixed(2))
  );

  return totals;
}
