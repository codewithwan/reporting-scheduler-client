import { PDFDocument, PDFTextField } from "pdf-lib";

const ModifyPdf = async (
  data: any,
  signature: string | null,
  signatureFile: File | null,
  profileSignature: string | null // Signature dari user aktif
) => {
  const existingPdfBytes = await fetch("/ReportForm.pdf").then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
  console.log("Profile Signature dari User Aktif:", profileSignature);

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
  setField("permasalahan", data.activity);
  setField("kategori_pelayanan", data.category);
  setField("nama_engineer", data.engineer);
  setField("tanggal", data.startDate);
  setField("jam", data.time);

  // Fungsi untuk memproses tanda tangan (profileSignature atau customer signature)
  const embedSignature = async (sig: string | null, sigFile: File | null) => {
    if (sig) {
      // Jika tanda tangan dari SignatureCanvas digunakan (format PNG)
      const signatureBytes = await fetch(sig).then((res) => res.arrayBuffer());
      return await pdfDoc.embedPng(signatureBytes);
    } else if (sigFile) {
      // Jika user mengunggah tanda tangan sebagai file
      const reader = new FileReader();
      reader.readAsArrayBuffer(sigFile);
      await new Promise((resolve) => (reader.onload = resolve));

      const signatureBytes = new Uint8Array(reader.result as ArrayBuffer);

      // Deteksi format file
      if (sigFile.type === "image/png") {
        return await pdfDoc.embedPng(signatureBytes);
      } else if (
        sigFile.type === "image/jpeg" ||
        sigFile.type === "image/jpg"
      ) {
        return await pdfDoc.embedJpg(signatureBytes);
      } else {
        console.warn("Format gambar tidak didukung. Gunakan PNG atau JPEG.");
        return null;
      }
    }
    return null;
  };

  // Embed kedua tanda tangan
  const customerSignatureImage = await embedSignature(signature, signatureFile);

  const page = pdfDoc.getPages()[1];

  // Gambar tanda tangan customer (posisi lama tetap)
  if (customerSignatureImage) {
    page.drawImage(customerSignatureImage, {
      x: 345,
      y: 363,
      width: 150,
      height: 80,
    });
  }

  // Gambar tanda tangan profile user (posisi baru)
  let profileSignatureImage;
  if (profileSignature) {
    const profileSignatureBytes = await fetch(profileSignature).then((res) =>
      res.arrayBuffer()
    );
    profileSignatureImage = await pdfDoc.embedPng(profileSignatureBytes);
  }

  // Tambahkan profile signature ke halaman PDF
  if (profileSignatureImage) {
    const page = pdfDoc.getPages()[1]; // Ambil halaman ke-2
    page.drawImage(profileSignatureImage, {
      x: 50, // Atur posisi sesuai kebutuhan
      y: 363, // Atur posisi sesuai kebutuhan
      width: 150,
      height: 80,
    });
  } else {
    console.warn("Profile Signature tidak ditemukan atau gagal di-embed.");
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};

export default ModifyPdf;
