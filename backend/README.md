# lastbaar-backend

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the backend folder with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   ```
3. Start the server:
   ```sh
   npm start
   ```

## API Endpoints
- POST   /api/login
- GET    /api/workers
- GET    /api/attendance
- GET    /api/leaves
- GET    /api/advances
- GET    /api/reports

## Render Deployment
- Set build/run command: `npm install && npm start`
- Set environment variables:
  - `PORT=5000`
  - `MONGODB_URI=your_mongodb_atlas_uri`
- Web Service, Node version 18+ recommended
- Expose port 5000

---

**Frontend and backend must be deployed as separate services on Render.**
