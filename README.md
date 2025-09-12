# html2pdf
A simple micro service to print multiple html files into one pdf

## Installation

To install the necessary dependencies, run:

```
npm install
```

## Usage

To start the server, run:

```
npm start
```

The server will be running on `http://localhost:3000`.

## API Documentation

Interactive API docs are available at [http://localhost:3000/](http://localhost:3000/).

## Endpoints

- `GET /health`  
  Health check endpoint. Returns `{ status: "ok" }`.

- `POST /print`  
  Accepts multiple HTML files as `multipart/form-data` (field: `files`). Returns a combined PDF.

## Notes

- If you see HTTP 304 responses on `/health`, caching may be involved. The service disables ETag and sets `Cache-Control: no-store` for health checks.

## License

[![GPL-3.0](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)