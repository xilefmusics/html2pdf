const { outlinePdfFactory } = require('@lillallol/outline-pdf');
const pdfLib = require('pdf-lib');

const tocToOutlineString = toc => {
  return toc
    .map(({ title, page }) => `${page}||${title}`)
    .join('\n');
}

module.exports = async (pdfBuffer, toc) => {
  const outlinePdf = outlinePdfFactory(pdfLib);
  const outline = tocToOutlineString(toc);
  const pdfDoc = await outlinePdf({ pdf: pdfBuffer, outline });
  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
};
