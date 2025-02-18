import { useState, useEffect } from "react";
import ModifyPdf from "./modifyPDF";

interface PdfPreviewProps {
  data: any;
  signature: any;
  signatureFile: File | null;
  profileSignature: any;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({
  data,
  signature,
  signatureFile,
  profileSignature
}) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    const generatePdf = async () => {
      if (!data) return;

      const pdfBlob = await ModifyPdf(data, signature, signatureFile, profileSignature);
      if (pdfBlob) {
        setPdfUrl(URL.createObjectURL(pdfBlob));
      } else {
        console.error("Failed to generate PDF: Unsupported signature format.");
      }
    };

    generatePdf();
  }, [data, signatureFile]);

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
