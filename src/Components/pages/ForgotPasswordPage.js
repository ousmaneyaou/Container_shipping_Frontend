// src/pages/ForgotPasswordPage.js

import React, { useState } from "react";
import ApiService from "../../services/ApiServices";
import "../Styles/login.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setToken(null);
    setLoading(true);

    try {
      const response = await ApiService.forgotPassword(email);
      setMessage("✅ " + response.message);
      setToken(response.token); // pour test manuel
    } catch (error) {
      const msg = error?.response?.data || "❌ Une erreur est survenue.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Mot de passe oublié</h2>
        {message && (
          <p
            className={`message ${
              String(message).includes("✅") ? "success" : "error"
            }`}
          >
            {String(message)}
          </p>
        )}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>

        {token && (
          <div style={{ marginTop: "1rem", wordBreak: "break-all" }}>
            <strong>Token (à usage de test) :</strong>
            <br />
            <code>{token}</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
