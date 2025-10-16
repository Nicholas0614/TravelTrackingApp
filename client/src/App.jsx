import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/Homepage";
import Navbar from "./components/Header";
import AdminPage from "./pages/AdminPage";
import AddAreaForm from "./components/AreaAddForm";
import ShoppingPage from "./pages/ShoppingPage";
import StayPage from "./pages/StayPage";
import FoodPage from "./pages/FoodPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import { CookiesProvider } from "react-cookie";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaceDetailPage from "./components/PlaceDetailPage";
import { Toaster } from "react-hot-toast";
import TripDetailPage from "./components/TripDetailPage";
import WishlistPage from "./pages/WishlistPage";

function AppContent() {
  // routes where Navbar should NOT appear

  return (
    <>
      <Navbar />
      <Toaster position="bottom-right" reverseOrder={false} />

      <Routes>
        {/* Homepage */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shopping" element={<ShoppingPage />} />
        <Route path="/stay" element={<StayPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Admin Page (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="/add-area" element={<AddAreaForm />} />
        <Route path="/places/:id" element={<PlaceDetailPage />} />
        <Route path="/trips/:id" element={<TripDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <CookiesProvider>
      <Router>
        <AppContent />
      </Router>
    </CookiesProvider>
  );
}
