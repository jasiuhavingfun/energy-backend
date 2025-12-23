# Energy Backend

A Node.js backend service that provides energy mix data and optimal charging window recommendations based on clean energy availability using the UK Carbon Intensity API.

## Features

- **Energy Mix Forecast** - Get a 3-day forecast of the UK energy generation mix
- **Optimal Charging Window** - Find the best time window (1-6 hours) to charge based on clean energy percentage
- Clean energy tracking (solar, wind, hydro, nuclear, biomass)

## Tech Stack

- Express.js 5
- Node.js (ES Modules)
- Jest for testing
- Axios for HTTP requests

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file or set the following environment variables:

| Variable       | Description                          |
| -------------- | ------------------------------------ |
| `PORT`         | Server port                          |
| `FRONTEND_URL` | Allowed CORS origin for frontend app |

### Running the Server

```bash
npm start
```

### Running Tests

```bash
npm test
```

## API Endpoints

### GET `/energy-mix`

Returns a 3-day energy generation mix forecast.

**Response:**

```json
{
  "days": [
    {
      "date": "2025-12-23",
      "averageMix": {
        "gas": 35.2,
        "wind": 28.5,
        "nuclear": 15.0,
        ...
      },
      "cleanEnergyPercent": 62.5
    }
  ]
}
```

### GET `/charging-window`

Finds the optimal charging window within the next 48 hours based on clean energy availability.

**Query Parameters:**

| Parameter | Type    | Required | Description                              |
| --------- | ------- | -------- | ---------------------------------------- |
| `hours`   | integer | Yes      | Charging duration (1-6 hours)            |

**Response:**

```json
{
  "start": "2025-12-23T14:00Z",
  "end": "2025-12-23T16:00Z",
  "averageCleanEnergyPercent": 72.5
}
```

## Project Structure

```
src/
├── app.js                         # Express app entry point
├── routes/
│   ├── chargingWindow.routes.js   # Charging window endpoint
│   └── energyMix.routes.js        # Energy mix endpoint
├── services/
│   └── carbonIntensity.service.js # UK Carbon Intensity API client
└── utils/
    ├── date.utils.js              # Date helper functions
    └── energy.utils.js            # Energy calculation utilities
```
