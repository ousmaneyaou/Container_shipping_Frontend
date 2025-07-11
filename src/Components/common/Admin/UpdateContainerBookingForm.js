import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ApiService from "../../../services/ApiServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Styles/UpdateContainerBookingForm.css";

const UpdateContainerBookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const existingBooking = location.state?.booking || null;

  const [formData, setFormData] = useState({
    poidsMax: "",
    volumeMax: "",
    prixEstime: "",
    dateDepart: "",
    dateArrivee: "",
    dateReservation: "",
    lieuEnlevement: "",
    destination: "",
    tailleConteneur: "40ft",
    statut: "EN_COURS",
    insuranceId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger les données existantes
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = existingBooking;
        if (!data) {
          data = await ApiService.getBookingById(id); // crée cette méthode si tu ne l’as pas
        }

        setFormData({
          poidsMax: data.poidsMax || "",
          volumeMax: data.volumeMax || "",
          prixEstime: data.prixEstime || "",
          dateDepart: data.dateDepart?.slice(0, 16) || "",
          dateArrivee: data.dateArrivee?.slice(0, 16) || "",
          dateReservation: data.dateReservation?.slice(0, 16) || "",
          lieuEnlevement: data.lieuEnlevement || "",
          destination: data.destination || "",
          tailleConteneur: data.tailleConteneur || "40ft",
          statut: data.statut || "EN_COURS",
          insuranceId: data.insuranceId || "",
        });
      } catch (err) {
        console.error("Erreur chargement : ", err);
        toast.error("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, [id, existingBooking]);

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
      };

      await ApiService.updateBooking(id, payload);

      toast.success("Réservation mise à jour avec succès !");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Erreur update :", err);
      setError("Une erreur est survenue. Vérifiez les champs.");
      toast.error("Erreur : impossible de modifier le conteneur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-container-form">
      <h2>Modifier le conteneur</h2>
      <form onSubmit={handleSubmit}>
        {/* mêmes champs que AddForm */}
        {/* utilise formData.*, handleChange, required, etc. */}
        {/* voir code précédent, tu peux copier-coller les <label> avec les bons noms */}

        <label>
          Poids max (kg):
          <input
            type="number"
            name="poidsMax"
            value={formData.poidsMax}
            onChange={handleChange}
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
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Mise à jour en cours..." : "Mettre à jour le conteneur"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default UpdateContainerBookingForm;
