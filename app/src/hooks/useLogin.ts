import type {LoginSchema} from "@/schemas/form/login.schema";
import axios from "axios";
import {useNavigate} from "react-router";
import {toast} from "sonner";

export function useLogin() {
  const navigate = useNavigate();

  const handleLogin = async (data: LoginSchema) => {
    try {
      console.log("Submitting login form:", data);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login response:", response.data);
      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong");
    }
  };

  return {handleLogin};
}
