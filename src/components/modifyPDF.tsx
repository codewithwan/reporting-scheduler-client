import { PDFDocument, PDFTextField, rgb } from "pdf-lib";

const ModifyPdf = async (
  data: any,
  signature: string | null,
  signatureFile: File | null
) => {
  const existingPdfBytes = await fetch("/ReportForm.pdf").then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  const setField = (name: string, value: string) => {
    const field = form.getField(name);
    if (field instanceof PDFTextField) {
      field.setText(value);
    } else {
      console.warn(`Field ${name} bukan TextField atau tidak ditemukan.`);
    }
  };

  // Isi field di PDF
  setField("nama_perusahaan", data.companyName);
  setField("alamat", data.address);
  setField("nama_pelanggan", data.customerName);
  setField("posisi", data.position);
  setField("brand", data.brand);
  setField("model", data.model);
  setField("no_seri", data.serialNumber);
  setField("permasalahan", data.problem);
  setField("kategori_pelayanan", data.category);
  setField("nama_engineer", data.engineer);
  setField("tanggal", data.startDate);
  setField("jam", data.time);

  let signatureImage;
  if (signature) {
    // Jika tanda tangan dari SignatureCanvas digunakan
    const signatureBytes = await fetch(signature).then((res) =>
      res.arrayBuffer()
    );
    signatureImage = await pdfDoc.embedPng(signatureBytes);
  } else if (signatureFile) {
    // Jika user mengunggah tanda tangan sebagai file
    const reader = new FileReader();
    reader.readAsArrayBuffer(signatureFile);
    await new Promise((resolve) => (reader.onload = resolve));

    const signatureBytes = new Uint8Array(reader.result as ArrayBuffer);
    signatureImage = await pdfDoc.embedPng(signatureBytes);
  }

  if (signatureImage) {
    const page = pdfDoc.getPages()[1]; // Ambil halaman pertama
    page.drawImage(signatureImage, {
      x: 50,
      y: 363,
      width: 150,
      height: 80,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};

export default ModifyPdf;
