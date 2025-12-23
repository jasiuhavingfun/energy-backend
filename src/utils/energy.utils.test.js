import {
  CLEAN_FUELS,
  calculateCleanEnergy,
  averageDailyMix,
} from "./energy.utils.js";

describe("energy.utils", () => {
  describe("CLEAN_FUELS", () => {
    it("should contain expected clean fuel types", () => {
      expect(CLEAN_FUELS).toContain("biomass");
      expect(CLEAN_FUELS).toContain("nuclear");
      expect(CLEAN_FUELS).toContain("hydro");
      expect(CLEAN_FUELS).toContain("wind");
      expect(CLEAN_FUELS).toContain("solar");
    });

    it("should have exactly 5 clean fuel types", () => {
      expect(CLEAN_FUELS).toHaveLength(5);
    });
  });

  describe("calculateCleanEnergy", () => {
    it("should sum percentages of clean fuels", () => {
      const mix = [
        { fuel: "wind", perc: 20 },
        { fuel: "solar", perc: 10 },
        { fuel: "gas", perc: 40 },
        { fuel: "nuclear", perc: 15 },
      ];
      expect(calculateCleanEnergy(mix)).toBe(45);
    });

    it("should return 0 when no clean fuels present", () => {
      const mix = [
        { fuel: "gas", perc: 60 },
        { fuel: "coal", perc: 40 },
      ];
      expect(calculateCleanEnergy(mix)).toBe(0);
    });

    it("should handle empty array", () => {
      expect(calculateCleanEnergy([])).toBe(0);
    });

    it("should handle all clean fuels", () => {
      const mix = [
        { fuel: "biomass", perc: 5 },
        { fuel: "nuclear", perc: 20 },
        { fuel: "hydro", perc: 10 },
        { fuel: "wind", perc: 35 },
        { fuel: "solar", perc: 30 },
      ];
      expect(calculateCleanEnergy(mix)).toBe(100);
    });
  });

  describe("averageDailyMix", () => {
    it("should calculate average percentages across intervals", () => {
      const intervals = [
        {
          generationmix: [
            { fuel: "wind", perc: 20 },
            { fuel: "gas", perc: 80 },
          ],
        },
        {
          generationmix: [
            { fuel: "wind", perc: 30 },
            { fuel: "gas", perc: 70 },
          ],
        },
      ];
      const result = averageDailyMix(intervals);
      expect(result.wind).toBe(25);
      expect(result.gas).toBe(75);
    });

    it("should handle single interval", () => {
      const intervals = [{ generationmix: [{ fuel: "solar", perc: 15 }] }];
      const result = averageDailyMix(intervals);
      expect(result.solar).toBe(15);
    });

    it("should round to 2 decimal places", () => {
      const intervals = [
        { generationmix: [{ fuel: "wind", perc: 10 }] },
        { generationmix: [{ fuel: "wind", perc: 11 }] },
        { generationmix: [{ fuel: "wind", perc: 12 }] },
      ];
      const result = averageDailyMix(intervals);
      expect(result.wind).toBe(11);
    });

    it("should handle fuels appearing in only some intervals", () => {
      const intervals = [
        { generationmix: [{ fuel: "wind", perc: 30 }] },
        {
          generationmix: [
            { fuel: "wind", perc: 20 },
            { fuel: "solar", perc: 10 },
          ],
        },
      ];
      const result = averageDailyMix(intervals);
      expect(result.wind).toBe(25);
      expect(result.solar).toBe(5);
    });
  });
});
