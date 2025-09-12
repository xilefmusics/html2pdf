const express = require('express');
const indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = diff[0] * 1e3 + diff[1] / 1e6;
    const log = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: durationMs.toFixed(2),
    };
    if (res.locals.error) {
      log.error = res.locals.error.message || res.locals.error;
    }
    console.log(JSON.stringify(log));
  });
  next();
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status || 500).json({ error: err.message });
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HTML2PDF Service',
      version: '1.0.0',
      description: 'API for converting multiple HTML files to a single PDF',
    },
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/', indexRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});