import { jest } from "@jest/globals";

const mockAxios = {
  get: jest.fn(),
};

jest.unstable_mockModule("axios", () => ({
  default: mockAxios,
}));

const { fetchGeneration } = await import("./carbonIntensity.service.js");

describe("carbonIntensity.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchGeneration", () => {
    it("should fetch generation data from API", async () => {
      const mockData = [{ from: "2024-01-15T00:00Z", generationmix: [] }];
      mockAxios.get.mockResolvedValue({ data: { data: mockData } });

      const result = await fetchGeneration(
        "2024-01-15T00:00Z",
        "2024-01-16T00:00Z"
      );

      expect(mockAxios.get).toHaveBeenCalledWith(
        "https://api.carbonintensity.org.uk/generation/2024-01-15T00:00Z/2024-01-16T00:00Z",
        { timeout: 10000 }
      );
      expect(result).toEqual(mockData);
    });

    it("should throw error on invalid API response", async () => {
      mockAxios.get.mockResolvedValue({ data: {} });

      await expect(
        fetchGeneration("2024-01-15T00:00Z", "2024-01-16T00:00Z")
      ).rejects.toThrow("Invalid API response");
    });

    it("should throw error when data is null", async () => {
      mockAxios.get.mockResolvedValue({ data: { data: null } });

      await expect(
        fetchGeneration("2024-01-15T00:00Z", "2024-01-16T00:00Z")
      ).rejects.toThrow("Invalid API response");
    });

    it("should propagate network errors", async () => {
      mockAxios.get.mockRejectedValue(new Error("Network Error"));

      await expect(
        fetchGeneration("2024-01-15T00:00Z", "2024-01-16T00:00Z")
      ).rejects.toThrow("Network Error");
    });
  });
});
