# MERN Chat App
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Description

This is a full-stack chat application built with the MERN (MongoDB, Express.js, React, Node.js) stack. It allows users to register, log in, and engage in real-time conversations.

## Project Structure

```
mern-chat-app/
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- config/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- ...
|   |-- package.json
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- data/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- server.js
|-- package.json
|-- ...
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aliaharian/mern-chat-app.git
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   cd mern-chat-app/frontend
   npm install

   cd ../
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory from `.env.example` file with the following content:

   ```plaintext
   PORT=your_backend_server_port
   MONGODB_URI=your_mongodb_connection_string
   SECRET_KEY=your_secret_key_for_jwt
   ```

   Replace `your_backend_server_port`, `your_mongodb_connection_string`, and `your_secret_key_for_jwt` with your desired values.

## Usage

1. Run the backend server (inside root of project):

   ```bash
   npm start
   ```

2. Run the frontend application:

   ```bash
   cd frontend
   npm run dev
   ```

   The application server will be accessible at `http://localhost:5000` by default.
   The application frontend will be accessible at `http://localhost:5173` by default.

## Scripts

- `npm start`: Start the backend server using nodemon.
- `npm run dev`: Start the frontend development server.
- `npm run build`: Build the production-ready frontend application.
- `npm run lint`: Lint the code using ESLint (in both frontend and backend).
- `npm run lint-fix`: Fix linting issues automatically (in both frontend and backend).

## Dependencies

### Backend

- `bcryptjs`: Password hashing library.
- `colors`: Terminal text colorization.
- `dotenv`: Load environment variables from a .env file.
- `express`: Web framework for Node.js.
- `express-async-handler`: Handle async functions in Express.
- `jsonwebtoken`: JWT authentication.
- `mongoose`: MongoDB object modeling.

### Frontend

- `@chakra-ui/react`: UI component library.
- `axios`: HTTP client for making requests.
- `framer-motion`: Animation library.
- `react`: JavaScript library for building user interfaces.
- `react-dom`: Entry point to the React DOM.
- `react-router-dom`: Routing library for React.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
