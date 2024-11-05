# Docs CMS

Docs CMS is a content management system that uses Google Docs as the backend for managing content. This project is built with Node.js, Express, MongoDB, and Google APIs.

## Getting Started

### Prerequisites

- Node.js
- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Copy the example environment file and update the variables:
   ```sh
   cp .env.example .env
   ```

   Configure `GOOGLE_CLIENT_SECRET`

3. Build and start the Docker containers:
   ```sh
   docker-compose up --build
   ```

### Running the Application

The application will be available at `http://localhost:8080`

### API Endpoints

- `GET /`: Fetches the HTML content of the first page.
- `GET /admin`: Admin endpoint for managing tokens and fetching documents.

## License

This project is licensed under the MIT License.
