import { useState, useEffect } from "react";
import ModifyPdf from "./modifyPDF";

interface PdfPreviewProps {
  data: any;
  signature: any;
  signatureFile: File | null;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ data, signature, signatureFile }) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    const generatePdf = async () => {
      if (!data) return;
      console.log("Generating PDF with data:", data);
      if (signatureFile) console.log("Using Signature File:", signatureFile.name);

      const pdfBlob = await ModifyPdf(data, signature, signatureFile);
      setPdfUrl(URL.createObjectURL(pdfBlob));
    };

    generatePdf();
  }, [data, signatureFile]); // 🔹 Perbaikan: Tambahkan signatureFile agar PDF diperbarui

  return (
    <div className="preview-container">
      {pdfUrl ? (
        <iframe src={pdfUrl} width="100%" height="600px"></iframe>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PdfPreview;
