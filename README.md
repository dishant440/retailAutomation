# Retail Automation / PumpIoT Project

A retail petrol pump automation and telemetry monitoring system built with RethinkDB, Node.js (Express + Socket.io), and React.

---

## Architecture Overview

```
Retail Automation Files_TamalDey/
├── pumpiot_api/           # Backend services
│   ├── api/               # Express + Socket.IO REST & Real-time API
│   │   ├── controllers/   # Handlers (Fuel, Shifts, Employees, Reports, Trx)
│   │   ├── server.js      # Main API entry point (Port 5001)
│   │   └── config.js      # RethinkDB connection details (Port 28015)
│   └── docker-compose.yml # RethinkDB database container
│
└── pumpiot_app/           # Frontend Web Application (React 16)
    ├── src/
    │   ├── Containers/    # Dashboard, Reports, Modules, Forms
    │   ├── Store/         # State management & React Context
    │   └── config.js      # API Endpoint configuration
    └── package.json
```

---

## Port Allocation

| Service | Port | Description |
|---|---|---|
| **RethinkDB Driver** | `28015` | Internal client driver port connected by backend |
| **RethinkDB Web UI** | `8085` | RethinkDB Web Administration Dashboard (`http://localhost:8085`) |
| **Backend API** | `5001` | Express & Socket.io server (`http://localhost:5001/api`) |
| **Frontend UI** | `3001` | React Development Web App (`http://localhost:3001`) |

---

## Default Login Credentials

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `admin123` |

---

## Prerequisites

- **Docker & Docker Compose** (for RethinkDB)
- **Node.js**: v16 (installed via NVM: `nvm use 16`)
- **Yarn**: `1.22.x`

---

## Quick Start Guide

### Option A: Using the Root Script (Recommended)

Run the full stack (RethinkDB, API, and Frontend) in Docker with a single command from the root directory:

```bash
# Start all services
./run.sh start

# Check service status
./run.sh status

# View live logs
./run.sh logs

# Stop all services
./run.sh stop
```

---

### Option B: Using Docker Compose directly

```bash
docker compose up -d --build
```

---

### Option C: Manual / Local Development Mode

In `pumpiot_api`:
```bash
cd pumpiot_api

# If setting up for the first time on a fresh clone, unpack initial seed data:
# tar -xzf docker/db_seed.tar.gz -C docker/

docker compose up -d
```
Verify it is running:
```bash
docker ps --filter "name=pumpiot_api-db-1"
```
The RethinkDB web management dashboard is accessible at: [http://localhost:8085](http://localhost:8085).

---

### 2. Start the Backend API

In `pumpiot_api/api`:
```bash
cd pumpiot_api/api
source ~/.nvm/nvm.sh && nvm use 16
node server.js
```
The API starts on `http://localhost:5001`. Test endpoints:
- Fuel status: `curl http://localhost:5001/api/today-fuel`
- Employees: `curl http://localhost:5001/api/employees/get`

---

### 3. Start the Frontend App

In `pumpiot_app`:
```bash
cd pumpiot_app
source ~/.nvm/nvm.sh && nvm use 16
PORT=3001 yarn start
```
Open your browser at: [http://localhost:3001](http://localhost:3001).

---

## Production Build

To build the frontend for production:
```bash
cd pumpiot_app
source ~/.nvm/nvm.sh && nvm use 16
yarn build
```
The optimized bundle is placed in `pumpiot_app/build`.

