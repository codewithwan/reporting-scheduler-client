import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import image from "../assets/image.png";
import { saveSignature } from "../services/api";

const CreateSignature: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 200 });
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateSize = () => {
      setCanvasSize({
        width: window.innerWidth > 768 ? 800 : window.innerWidth * 0.85,
        height: 400,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async () => {
    try {
      let dataToSend: string;

      if (uploadedFile) {
        // Jika file diunggah, konversi ke base64
        dataToSend = await convertFileToBase64(uploadedFile);
      } else if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        // Jika tanda tangan ada di canvas, ambil sebagai base64
        dataToSend = sigCanvas.current.toDataURL();
      } else {
        console.error("Tidak ada tanda tangan yang bisa disimpan.");
        return;
      }

      await saveSignature(dataToSend);
      navigate("/dashboard")
    } catch (error) {
      console.error("Gagal menyimpan tanda tangan:", error);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) sigCanvas.current.clear();
    setUploadedFile(null);
  };

  return (
    <div className="relative flex flex-col min-h-screen font-poppins bg-white md:flex-row">
      <div className="relative flex items-center justify-center bg-white md:flex-[2] md:order-2 rounded-tl-2xl rounded-bl-2xl md:bg-[#DDACF5]">
        <div
          className="absolute w-[80%] h-[50%] bg-[#DDACF5] rounded-tl-lg rounded-bl-lg rounded-tr-lg"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        ></div>
        <img
          src={image}
          alt="Description"
          className="relative w-4/5 h-auto"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <div className="ms-0 sm:ms-20 my-auto items-center justify-start flex-[3] p-8 md:p-0 bg-white md:bg-transparent">
        <div className="w-full max-w-2xl space-y-3">
          <h2 className="text-3xl font-bold text-left">Buat Tanda Tangan</h2>
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            minWidth={2}
            maxWidth={4}
            canvasProps={{
              width: canvasSize.width,
              height: canvasSize.height,
              className: "border w-full rounded-lg bg-white",
            }}
          />

          <div className="flex space-x-2">
            <button
              onClick={clearSignature}
              className="bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 transition"
            >
              Hapus
            </button>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
          className="border p-2 my-3 w-full sm:w-2/3"
        />
        <br />
        <button
          onClick={handleSave}
          className="bg-purple-500 text-white px-3 py-2 rounded-md text-lg"
        >
          Simpan
        </button>
      </div>
    </div>
  );
};

export default CreateSignature;
