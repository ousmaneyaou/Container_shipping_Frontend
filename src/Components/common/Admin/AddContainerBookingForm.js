import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../services/ApiServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Styles/AddContainerBookingForm.css";

const AddContainerBookingForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    poidsMax: "",
    volumeMax: "",
    prixEstime: "",
    dateDepart: "",
    dateArrivee: "",
    dateReservation: new Date().toISOString().slice(0, 16),
    lieuEnlevement: "",
    destination: "",
    tailleConteneur: "40ft",
    statut: "EN_COURS",
    insuranceId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Construction du payload dans le bon format
      const payload = {
        poidsMax: parseFloat(formData.poidsMax),
        volumeMax: parseFloat(formData.volumeMax),
        prixEstime: parseFloat(formData.prixEstime),
        dateDepart: new Date(formData.dateDepart).toISOString(),
        dateArrivee: new Date(formData.dateArrivee).toISOString(),
        dateReservation: new Date(formData.dateReservation).toISOString(),
        lieuEnlevement: formData.lieuEnlevement.trim(),
        destination: formData.destination.trim(),
        tailleConteneur: formData.tailleConteneur,
        statut: formData.statut,
        insuranceId: formData.insuranceId
          ? parseInt(formData.insuranceId)
          : null,
        colisList: [],
      };

      const response = await ApiService.createBooking(payload);

      toast.success("Conteneur ajouté avec succès !", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/", {
          state: { newBooking: response.data },
        });
      }, 1000);
    } catch (err) {
      console.error("Erreur lors de l’ajout :", err);
      setError(
        "Une erreur est survenue lors de l’ajout. Vérifiez les champs requis."
      );
      toast.error("Erreur : impossible d’ajouter le conteneur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-container-form">
      <h2>Ajouter un conteneur</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Poids max (kg):
          <input
            type="number"
            name="poidsMax"
            value={formData.poidsMax}
            onChange={handleChange}
            min="1"
            step="0.1"
            required
          />
        </label>

        <label>
          Volume max (m³):
          <input
            type="number"
            name="volumeMax"
            value={formData.volumeMax}
            onChange={handleChange}
            min="1"
            step="0.1"
            required
          />
        </label>

        <label>
          Prix estimé ($):
          <input
            type="number"
            name="prixEstime"
            value={formData.prixEstime}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </label>

        <label>
          Lieu d’enlèvement:
          <input
            type="text"
            name="lieuEnlevement"
            value={formData.lieuEnlevement}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Destination:
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date de départ:
          <input
            type="datetime-local"
            name="dateDepart"
            value={formData.dateDepart}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date d’arrivée:
          <input
            type="datetime-local"
            name="dateArrivee"
            value={formData.dateArrivee}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date de réservation:
          <input
            type="datetime-local"
            name="dateReservation"
            value={formData.dateReservation}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Taille du conteneur:
          <select
            name="tailleConteneur"
            value={formData.tailleConteneur}
            onChange={handleChange}
            required
          >
            <option value="20ft">20ft</option>
            <option value="30ft">30ft</option>
            <option value="40ft">40ft</option>
          </select>
        </label>

        <label>
          Statut:
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            required
          >
            <option value="EN_COURS">En cours</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="LIVRE">Livré</option>
            <option value="ANNULE">Annulé</option>
          </select>
        </label>

        <label>
          Assurance (ID optionnel) :
          <input
            type="number"
            name="insuranceId"
            value={formData.insuranceId}
            onChange={handleChange}
            min="1"
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Ajout en cours..." : "Ajouter le conteneur"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddContainerBookingForm;
