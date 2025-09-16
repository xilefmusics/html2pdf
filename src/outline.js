const { outlinePdfFactory } = require('@lillallol/outline-pdf');
const pdfLib = require('pdf-lib');

module.exports = async (pdfBuffer, outline) => {
  const outlinePdf = outlinePdfFactory(pdfLib);
  const pdfDoc = await outlinePdf({ pdf: pdfBuffer, outline });
  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
};
