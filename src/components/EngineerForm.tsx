import { useState, useEffect, useRef } from "react";
import { register, updateUser } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Engineer {
  id?: string;
  name: string;
  email: string;
  role: "ENGINEER";
}

interface EngineerFormProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: "create" | "update";
  engineer: Engineer | null;
  onSubmit: (updatedEngineer: Engineer) => Promise<void>;
}

const EngineerForm = ({
  isOpen,
  onClose,
  modalType,
  engineer,
}: EngineerFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    api?: string;
  }>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (modalType === "update" && engineer) {
      setFormData({
        name: engineer.name,
        email: engineer.email,
        password: "",
      });
    } else {
      setFormData({ name: "", email: "", password: "" });
    }
    setErrors({});
  }, [modalType, engineer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "password" && e.target.value.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async () => {
    setErrors({}); // Reset errors

    if (modalType === "create" && formData.password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      return;
    }

    try {
      if (modalType === "create") {
        await register(formData.email, formData.password, formData.name);
      } else if (modalType === "update" && engineer?.id) {
        await updateUser(engineer.id, {
          name: formData.name,
          email: formData.email,
          role: "ENGINEER",
        });
      }

      onClose();
    } catch (error: any) {
      console.error("Error submitting engineer data:", error);
      setErrors((prev) => ({
        ...prev,
        api: error.response?.data?.message || "Failed to submit data",
      }));
    } finally {
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onMouseDown={handleOverlayClick}
    >
      <div ref={modalRef} className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {modalType === "create" ? "Create Engineer" : "Update Engineer"}
        </h2>
        {errors.api && (
          <p className="text-red-500 text-sm mb-2">{errors.api}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              disabled={modalType === "update"}
            />
          </div>
          <div className=" mb-4">
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full p-2 border rounded-md ${
                  errors.password ? "border-red-500" : ""
                }`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 hover:text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
            >
              {modalType === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EngineerForm;
