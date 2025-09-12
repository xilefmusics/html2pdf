const { PDFDocument } = require('pdf-lib');

module.exports = async (pdfBuffers) => {
  const mergedPdf = await PDFDocument.create();
  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  const mergedBuffer = await mergedPdf.save();
  return Buffer.from(mergedBuffer);
}
