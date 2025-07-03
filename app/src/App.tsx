import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ui/atoms/protectedRoute";
import { Toaster } from "./components/ui/atoms/sonner";
import { DashboardPage } from "./components/ui/pages/dashboard";
import { LoginPage } from "./components/ui/pages/login";
import { RegisterPage } from "./components/ui/pages/register";


function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;