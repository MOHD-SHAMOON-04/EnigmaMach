# Enigma Machine Server API Documentation

## Overview

This document outlines the API endpoints for the Enigma Machine server. The server provides functionality to generate and retrieve Enigma machine configurations. It uses Express.js for the API and Mongoose for interacting with a MongoDB database.

## Endpoints

### 1. `GET /enigma`

*   **Description**: Retrieves an existing Enigma machine configuration by its ID.
*   **Request Parameters**:
    *   `machineId` (string, required): The ID of the Enigma machine to retrieve.
*   **Response**:
    *   **Success (200 OK)**:
        ```json
        {
          "rotors": string[],
          "reflector": string,
          "plugboard": string
        }
        ```
    *   **Error (400 Bad Request)**:
        ```json
        { "error": "machineId must be provided" }
        ```
    *   **Error (404 Not Found)**:
        ```json
        { "error": "Machine not found" }
        ```
    *   **Error (500 Internal Server Error)**:
        ```json
        { "error": "Internal server error" }
        ```
*   **Rate Limiting**: Soft limiter applied.

### 2. `POST /enigma`

*   **Description**: Generates a new Enigma machine configuration based on a seed and email, saves it to the database, and sends the configuration via email.
*   **Request Body**:
    ```json
    {
      "seed": string,
      "email": string
    }
    ```
*   **Response**:
    *   **Success (200 OK)**:
        ```json
        { "message": "Email sent successfully" }
        ```
    *   **Error (400 Bad Request)**:
        ```json
        { "error": "Both seed and email must be valid" }
        ```
    *   **Error (400 Bad Request)**:
        ```json
        { "error": "Machine with this seed already exists" }
        ```
    *   **Error (500 Internal Server Error)**:
        ```json
        { "error": "Failed to create machine or send email" }
        ```
    *   **Error (500 Internal Server Error)**:
        ```json
        { "error": "Failed to send email" }
        ```
*   **Rate Limiting**: Hard limiter applied.

---
## Rate Limiting
The API employs rate limiting to prevent abuse:
* **Soft Limiter**: Applied to `GET /enigma`, allows for 100 requests per 15 minutes.
* **Hard Limiter**: Applied to `POST /enigma`, allows for 10 requests per 15 minutes.

If the rate limit is exceeded, the server returns a 429 status code with the following JSON response:

```json
{ "error": "Too many requests, please try again later." }
```

---
## Email Service
The server uses Nodemailer to send Enigma machine configurations via email. The email includes:
* Share links to view the configuration.
* The machine ID.
* A QR code for easy configuration import.
* Configuration details (rotors, reflector, plugboard).

---
## Validation
The server uses the following validators:

* `validString(seed)`: Validates the seed string.
* `validEmail(email)`: Validates the email address.

---
## Technologies Used
- Node.js
- Express.js
- TypeScript
- Mongoose
- express-rate-limit
- Nodemailer
- dotenv
- cors

---