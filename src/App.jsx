import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { PredictionProvider } from "./contexts/PredictionContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <PredictionProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fdf",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#10b981",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </div>
          </CartProvider>
        </PredictionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
