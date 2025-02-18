import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, fetchUserProfile } from "../services/api";
import image from "../assets/image.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingOverlay from "../components/LoadingOverlay";

interface LoginProps {
  showNotification: (message: string, type: "success" | "error") => void;
}

const Login: React.FC<LoginProps> = ({ showNotification }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      showNotification("Invalid email format.", "error");
      return;
    }
    if (password.length < 8) {
      showNotification("Password must be at least 8 characters long.", "error");
      return;
    }
    setLoading(true);

    try {
      // Login API Call
      const response = await login(email, password);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);

        // Fetch user profile
        const profileResponse = await fetchUserProfile();
        const user = profileResponse.data;

        // Simpan role ke localStorage
        localStorage.setItem("role", user.role);

        showNotification("Login successful!", "success");

        // Cek apakah user memiliki signature
        if (user.signature || user.role === "ADMIN" || user.role === "SUPERADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/signature");
        }
      } else {
        showNotification(
          "Invalid email or password. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
      showNotification("Invalid email or password. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen font-poppins bg-white md:flex-row">
      {loading && <LoadingOverlay />}
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
      <div className="flex items-center justify-center flex-[3] p-8 md:p-0 bg-white md:bg-transparent">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-left mb-8">Login</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                onClick={() => setShowPassword(!showPassword)}
                style={{ top: "18px" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-20 py-2 text-white bg-[#9854CB] rounded hover:bg-[#C49BD9] mt-6"
              >
                Login
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-[#9854CB] hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
