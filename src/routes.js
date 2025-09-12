const express = require('express');
const multer = require('multer');
const print = require('./print');
const merge = require('./merge');
const outline = require('./outline');
const router = express.Router();

const upload = multer();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ status: 'ok' });
});

/**
 * @swagger
 * /print:
 *   post:
 *     summary: Convert multiple HTML files to a single PDF
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.post('/print', upload.array('files'), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const pdfBuffers = await Promise.all(
      req.files.map(file => print(file.buffer.toString('utf-8')))
    );

    const mergedPdf = await merge(pdfBuffers);

    const toc = req.files.map((file, idx) => ({
      title: file.originalname || `Document ${idx + 1}`,
      page: idx + 1,
    }));

    const outlinedPdf = await outline(mergedPdf, toc);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="output.pdf"',
      'Content-Length': outlinedPdf.length,
    });
    res.end(outlinedPdf);
  } catch (err) {
    next(err);
  }
});

module.exports = router;