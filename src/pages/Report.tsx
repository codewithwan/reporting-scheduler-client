import React, { useState, useRef, useEffect } from "react";
import illustration from "../assets/animasi-home.png";
import SignatureCanvas from "react-signature-canvas";
import MainLayout from "../components/MainLayout";
import { useLocation } from "react-router-dom";
import { Schedule } from "../models/Schedule";
import { getCustomerById, getProductById } from "../services/api";
import PdfPreview from "../components/PdfPreview";

const Report: React.FC = () => {
  const [activePage, setActivePage] = useState<string>("ReportService");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [taskAnswers, setTaskAnswers] = useState<{ [key: string]: string }>({});
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 500 });
  const [reportData, setReportData] = useState({
    companyName: "",
    address: "",
    customerName: "",
    position: "",
    brand: "",
    model: "",
    serialNumber: "",
    problem: "",
    category: "",
    engineer: "",
    startDate: "",
    time: "",
  });
  const location = useLocation();
  const task: Schedule | null = location.state?.task || null;
  const reportFields: Record<string, keyof typeof reportData> = {
    "Company Name": "companyName",
    Address: "address",
    "Customer Name": "customerName",
    Position: "position",
    Brand: "brand",
    Model: "model",
    "Serial Number": "serialNumber",
    Problem: "problem",
    Category: "category",
    "Engineer Name": "engineer",
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (task?.customerId) {
        try {
          const customer = await getCustomerById(task.customerId);
          const product = await getProductById(task.productId);
          setReportData({
            companyName: customer.company || "",
            address: customer.address || "",
            customerName: customer.name || "",
            position: customer.position || "",
            brand: product.brand || "",
            model: product.model || "",
            serialNumber: product.serialNumber || "",
            problem: task.activity || "",
            category: task.taskName || "",
            engineer: task.engineerName || "",
            startDate: task.startDate
              ? new Date(task.startDate).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "",

            time: task.startDate
              ? new Date(task.startDate).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "",
          });
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
      }
    };

    fetchReport();
  }, [task?.customerId]);

  const [tasks, setTasks] = useState<string[]>([
    "Tugas1",
    "Tugas2",
    "Tugas3",
    "Tugas4",
    "Tugas5",
    "Tugas6",
  ]);

  const handleCheckboxChange = (task: string) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(task)
        ? prevSelectedTasks.filter((t) => t !== task)
        : [...prevSelectedTasks, task]
    );
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.offsetWidth * 0.95,
          height: 100,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const saveSignature = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      console.error(
        "Gagal menyimpan tanda tangan! Pastikan Anda sudah menggambar."
      );
      return;
    }

    const trimmedCanvas = sigCanvas.current.getTrimmedCanvas();

    if (trimmedCanvas.width === 0 || trimmedCanvas.height === 0) {
      console.error("Gagal menyimpan tanda tangan! Canvas kosong.");
      return;
    }

    // Konversi canvas menjadi gambar
    const signatureDataUrl = trimmedCanvas.toDataURL("image/png");

    // Simpan tanda tangan ke state
    setSignature(signatureDataUrl);
  };

  const clearSignature = () => {
    if (sigCanvas.current) sigCanvas.current.clear();
    setSignature(null);
  };

  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = value;
    setTasks(updatedTasks);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSignatureFile(event.target.files[0]);
      setSignature(null);
    }
  };

  const handleTaskAnswer = (task: string, answer: string) => {
    setTaskAnswers((prevAnswers) => ({
      ...prevAnswers,
      [task]: answer,
    }));
  };

  const renderContent = () => {
    const containerClass = "relative pt-28";
    const contentClass = `bg-white shadow-md p-6 md:p-12 mb-6`;

    switch (activePage) {
      case "ReportService":
        return (
          <MainLayout>
            <div className="px-4 sm:px-6 lg:px-8">
              <div className={containerClass}>
                <div className={contentClass}>
                  <h2 className="text-xl md:text-2xl font-semibold text-purple-700">
                    Report Service
                  </h2>
                  <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-700">
                        Data Diri Customer
                      </span>
                    </div>
                    <div className={`h-px w-40 bg-gray-300`}></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-500">
                        Detail Permasalahan
                      </span>
                    </div>
                    <div className={`h-px w-40 bg-gray-300`}></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-500">
                        Checking
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-12 right-10">
                  <img
                    src={illustration}
                    alt="Illustration"
                    className="w-32 md:w-48 drop-shadow-lg"
                  />
                </div>

                <div className="space-y-6">
                  {[
                    "Company Name",
                    "Address",
                    "Customer Name",
                    "Position",
                    "Brand",
                    "Model",
                    "Serial Number",
                  ].map((label, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-semibold">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={
                          reportData[
                            reportFields[label as keyof typeof reportFields]
                          ] || ""
                        }
                        readOnly
                        className="w-full p-3 border bg-gray-200 rounded-lg focus:outline-none"
                      />
                    </div>
                  ))}
                  <div className="flex justify-end mt-6">
                    <button
                      className="bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 transition"
                      onClick={() => setActivePage("DetailPermasalahan")}
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </MainLayout>
        );
      case "DetailPermasalahan":
        return (
          <MainLayout>
            <div className="px-4 sm:px-6 lg:px-8">
              <div className={containerClass}>
                <div className={contentClass}>
                  <h2 className="text-xl md:text-2xl font-semibold text-purple-700">
                    Detail Permasalahan
                  </h2>
                  <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-700">
                        Data Diri Customer
                      </span>
                    </div>
                    <div className={`h-px w-40 bg-purple-500`}></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-700">
                        Detail Permasalahan
                      </span>
                    </div>
                    <div className={`h-px w-40 bg-gray-300`}></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-500">
                        Checking
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-12 right-10">
                  <img
                    src={illustration}
                    alt="Illustration"
                    className="w-32 md:w-48 drop-shadow-lg"
                  />
                </div>
                <div className="space-y-6">
                  {["Problem", "Category", "Engineer Name"].map(
                    (label, index) => (
                      <div key={index} className="space-y-2">
                        <label className="block text-sm font-semibold">
                          {label}
                        </label>

                        <input
                          type="text"
                          value={
                            reportData[
                              reportFields[label as keyof typeof reportFields]
                            ] || ""
                          }
                          placeholder="Type here"
                          className="w-full p-3 border bg-gray-200 rounded-lg focus:outline-none"
                          readOnly
                        />
                      </div>
                    )
                  )}
                  <div className="flex justify-between mt-6">
                    <button
                      className="bg-gray-300 text-gray-700 hover:text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-400 transition"
                      onClick={() => setActivePage("ReportService")}
                    >
                      Kembali
                    </button>
                    <button
                      className="bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 transition"
                      onClick={() => setActivePage("Checking")}
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </MainLayout>
        );

      case "Checking":
        return (
          <MainLayout>
            <div className="px-4 sm:px-6 lg:px-8">
              <div className={containerClass}>
                <div className={contentClass}>
                  <h2 className="text-xl md:text-2xl font-semibold text-purple-700">
                    Checking
                  </h2>
                  <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-700">
                        Data Diri Customer
                      </span>
                    </div>
                    <div className={`h-px w-40 bg-purple-500`}></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-700">
                        Detail Permasalahan
                      </span>
                    </div>
                    <div className={`h-px w-40 bg-purple-500`}></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-700">
                        Checking
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex sm:space-x-3 space-y-3 sm:space-y-0 flex flex-col sm:flex-row">
                      <div className="space-y-2 sm:w-1/2">
                        <label className="block text-sm font-semibold">
                          Work Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2 sm:w-1/2">
                        <label className="block text-sm font-semibold">
                          Work End Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold">
                        Tugas yang Diberikan:
                      </label>
                      {tasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 space-y-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(index.toString())}
                            onChange={() =>
                              handleCheckboxChange(index.toString())
                            }
                            className="w-5 h-5 mt-2 accent-purple-500"
                          />
                          <input
                            type="text"
                            value={task}
                            onChange={(e) =>
                              handleTaskChange(index, e.target.value)
                            }
                            className="mt-1 block w-full rounded p-2"
                            placeholder={`Tugas ${index + 1}`}
                          />
                          {selectedTasks.includes(index.toString()) && (
                            <div className="flex space-x-2">
                              <button
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                  taskAnswers[task] === "yes"
                                    ? "bg-purple-500 text-white"
                                    : "bg-gray-300 text-gray-700"
                                }`}
                                onClick={() => handleTaskAnswer(task, "yes")}
                              >
                                Yes
                              </button>
                              <button
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                  taskAnswers[task] === "no"
                                    ? "bg-purple-500 text-white"
                                    : "bg-gray-300 text-gray-700"
                                }`}
                                onClick={() => handleTaskAnswer(task, "no")}
                              >
                                No
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addTask}
                        className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        + Tambah Tugas
                      </button>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold">
                        Tanda Tangan
                      </label>
                      <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{
                          width: canvasSize.width, // Gunakan ukuran yang responsif
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
                        <button
                          onClick={saveSignature}
                          className="bg-purple-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-purple-600 transition"
                        >
                          Simpan
                        </button>
                      </div>

                      {/* Preview Tanda Tangan */}
                      {signature && (
                        <img
                          src={signature}
                          alt="Tanda tangan"
                          className="mt-2 max-w-[250px] border border-purple-500 bg-white"
                        />
                      )}
                    </div>

                    {/* Upload File Tanda Tangan */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Upload Tanda Tangan
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-purple-500 rounded-md"
                      />
                      {signatureFile && (
                        <img
                          src={URL.createObjectURL(signatureFile)}
                          alt="Uploaded Signature"
                          className="mt-2 w-40 border"
                        />
                      )}
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        className="bg-gray-300 text-gray-700 hover:text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition"
                        onClick={() => setActivePage("DetailPermasalahan")}
                      >
                        Kembali
                      </button>
                      <button
                        className="bg-purple-500 text-white py-3 px-7 rounded-lg font-semibold hover:bg-purple-600 transition"
                        onClick={() => setActivePage("Preview")}
                      >
                        Selesai
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-6 right-10">
                    <img
                      src={illustration}
                      alt="Illustration"
                      className="w-32 md:w-48 drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </MainLayout>
        );

      case "Preview":
        return (
          <MainLayout>
            <div className="px-4 sm:px-6 lg:px-8">
              <div className={containerClass}>
                <div
                  className={`bg-white shadow-md p-6 md:p-12 mb-6 space-y-10`}
                >
                  <h2 className="text-xl md:text-2xl font-semibold text-purple-700">
                    Preview Report
                  </h2>
                  <div className="flex space-x-3 mt-6">
                    <button
                      className="border border-purple-600 hover:text-white py-3 px-10 rounded-md font-semibold hover:bg-purple-500 transition"
                      onClick={() => setActivePage("Checking")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-purple-500 text-white py-3 px-10 rounded-md font-semibold hover:bg-purple-600 transition"
                      onClick={() => setActivePage("Preview")}
                    >
                      Kirim
                    </button>
                  </div>
                </div>
                {/* Put preview pdf here */}
                <div className="border border-gray-300 shadow-lg mt-6">
                  <PdfPreview
                    data={reportData}
                    signature={signature}
                    signatureFile={signatureFile}
                  />
                </div>
                <div className="absolute top-12 right-10">
                  <img
                    src={illustration}
                    alt="Illustration"
                    className="w-32 md:w-48 drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          </MainLayout>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gray-100 min-h-screen">{renderContent()}</div>
  );
};

export default Report;
