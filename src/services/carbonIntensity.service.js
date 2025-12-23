import axios from "axios";

const BASE_URL = "https://api.carbonintensity.org.uk";

export async function fetchGeneration(from, to) {
  const url = `${BASE_URL}/generation/${from}/${to}`;

  const response = await axios.get(url, { timeout: 10_000 });

  if (!response.data?.data) {
    throw new Error("Invalid API response");
  }

  return response.data.data;
}
