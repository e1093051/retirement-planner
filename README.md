# Retirement Monte Carlo Simulator

A prototype web application that estimates potential retirement outcomes using Monte Carlo simulation.  
Users provide basic financial inputs and a risk profile, and the system returns summary statistics along with a visualization of sample simulated wealth paths.

---

## Features

- Monte Carlo simulation of long-term retirement wealth
- Summary statistics:
  - Median wealth
  - 10th / 90th percentile wealth
  - Probability of reaching a target retirement amount
- Visualization of sample simulation paths (fixed number of representative paths)
- Clear separation between API boundary, business logic, and presentation
- API boundary validation with automated tests
- Modern React frontend with typed API client 
- Development-time frontend/backend decoupling via proxy

---

## Architecture Overview

This project is implemented as a single Spring Boot application that serves both frontend and backend components.

### Components

1. **Frontend (React)**
  - Built with React + TypeScript using Vite
  - Uses a dedicated API client layer for backend interaction
  - Communicates with the backend via HTTP (JSON)

2. **Backend (REST API)**
  - Implemented using Spring Boot
  - Exposes a REST endpoint for running simulations
  - Validates input, executes Monte Carlo logic, and returns results as JSON

### Request Flow

1. User opens the frontend (React application)
2. User submits simulation inputs  
   → Frontend sends `POST /api/simulate`
3. Backend:
  - Deserializes JSON into a request object
  - Validates request at the API boundary
  - Executes simulation logic
  - Serializes results into JSON
4. Frontend renders summary statistics and sample path chart

During development, frontend requests are proxied to the backend via Vite.

---
## Technology Stack
### Backend:
- **Framework**: Spring Boot (embedded Tomcat)
- **Language**: Java 17
- **Web Layer**: Spring MVC
- **JSON Processing**: Jackson
- **Validation**: Jakarta Bean Validation
- **Testing**: JUnit 5, MockMvc
### Frontend:
- **Framework**: React
- **Language**: Typescript
- **Build tool**: Vite
- **Charting**: Chart.js
- **HTTP**: Fetch API (via typed API client)
---

## Getting Started

### Prerequisites

- Java 17 or newer
- Node.js
- Maven Wrapper

### Run the application

1. Start the backend
```bash
./mvnw spring-boot:run
```
- Backend runs at http://localhost:8080/

2. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
- Backend runs at http://localhost:5173/ (or as indicated in the terminal)
