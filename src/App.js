import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/common/Navbar";
import Footer from "./Components/common/Footer";
import PromoBanner from "./Components/common/PromoBanner";
import ContainerBookingList from "./Components/pages/ContainerBookingList";
import AddColisForm from "./Components/pages/AddColisForm";
import RegisterPage from "./Components/pages/RegisterPage";
import LoginPage from "./Components/pages/LoginPage";
import ForgotPasswordPage from "./Components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./Components/pages/ResetPasswordPage";
import ColisListPage from "./Components/pages/ColisListPage";
import ColisDetailPage from "./Components/pages/ColisDetailPage";
import AddContainerBookingForm from "./Components/common/Admin/AddContainerBookingForm";
import UpdateContainerBookingForm from "./Components/common/Admin/UpdateContainerBookingForm";
import Help from "./Components/common/Admin/Help";
import HomePage from "./Components/common/HomePage";
import LogisticsIntro from "./Components/common/LogisticsIntro";
import ContactPage from "./Components/common/ContactPage";
import AdminColisPage from "./Components/common/Admin/AdminColisPage";
import AdminPage from "./Components/common/Admin/AdminPage";
import UserBookingHistoryPage from "./Components/common/Admin/UserBookingHistoryPage";
import AccountPage from "./Components/common/Admin/AccountPage";
import NewPasswordPage from "./Components/pages/NewPasswordPage";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="app-container">
      <Navbar />
      {isHomePage && <PromoBanner />}

      <main className="main-content">
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route
            path="/"
            element={
              <>
                <LogisticsIntro />
                <ContainerBookingList
                  dateFilter="2025-07-01"
                  colisWeight={3000}
                />
                <HomePage />
              </>
            }
          />

          {/* Routes d'authentification */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/change-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password" element={<NewPasswordPage />} />

          {/* Routes de gestion des colis */}
          <Route path="/ajouter-colis/:bookingId" element={<AddColisForm />} />
          <Route path="/colis" element={<ColisListPage />} />
          <Route path="/colis/:colisId" element={<ColisDetailPage />} />

          {/* Routes admin */}
          <Route
            path="/ajouter-conteneur"
            element={<AddContainerBookingForm />}
          />
          <Route
            path="/update-conteneur/:id"
            element={<UpdateContainerBookingForm />}
          />

          {/* Aide */}
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/colis" element={<AdminColisPage />} />
          <Route
            path="/mes-reservations"
            element={<UserBookingHistoryPage />}
          />
          <Route path="/mon-compte" element={<AccountPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
