import React, { useState } from "react";
import ApiService from "../../services/ApiServices";
import { toast } from "react-toastify";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const response = await ApiService.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success(response.message || "Mot de passe modifié avec succès.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Erreur lors de la modification."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Changer le mot de passe</h2>
      <div>
        <label>Mot de passe actuel</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Nouveau mot de passe</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Changer le mot de passe</button>
    </form>
  );
}
