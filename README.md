# Enigma Machine Project

This project is a recreation of the famous Enigma machine, a cipher device used by the German military during World War II. It consists of a React-based frontend and a Node.js/Express.js backend.

## Features

*   **Enigma Machine Simulation:** Accurately simulates the Enigma machine's encryption and decryption processes.
*   **Customizable Settings:** Allows users to configure rotor positions and plugboard connections.
*   **Virtual Keyboard:** Provides an interactive virtual keyboard for input.
*   **Text Fields:** Displays both input and output text.
*   **API Integration:** Fetches machine configurations from a backend API.
*   **Email Integration:** Generates a new Enigma machine configuration based on a seed and email, saves it to the database, and sends the configuration via email.
*   **Rate Limiting:** Implements rate limiting to prevent abuse of the API.

## Technologies Used

### Frontend

*   React
*   TypeScript
*   Tailwind CSS
*   React Router

### Backend

*   Node.js
*   Express.js
*   Mongoose
*   express-rate-limit
*   Nodemailer
*   dotenv
*   cors

## Project Structure
```
root/
|-- src/                     # Frontend source code
|   |-- components/          # React components
|   |-- pages/               # React pages/routes
|   |-- utils/               # Utility functions (Main Enigma engine)
|   |-- types.ts             # TypeScript types
|   |-- App.tsx              # Main application component
|   
|-- server/                  # Backend source code
|   |-- src/
|       |-- models/          # Mongoose models
|       |-- routes/          # Express routes
|       |-- services/        # Backend services (database, mailer)
|       |-- utils/           # Utility functions (pseudo-random Enigma generator, etc)
|       |-- index.ts         # Main server file
|       |-- types.ts         # TypeScript types
|   |-- package.json         # Project dependencies
|   |-- tsconfig.json        # TypeScript configs
|   |-- README.md            # Backend docs
|   
|-- package.json             # Project dependencies
|-- README.md                # `project.this` file
```

## Setup Instructions

### Frontend

1.  At the root level
2.  Install dependencies: `npm install`
3.  Create a `.env` file in this directory and configure the following environment variable:
    ```bash
    VITE_API_URL=http://localhost:5000 # or the url where the backend is hosted
    ```
4.  Start the development server: `npm run dev`

### Backend

1.  Navigate to the `server` directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the `server` directory and configure the following environment variables:
    ```bash
    PORT=5000
    BASE_URL=http://localhost:5173 #  or the url where the frontend is hosted
    MONGODB_URI=<Your MongoDB Connection String>
    EMAIL_USER=<Your Email Address>
    EMAIL_PASS=<Your Email Password or App Password>
    ```
4.  Start the server: `npm run dev`

## API Endpoints
The backend provides the following API endpoints:
*   `GET /enigma`: Retrieves an existing Enigma machine configuration by its ID.
*   `POST /enigma`: Generates a new Enigma machine configuration.

See `server/README.md` for detailed API documentation.

## Key Components
*   **EnigmaEngine (src/utils/Enigma.ts):** This class contains the core logic for simulating the Enigma machine, including rotor mappings, reflector behavior, and plugboard settings.
*   **NewMachine.tsx (src/pages/NewMachine.tsx):** This component provides the form for generating a new Enigma machine configuration.
*   **Enigma.tsx (src/pages/Enigma.tsx):** This component simulates the Enigma machine interface, allowing users to input text and view the encrypted output.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to suggest improvements