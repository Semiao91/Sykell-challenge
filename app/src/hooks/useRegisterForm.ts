import type {RegisterSchema} from "@/schemas/form/register.schema";
import axios from "axios";
import {useNavigate} from "react-router";
import {toast} from "sonner";

export function useRegisterForm() {
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterSchema) => {
    try {
      console.log("Submitting register form:", data);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Registration response:", response.data);
      localStorage.setItem("token", response.data.token);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong");
    }
  };

  return {handleRegister};
}
