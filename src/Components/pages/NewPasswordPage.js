import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiServices";
import "../Styles/login.css";
import { toast } from "react-toastify";

export default function NewPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      toast.error("Lien invalide ou expiré.");
      navigate("/login");
    } else {
      setToken(t);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const response = await ApiService.resetPassword({ token, newPassword });
      toast.success(response.message || "Mot de passe réinitialisé.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Erreur lors de la réinitialisation du mot de passe."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Réinitialisation du mot de passe</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Réinitialiser</button>
        </form>
      </div>
    </div>
  );
}
