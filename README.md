# html2pdf
A simple micro service to print multiple html files into one pdf

## Installation & Usage

You can run the service either locally with Node.js or using Docker.

### Run Locally

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start the server:**
   ```sh
   npm start
   ```

   The server will be running at [http://localhost:3000](http://localhost:3000).

---

### Run with Docker

#### Use Prebuilt Image

1. **Pull the image:**
   ```sh
   docker pull xilefmusics/html2pdf:latest
   ```

2. **Run the container:**
   ```sh
   docker run -p 3000:3000 xilefmusics/html2pdf:latest
   ```

#### Build Your Own Image

1. **Build the Docker image:**
   ```sh
   docker build -t html2pdf .
   ```

2. **Run your local image:**
   ```sh
   docker run -p 3000:3000 html2pdf
   ```

#### Environment Variables

- `CONCURRENCY` (optional): Number of concurrent Chromium pages (default: 4).

Example:
```sh
docker run -p 3000:3000 -e CONCURRENCY=2 xilefmusics/html2pdf:latest
```

---

## API Documentation

Interactive API docs are available at [http://localhost:3000/](http://localhost:3000/).

## Endpoints

- `GET /health`  
  Health check endpoint. Returns `{ status: "ok" }`.

- `POST /print`  
  Accepts multiple HTML files as `multipart/form-data` (field: `files`). Returns a combined PDF.  
  Optional boolean parameter `outline` to generate a PDF outline (table of contents/bookmarks).

---

[![GPL-3.0](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)