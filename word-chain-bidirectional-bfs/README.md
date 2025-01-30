# Word Chain Solver API

A RESTful API built with Deno and the Oak framework that solves word chain problems using a bidirectional BFS algorithm. The API allows users to find a sequence of words connecting a start word to an end word, logs each request to a SQLite database, and includes a migration system for database schema management.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Word Chain Solver:** Find a sequence of words connecting a start word to an end word.
- **Logging:** Each request is logged in the database with details including start word, end word, solution, and execution time.
- **Database Migrations:** Manage database schema changes with a migration system.
- **Modular Architecture:** Separation of concerns with clear boundaries between controllers, repositories, and services.
<!-- - **Testing:** Comprehensive tests for controllers and repositories using Deno's testing library. -->

## Prerequisites

- **[Deno](https://deno.land/#installation):** Ensure you have Deno installed. Follow the [official installation guide](https://deno.land/#installation) if you haven't installed it yet.
- **SQLite:** The project uses SQLite as the database. Ensure you have SQLite installed or use the in-memory database for testing.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/word-chain-solver-api.git
   cd word-chain-solver-api
   ```

2. **Install Dependencies**

   Deno manages dependencies via imports, so there's no need for a package manager like `npm`. Ensure all import URLs are accessible.

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory to configure environment variables as needed. Example:

   ```env
   DATABASE_URL=./database.sqlite
   PORT=8000
   ```

## Usage

1.  **Run Database Migrations**

    Before starting the server, apply the necessary database migrations to set up the schema.

    ```bash
    deno task migrate
    ```

2.  **Start the Server**

    ```bash
    deno task start
    ```

    The server will start and listen on the configured port (default is `8000`).

3.  **Make API Requests**

    Use tools like `curl`, `Postman`, or any HTTP client to interact with the API.

<!-- 4.  **Testing**

    The project includes comprehensive tests for both the controller and repository components using Deno's built-in testing library.

    ```bash
    deno task test
    ``` -->

## API Endpoints

### `POST /word-chain`

Finds a word chain solution from a start word to an end word.

- **URL:** `/word-chain`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**

  ```json
  {
    "start": "startWord",
    "end": "endWord"
  }
  ```

- **Success Response:**

  - **Code:** `200 OK`
  - **Content:**

    ```json
    {
      "solution": ["startWord", "word1", "word2", "...", "endWord"],
      "elapsed_time_ms": 1234
    }
    ```

- **Error Responses:**

  - **Code:** `400 Bad Request`

    - **When:** Missing request body, missing `start` or `end` fields, or no solution found.
    - **Content:**

      ```json
      {
        "error": "Error message detailing the issue."
      }
      ```

  - **Code:** `500 Internal Server Error`

    - **When:** Unexpected server errors.
    - **Content:**

      ```json
      {
        "error": "Internal server error message."
      }
      ```
